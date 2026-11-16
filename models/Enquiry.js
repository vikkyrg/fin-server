const mongoose = require('mongoose');

const LOAN_TYPES = [
  'personal-loan',
  'loan-against-securities',
  'business-loan',
  'home-loan',
  'loan-against-property',
  'education-loan',
  'gold-loan'
];

const ENQUIRY_STATUSES = [
  'New',
  'Contacted',
  'In Progress',
  'Converted',
  'Closed'
];

const EnquirySchema = new mongoose.Schema({
  enquiryId: {
    type: String,
    unique: true,
    index: true
  },
  loanType: {
    type: String,
    required: [true, 'Loan type is required'],
    enum: LOAN_TYPES,
    index: true
  },
  // Common Fields
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true
  },
  mobileNumber: {
    type: String,
    required: [true, 'Mobile number is required'],
    match: [/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true
  },
  requiredLoanAmount: {
    type: Number,
    required: [true, 'Required loan amount is required'],
    min: [10000, 'Loan amount must be at least ₹10,000']
  },
  privacyConsent: {
    type: Boolean,
    required: [true, 'Privacy consent is required'],
    default: true
  },

  // Dynamic / Loan-Specific Form Fields
  loanDetails: {
    // Personal Loan & Home Loan
    employmentType: {
      type: String,
      enum: ['Salaried', 'Self-Employed Professional', 'Self-Employed Business', 'Other', '']
    },
    monthlyIncome: {
      type: Number
    },

    // Loan Against Securities
    securityType: {
      type: String,
      enum: ['Mutual Funds', 'Shares / Equities', 'Bonds / Debentures', 'Insurance Policies', 'Other', '']
    },
    approximateInvestmentValue: {
      type: Number
    },

    // Business Loan
    businessType: {
      type: String,
      enum: ['Proprietorship', 'Partnership', 'Pvt Ltd Company', 'LLP', 'Other', '']
    },
    businessVintage: {
      type: String // e.g. "Less than 1 year", "1-3 years", "3-5 years", "5+ years"
    },
    annualTurnover: {
      type: Number
    },

    // Home Loan & Loan Against Property
    propertyValue: {
      type: Number
    },
    propertyLocation: {
      type: String,
      trim: true
    },
    propertyType: {
      type: String,
      enum: ['Residential', 'Commercial', 'Industrial', 'Plot / Land', 'Other', '']
    },

    // Education Loan
    courseName: {
      type: String,
      trim: true
    },
    institutionName: {
      type: String,
      trim: true
    },
    studyLocation: {
      type: String,
      enum: ['Domestic (India)', 'International / Overseas', '']
    },
    educationExpenses: {
      type: Number
    },

    // Gold Loan
    approximateGoldWeight: {
      type: Number // in grams
    },
    goldPurity: {
      type: String // e.g. "18K", "20K", "22K", "24K"
    }
  },

  // Status & Administration Tracking
  status: {
    type: String,
    enum: ENQUIRY_STATUSES,
    default: 'New',
    index: true
  },
  adminNotes: [
    {
      note: { type: String, required: true },
      addedBy: { type: String, default: 'Admin' },
      addedAt: { type: Date, default: Date.now }
    }
  ],
  isDeleted: {
    type: Boolean,
    default: false,
    index: true
  }
}, { timestamps: true });

// Pre-save hook to generate human-readable sequential Enquiry ID
EnquirySchema.pre('save', async function(next) {
  if (!this.enquiryId) {
    const datePrefix = new Date().getFullYear().toString().slice(-2);
    const count = await mongoose.model('Enquiry').countDocuments();
    this.enquiryId = `ENQ${datePrefix}-${(count + 1001)}`;
  }
  next();
});

module.exports = {
  Enquiry: mongoose.model('Enquiry', EnquirySchema),
  LOAN_TYPES,
  ENQUIRY_STATUSES
};
