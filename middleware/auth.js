const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const { DEFAULT_ADMIN } = require('../controllers/authController');

const protectAdmin = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized: No token provided'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'loan_consultancy_secret_fallback');
    
    // Check fallback dev admin ID
    if (decoded.id === DEFAULT_ADMIN.id) {
      req.admin = DEFAULT_ADMIN;
      return next();
    }

    const admin = await Admin.findById(decoded.id).select('-password');
    if (!admin || !admin.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: Admin not found or inactive'
      });
    }
    req.admin = admin;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized: Invalid or expired token'
    });
  }
};

module.exports = { protectAdmin };
