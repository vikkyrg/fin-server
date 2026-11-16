const { Blog, BlogCategory } = require('../models/Blog');

// @desc    Get published blogs (Public)
// @route   GET /api/blogs
// @access  Public
const getBlogs = async (req, res, next) => {
  try {
    const { category, search, page = 1, limit = 9, admin } = req.query;
    const filter = admin === 'true' ? {} : { isPublished: true };

    if (category && category !== 'All') {
      filter.category = category;
    }

    if (search && search.trim() !== '') {
      filter.$or = [
        { title: new RegExp(search.trim(), 'i') },
        { summary: new RegExp(search.trim(), 'i') },
        { content: new RegExp(search.trim(), 'i') }
      ];
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 9;
    const skip = (pageNum - 1) * limitNum;

    const [blogs, total] = await Promise.all([
      Blog.find(filter).sort({ publishedAt: -1, createdAt: -1 }).skip(skip).limit(limitNum),
      Blog.countDocuments(filter)
    ]);

    res.json({
      success: true,
      data: {
        blogs,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single blog by slug
// @route   GET /api/blogs/:slug
// @access  Public
const getBlogBySlug = async (req, res, next) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug });
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }

    if (!blog.isPublished && req.query.admin !== 'true') {
      return res.status(404).json({
        success: false,
        message: 'Blog is unpublished'
      });
    }

    // Get related blogs
    const relatedBlogs = await Blog.find({
      _id: { $ne: blog._id },
      category: blog.category,
      isPublished: true
    }).limit(3);

    res.json({
      success: true,
      data: {
        blog,
        relatedBlogs
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create blog
// @route   POST /api/admin/blogs
// @access  Private (Admin)
const createBlog = async (req, res, next) => {
  try {
    const { title, slug, category, author, featuredImage, summary, content, readTime, seoTitle, seoDescription, tags, isPublished } = req.body;

    const finalSlug = (slug || title).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const existing = await Blog.findOne({ slug: finalSlug });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'A blog with this slug already exists'
      });
    }

    const blog = await Blog.create({
      title,
      slug: finalSlug,
      category,
      author,
      featuredImage,
      summary,
      content,
      readTime,
      seoTitle,
      seoDescription,
      tags,
      isPublished: isPublished !== undefined ? isPublished : true
    });

    res.status(201).json({
      success: true,
      message: 'Blog created successfully',
      data: blog
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update blog
// @route   PUT /api/admin/blogs/:id
// @access  Private (Admin)
const updateBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    res.json({
      success: true,
      message: 'Blog updated successfully',
      data: blog
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete blog
// @route   DELETE /api/admin/blogs/:id
// @access  Private (Admin)
const deleteBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    res.json({
      success: true,
      message: 'Blog deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle blog publish
// @route   PATCH /api/admin/blogs/:id/publish
// @access  Private (Admin)
const toggleBlogPublish = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    blog.isPublished = !blog.isPublished;
    await blog.save();

    res.json({
      success: true,
      message: `Blog has been ${blog.isPublished ? 'published' : 'unpublished'}`,
      data: blog
    });
  } catch (error) {
    next(error);
  }
};

// Categories CRUD
const getBlogCategories = async (req, res, next) => {
  try {
    const categories = await BlogCategory.find().sort({ name: 1 });
    res.json({ success: true, data: categories });
  } catch (error) {
    next(error);
  }
};

const createBlogCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const category = await BlogCategory.create({ name, slug, description });
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBlogs,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
  toggleBlogPublish,
  getBlogCategories,
  createBlogCategory
};
