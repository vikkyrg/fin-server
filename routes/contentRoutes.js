const express = require('express');
const router = express.Router();
const {
  getFAQs,
  createFAQ,
  updateFAQ,
  deleteFAQ,
  getLendingPartners,
  createLendingPartner,
  updateLendingPartner,
  deleteLendingPartner,
  getNews,
  getNewsBySlug,
  createNews,
  updateNews,
  deleteNews,
  getPageContent,
  savePageContent,
  getSettings,
  updateSettings,
  getMediaList,
  uploadMediaFile,
  deleteMediaFile
} = require('../controllers/contentController');
const { protectAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public
router.get('/faqs', getFAQs);
router.get('/partners', getLendingPartners);
router.get('/news', getNews);
router.get('/news/:slug', getNewsBySlug);
router.get('/page/:pageKey', getPageContent);
router.get('/settings', getSettings);

// Admin FAQs
router.post('/admin/faqs', protectAdmin, createFAQ);
router.put('/admin/faqs/:id', protectAdmin, updateFAQ);
router.delete('/admin/faqs/:id', protectAdmin, deleteFAQ);

// Admin Partners
router.post('/admin/partners', protectAdmin, createLendingPartner);
router.put('/admin/partners/:id', protectAdmin, updateLendingPartner);
router.delete('/admin/partners/:id', protectAdmin, deleteLendingPartner);

// Admin News
router.post('/admin/news', protectAdmin, createNews);
router.put('/admin/news/:id', protectAdmin, updateNews);
router.delete('/admin/news/:id', protectAdmin, deleteNews);

// Admin Page Content
router.put('/admin/page/:pageKey', protectAdmin, savePageContent);

// Admin Settings
router.put('/admin/settings', protectAdmin, updateSettings);

// Admin Media
router.get('/admin/media', protectAdmin, getMediaList);
router.post('/admin/media/upload', protectAdmin, upload.single('file'), uploadMediaFile);
router.delete('/admin/media/:id', protectAdmin, deleteMediaFile);

module.exports = router;
