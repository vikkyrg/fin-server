const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const Admin = require('../models/Admin');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'loan_consultancy_secret_fallback', {
    expiresIn: '7d'
  });
};

// Default fallback credentials for testing / offline database mode
const DEFAULT_ADMIN = {
  id: 'dev_admin_super_id',
  email: 'admin@finadviseloans.com',
  name: 'System Administrator',
  role: 'superadmin',
  isActive: true
};

// @desc    Admin login
// @route   POST /api/admin/auth/login
// @access  Public
const loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    const cleanEmail = email.toLowerCase().trim();
    const isDbConnected = mongoose.connection && mongoose.connection.readyState === 1;

    // 1. Try DB lookup if database is connected
    if (isDbConnected) {
      let admin = await Admin.findOne({ email: cleanEmail });

      // Auto-create default admin in MongoDB if collection is empty
      if (!admin && cleanEmail === DEFAULT_ADMIN.email) {
        const count = await Admin.countDocuments();
        if (count === 0) {
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash('Admin@12345', salt);
          admin = await Admin.create({
            name: DEFAULT_ADMIN.name,
            email: DEFAULT_ADMIN.email,
            password: hashedPassword,
            role: 'superadmin',
            isActive: true
          });
          console.log('[Auth] Default administrator account auto-initialized in database');
        }
      }

      if (admin) {
        if (!admin.isActive) {
          return res.status(403).json({
            success: false,
            message: 'Your admin account has been deactivated'
          });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
          return res.status(401).json({
            success: false,
            message: 'Invalid credentials. Please verify your password.'
          });
        }

        admin.lastLogin = new Date();
        await admin.save();

        return res.json({
          success: true,
          message: 'Login successful',
          data: {
            token: generateToken(admin._id),
            admin: {
              id: admin._id,
              name: admin.name,
              email: admin.email,
              role: admin.role,
              lastLogin: admin.lastLogin
            }
          }
        });
      }
    }

    // 2. Dev Fallback: If DB is not yet running/connected or admin document was not found,
    // permit default admin login if credentials match the designated default credentials
    if (cleanEmail === DEFAULT_ADMIN.email && password === 'Admin@12345') {
      return res.json({
        success: true,
        message: 'Login successful (Advisory Portal)',
        data: {
          token: generateToken(DEFAULT_ADMIN.id),
          admin: DEFAULT_ADMIN
        }
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Invalid credentials. Please use admin@finadviseloans.com / Admin@12345'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current admin profile
// @route   GET /api/admin/auth/me
// @access  Private (Admin)
const getAdminProfile = async (req, res) => {
  res.json({
    success: true,
    data: {
      admin: req.admin
    }
  });
};

module.exports = {
  loginAdmin,
  getAdminProfile,
  DEFAULT_ADMIN
};
