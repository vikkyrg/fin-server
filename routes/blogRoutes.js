const express = require('express');
const router = express.Router();
const {
  getBlogs,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
  toggleBlogPublish,
  getBlogCategories,
  createBlogCategory
} = require('../controllers/blogController');
const { protectAdmin } = require('../middleware/auth');

// Public
router.get('/', getBlogs);
router.get('/categories', getBlogCategories);
router.get('/:slug', getBlogBySlug);

// Admin
router.post('/admin', protectAdmin, createBlog);
router.put('/admin/:id', protectAdmin, updateBlog);
router.delete('/admin/:id', protectAdmin, deleteBlog);
router.patch('/admin/:id/publish', protectAdmin, toggleBlogPublish);
router.post('/admin/categories', protectAdmin, createBlogCategory);

module.exports = router;
