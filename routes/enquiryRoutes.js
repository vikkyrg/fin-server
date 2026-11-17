const express = require('express');
const router = express.Router();
const {
  submitEnquiry,
  getHomepageEnquiries,
  getEnquiriesByLoanType,
  getEnquiryById,
  updateEnquiryStatus,
  addEnquiryNote,
  deleteEnquiry,
  getDashboardStats,
  getUnreadCounts,
  markEnquiriesAsRead
} = require('../controllers/enquiryController');
const { protectAdmin } = require('../middleware/auth');
const { enquiryLimiter } = require('../middleware/errorHandler');

// Public route to submit an enquiry
router.post('/submit', enquiryLimiter, submitEnquiry);

// Admin routes
router.get('/admin/unread-counts', protectAdmin, getUnreadCounts);
router.patch('/admin/mark-read', protectAdmin, markEnquiriesAsRead);
router.get('/admin/stats', protectAdmin, getDashboardStats);
router.get('/admin/homepage', protectAdmin, getHomepageEnquiries);
router.get('/admin', protectAdmin, (req, res, next) => {
  if (req.query.source === 'homepage') {
    return getHomepageEnquiries(req, res, next);
  }
  return getDashboardStats(req, res, next);
});
router.get('/admin/by-type/:loanType', protectAdmin, getEnquiriesByLoanType);
router.get('/admin/:id', protectAdmin, getEnquiryById);
router.patch('/admin/:id/status', protectAdmin, updateEnquiryStatus);
router.post('/admin/:id/notes', protectAdmin, addEnquiryNote);
router.delete('/admin/:id', protectAdmin, deleteEnquiry);

module.exports = router;
