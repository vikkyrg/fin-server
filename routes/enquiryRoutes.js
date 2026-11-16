const express = require('express');
const router = express.Router();
const {
  submitEnquiry,
  getEnquiriesByLoanType,
  getEnquiryById,
  updateEnquiryStatus,
  addEnquiryNote,
  deleteEnquiry,
  getDashboardStats
} = require('../controllers/enquiryController');
const { protectAdmin } = require('../middleware/auth');
const { enquiryLimiter } = require('../middleware/errorHandler');

// Public route to submit an enquiry
router.post('/submit', enquiryLimiter, submitEnquiry);

// Admin routes
router.get('/admin/stats', protectAdmin, getDashboardStats);
router.get('/admin/by-type/:loanType', protectAdmin, getEnquiriesByLoanType);
router.get('/admin/:id', protectAdmin, getEnquiryById);
router.patch('/admin/:id/status', protectAdmin, updateEnquiryStatus);
router.post('/admin/:id/notes', protectAdmin, addEnquiryNote);
router.delete('/admin/:id', protectAdmin, deleteEnquiry);

module.exports = router;
