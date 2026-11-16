const mongoose = require('mongoose');

const BlogCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: String
}, { timestamps: true });

const BlogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Blog title is required'],
    trim: true
  },
  slug: {
    type: String,
    required: [true, 'Slug is required'],
    unique: true,
    trim: true,
    index: true
  },
  category: {
    type: String,
    default: 'Loan Guidance'
  },
  author: {
    type: String,
    default: 'Financial Advisory Team'
  },
  featuredImage: {
    type: String,
    default: ''
  },
  summary: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  readTime: {
    type: String,
    default: '5 min read'
  },
  seoTitle: String,
  seoDescription: String,
  tags: [String],
  isPublished: {
    type: Boolean,
    default: true,
    index: true
  },
  publishedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = {
  Blog: mongoose.model('Blog', BlogSchema),
  BlogCategory: mongoose.model('BlogCategory', BlogCategorySchema)
};
