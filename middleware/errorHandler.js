const rateLimit = require('express-rate-limit');

// Rate limiter for enquiry submissions: max 15 submissions per 15 minutes per IP
const enquiryLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  message: {
    success: false,
    message: 'Too many enquiries submitted from this IP, please try again in 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Admin login rate limiter: max 10 attempts per 15 minutes
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: 'Too many login attempts. Please try again after 15 minutes.'
  }
});

// Global error handler
const errorHandler = (err, req, res, next) => {
  console.error('[Error Details]:', err.stack || err);
  
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = {
  enquiryLimiter,
  loginLimiter,
  errorHandler
};
