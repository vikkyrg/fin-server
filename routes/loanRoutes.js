const express = require('express');
const router = express.Router();
const {
  getAllLoans,
  getLoanBySlug,
  createLoan,
  updateLoan,
  toggleLoanPublish
} = require('../controllers/loanController');
const { protectAdmin } = require('../middleware/auth');

// Public
router.get('/', getAllLoans);
router.get('/:slug', getLoanBySlug);

// Admin
router.post('/admin', protectAdmin, createLoan);
router.put('/admin/:slug', protectAdmin, updateLoan);
router.patch('/admin/:slug/publish', protectAdmin, toggleLoanPublish);

module.exports = router;
