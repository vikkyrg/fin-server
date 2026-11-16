const express = require('express');
const router = express.Router();
const { loginAdmin, getAdminProfile } = require('../controllers/authController');
const { protectAdmin } = require('../middleware/auth');
const { loginLimiter } = require('../middleware/errorHandler');

router.post('/login', loginLimiter, loginAdmin);
router.get('/me', protectAdmin, getAdminProfile);

module.exports = router;
