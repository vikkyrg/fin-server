const mongoose = require('mongoose');

// FAQ Model
const FAQSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  category: { type: String, default: 'General' }, // General, Personal, Business, Home, etc.
  orderIndex: { type: Number, default: 0 },
  isPublished: { type: Boolean, default: true }
}, { timestamps: true });

// Lending Partner Model
const LendingPartnerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, enum: ['Public Sector Bank', 'Private Bank', 'NBFC', 'Housing Finance Company'], default: 'Private Bank' },
  logo: { type: String, default: '' },
  description: String,
  featured: { type: Boolean, default: true },
  orderIndex: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// News & Updates Model
const NewsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  source: { type: String, default: 'Financial Desk' },
  sourceUrl: String,
  summary: { type: String, required: true },
  content: { type: String, required: true },
  image: String,
  publishedDate: { type: Date, default: Date.now },
  isPublished: { type: Boolean, default: true }
}, { timestamps: true });

// Dynamic Page / Section CMS Content Model
const PageSchema = new mongoose.Schema({
  pageKey: { type: String, required: true, unique: true, index: true }, // e.g. "home", "about", "cibil", "contact", "footer"
  title: String,
  sections: { type: mongoose.Schema.Types.Mixed, default: {} },
  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String]
  },
  lastUpdatedBy: String
}, { timestamps: true });

// System Settings Model
const SettingSchema = new mongoose.Schema({
  companyName: { type: String, default: 'FinAdvise Loan Consultancy' },
  tagline: { type: String, default: 'Your Trusted Gateway to Smarter Financing' },
  contactEmail: { type: String, default: 'contact@finadviseloans.com' },
  contactPhone: { type: String, default: '+91 98765 43210' },
  alternatePhone: { type: String, default: '+91 80000 12345' },
  officeAddress: { type: String, default: 'Tower B, 4th Floor, Financial District, Bandra Kurla Complex, Mumbai, Maharashtra 400051' },
  workingHours: { type: String, default: 'Mon - Sat: 9:30 AM to 6:30 PM' },
  disclaimerText: { type: String, default: 'FinAdvise is an independent loan consultancy and financial services facilitator. We partner with RBI registered Banks and NBFCs. We do not charge upfront fees for standard loan advisory.' },
  socialLinks: {
    facebook: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    twitter: { type: String, default: '' },
    instagram: { type: String, default: '' }
  }
}, { timestamps: true });

// Media Library Model
const MediaSchema = new mongoose.Schema({
  originalName: String,
  fileName: String,
  filePath: String,
  mimeType: String,
  size: Number
}, { timestamps: true });

module.exports = {
  FAQ: mongoose.model('FAQ', FAQSchema),
  LendingPartner: mongoose.model('LendingPartner', LendingPartnerSchema),
  News: mongoose.model('News', NewsSchema),
  Page: mongoose.model('Page', PageSchema),
  Setting: mongoose.model('Setting', SettingSchema),
  Media: mongoose.model('Media', MediaSchema)
};
