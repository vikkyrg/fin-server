const mongoose = require('mongoose');

const LoanSchema = new mongoose.Schema({
  slug: {
    type: String,
    required: true,
    unique: true,
    index: true,
    enum: [
      'personal-loan',
      'loan-against-securities',
      'business-loan',
      'home-loan',
      'loan-against-property',
      'education-loan',
      'gold-loan'
    ]
  },
  name: {
    type: String,
    required: [true, 'Loan name is required'],
    trim: true
  },
  tagline: {
    type: String,
    default: ''
  },
  bannerImage: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: 'Banknote'
  },
  shortDescription: {
    type: String,
    required: true
  },
  fullDescription: {
    type: String,
    required: true
  },
  indicativeInterestRate: {
    type: String,
    default: 'Competitive Market Rates'
  },
  maxTenure: {
    type: String,
    default: 'Flexible'
  },
  maxLoanAmount: {
    type: String,
    default: 'As per eligibility'
  },
  keyBenefits: [{
    title: String,
    description: String,
    icon: String
  }],
  eligibilityCriteria: [{
    criteria: String,
    detail: String
  }],
  requiredDocuments: [{
    category: String, // e.g. "Identity Proof", "Income Proof", "Property Documents"
    items: [String]
  }],
  featuresAndAdvantages: [{
    title: String,
    description: String
  }],
  applicationProcess: [{
    stepNumber: Number,
    stepTitle: String,
    stepDescription: String
  }],
  faqs: [{
    question: String,
    answer: String
  }],
  isPublished: {
    type: Boolean,
    default: true
  },
  orderIndex: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('Loan', LoanSchema);
