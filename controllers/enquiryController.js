const { Enquiry, LOAN_TYPES, ENQUIRY_STATUSES } = require('../models/Enquiry');

// Validate loan specific details
const validateLoanDetails = (loanType, loanDetails = {}, source = 'loandetail') => {
  // If enquiry originates from Homepage, loan-specific deep verification fields are optional
  const normSource = String(source || '').toLowerCase();
  if (normSource === 'homepage') {
    return [];
  }

  const errors = [];
  switch (loanType) {
    case 'personal-loan':
      if (!loanDetails.employmentType) errors.push('Employment Type is required for Personal Loan');
      if (!loanDetails.monthlyIncome) errors.push('Monthly Income is required for Personal Loan');
      break;
    case 'loan-against-securities':
      if (!loanDetails.securityType) errors.push('Security Type is required');
      if (!loanDetails.approximateInvestmentValue) errors.push('Approximate Investment Value is required');
      break;
    case 'business-loan':
      if (!loanDetails.businessType) errors.push('Business Type is required');
      if (!loanDetails.businessVintage) errors.push('Business Vintage is required');
      if (!loanDetails.annualTurnover) errors.push('Annual Turnover is required');
      break;
    case 'home-loan':
      if (!loanDetails.propertyValue) errors.push('Property Value is required');
      if (!loanDetails.propertyLocation) errors.push('Property Location is required');
      if (!loanDetails.employmentType) errors.push('Employment Type is required');
      break;
    case 'loan-against-property':
      if (!loanDetails.propertyType) errors.push('Property Type is required');
      if (!loanDetails.propertyLocation) errors.push('Property Location is required');
      if (!loanDetails.propertyValue) errors.push('Approximate Property Value is required');
      break;
    case 'education-loan':
      if (!loanDetails.courseName) errors.push('Course Name is required');
      if (!loanDetails.institutionName) errors.push('Institution Name is required');
      if (!loanDetails.studyLocation) errors.push('Study Location is required');
      if (!loanDetails.educationExpenses) errors.push('Education Expenses are required');
      break;
    case 'gold-loan':
      if (!loanDetails.approximateGoldWeight) errors.push('Approximate Gold Weight is required');
      break;
    case 'vehicle-loan':
      // Vehicle details optional in general enquiry form
      break;
    case 'other':
      // General advisory
      break;
    default:
      errors.push('Invalid loan category specified');
  }
  return errors;
};

// @desc    Submit Loan Enquiry (Public)
// @route   POST /api/enquiries/submit
// @access  Public
const submitEnquiry = async (req, res, next) => {
  try {
    const {
      loanType,
      fullName,
      mobileNumber,
      email,
      city,
      requiredLoanAmount,
      privacyConsent,
      source,
      requirement,
      loanDetails
    } = req.body;

    const validLoanTypes = [...LOAN_TYPES, 'other'];

    // Validate common fields
    if (!loanType || !validLoanTypes.includes(loanType)) {
      return res.status(400).json({
        success: false,
        message: `Valid loanType is required (${validLoanTypes.join(', ')})`
      });
    }

    if (!fullName || !mobileNumber) {
      return res.status(400).json({
        success: false,
        message: 'Full Name and Mobile Number are mandatory'
      });
    }

    // Default fallbacks for homepage quick enquiries
    const isHomepage = String(source || '').toLowerCase() === 'homepage';
    const resolvedEmail = email && email.trim() ? email.trim().toLowerCase() : 'not-provided@finadvise.in';
    const resolvedCity = city && city.trim() ? city.trim() : (isHomepage ? 'General Enquiry' : '');
    const resolvedAmount = requiredLoanAmount ? Number(requiredLoanAmount) : 500000;
    const resolvedSource = isHomepage ? 'homepage' : 'loandetail';
    const resolvedRequirement = requirement ? requirement.trim() : (loanDetails?.remarks || '');

    if (!resolvedCity && !isHomepage) {
      return res.status(400).json({
        success: false,
        message: 'City is mandatory'
      });
    }

    // Validate mobile number format (10 digit Indian number)
    const mobileRegex = /^[6-9]\d{9}$/;
    if (!mobileRegex.test(mobileNumber.trim())) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9'
      });
    }

    // Validate email format if provided
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (resolvedEmail !== 'not-provided@finadvise.in' && !emailRegex.test(resolvedEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address'
      });
    }

    if (privacyConsent === false) {
      return res.status(400).json({
        success: false,
        message: 'You must agree to the privacy policy to submit your enquiry'
      });
    }

    // Validate loan-specific fields (bypassed if source === 'Homepage')
    const loanDetailErrors = validateLoanDetails(loanType, loanDetails, resolvedSource);
    if (loanDetailErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: loanDetailErrors[0],
        errors: loanDetailErrors
      });
    }

    // Duplicate submission check: same mobile number and same loan type within last 10 minutes
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
    const existingRecent = await Enquiry.findOne({
      mobileNumber: mobileNumber.trim(),
      loanType,
      source: resolvedSource,
      createdAt: { $gte: tenMinutesAgo }
    });

    if (existingRecent) {
      return res.status(429).json({
        success: false,
        message: 'We already received your enquiry recently. Our loan advisor will contact you shortly.'
      });
    }

    const newEnquiry = await Enquiry.create({
      loanType,
      fullName: fullName.trim(),
      mobileNumber: mobileNumber.trim(),
      email: resolvedEmail,
      city: resolvedCity,
      requiredLoanAmount: resolvedAmount,
      privacyConsent: privacyConsent !== false,
      source: resolvedSource,
      requirement: resolvedRequirement,
      loanDetails: loanDetails || {},
      isRead: false,
      readAt: null
    });

    res.status(201).json({
      success: true,
      message: 'Your loan enquiry has been submitted successfully! An expert loan consultant will connect with you within 24 hours.',
      data: {
        enquiryId: newEnquiry.enquiryId,
        loanType: newEnquiry.loanType,
        source: newEnquiry.source,
        createdAt: newEnquiry.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Homepage Enquiries (Admin)
// @route   GET /api/admin/enquiries/homepage
// @access  Private (Admin)
const getHomepageEnquiries = async (req, res, next) => {
  try {
    const {
      status,
      loanType,
      search,
      startDate,
      endDate,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const query = {
      source: { $in: ['homepage', 'Homepage'] },
      isDeleted: false
    };

    // Filter by Loan Type
    if (loanType && loanType !== 'all') {
      query.loanType = loanType;
    }

    // Filter by Status
    if (status && ENQUIRY_STATUSES.includes(status)) {
      query.status = status;
    }

    // Date Range Filter
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        query.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.createdAt.$lte = end;
      }
    }

    // Search Filter across Name, Mobile, Email, EnquiryID, Requirement
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { fullName: searchRegex },
        { mobileNumber: searchRegex },
        { email: searchRegex },
        { enquiryId: searchRegex },
        { requirement: searchRegex }
      ];
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * limitNum;
    const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    const [enquiries, total] = await Promise.all([
      Enquiry.find(query).sort(sort).skip(skip).limit(limitNum),
      Enquiry.countDocuments(query)
    ]);

    // Compute status counts for Homepage enquiries
    const statusCounts = await Enquiry.aggregate([
      { $match: { source: { $in: ['homepage', 'Homepage'] }, isDeleted: false } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const countsMap = {
      Total: total,
      New: 0,
      Contacted: 0,
      'In Progress': 0,
      Converted: 0,
      Closed: 0
    };
    statusCounts.forEach(sc => {
      countsMap[sc._id] = sc.count;
    });

    res.json({
      success: true,
      data: {
        enquiries,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum)
        },
        counts: countsMap
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Enquiries for specific Loan Type (Admin)
// @route   GET /api/admin/enquiries/by-type/:loanType
// @access  Private (Admin)
const getEnquiriesByLoanType = async (req, res, next) => {
  try {
    const { loanType } = req.params;
    const {
      status,
      search,
      startDate,
      endDate,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    if (!LOAN_TYPES.includes(loanType)) {
      return res.status(400).json({
        success: false,
        message: `Invalid loan category: ${loanType}`
      });
    }

    const query = {
      loanType,
      source: { $nin: ['homepage', 'Homepage'] },
      isDeleted: false
    };

    // Filter by Status
    if (status && ENQUIRY_STATUSES.includes(status)) {
      query.status = status;
    }

    // Date Range Filter
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        query.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        // End of the day
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.createdAt.$lte = end;
      }
    }

    // Search Filter across Name, Mobile, Email, EnquiryID, City
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { fullName: searchRegex },
        { mobileNumber: searchRegex },
        { email: searchRegex },
        { enquiryId: searchRegex },
        { city: searchRegex }
      ];
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * limitNum;
    const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    const [enquiries, total] = await Promise.all([
      Enquiry.find(query).sort(sort).skip(skip).limit(limitNum),
      Enquiry.countDocuments(query)
    ]);

    // Compute status counts for this specific loan type
    const statusCounts = await Enquiry.aggregate([
      { $match: { loanType, source: { $nin: ['homepage', 'Homepage'] }, isDeleted: false } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const countsMap = {
      Total: total,
      New: 0,
      Contacted: 0,
      'In Progress': 0,
      Converted: 0,
      Closed: 0
    };
    statusCounts.forEach(sc => {
      countsMap[sc._id] = sc.count;
    });

    res.json({
      success: true,
      data: {
        enquiries,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum)
        },
        counts: countsMap
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Single Enquiry by ID
// @route   GET /api/admin/enquiries/:id
// @access  Private (Admin)
const getEnquiryById = async (req, res, next) => {
  try {
    const enquiry = await Enquiry.findOne({ _id: req.params.id, isDeleted: false });
    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: 'Enquiry not found'
      });
    }

    res.json({
      success: true,
      data: enquiry
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update Enquiry Status
// @route   PATCH /api/admin/enquiries/:id/status
// @access  Private (Admin)
const updateEnquiryStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!status || !ENQUIRY_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Valid values: ${ENQUIRY_STATUSES.join(', ')}`
      });
    }

    const enquiry = await Enquiry.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: 'Enquiry not found'
      });
    }

    res.json({
      success: true,
      message: `Enquiry status updated to "${status}"`,
      data: enquiry
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add Admin Note to Enquiry
// @route   POST /api/admin/enquiries/:id/notes
// @access  Private (Admin)
const addEnquiryNote = async (req, res, next) => {
  try {
    const { note } = req.body;
    if (!note || note.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Note content cannot be empty'
      });
    }

    const enquiry = await Enquiry.findById(req.params.id);
    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: 'Enquiry not found'
      });
    }

    enquiry.adminNotes.unshift({
      note: note.trim(),
      addedBy: req.admin ? req.admin.name : 'Admin',
      addedAt: new Date()
    });

    await enquiry.save();

    res.json({
      success: true,
      message: 'Note added successfully',
      data: enquiry
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Soft Delete Enquiry
// @route   DELETE /api/admin/enquiries/:id
// @access  Private (Admin)
const deleteEnquiry = async (req, res, next) => {
  try {
    const enquiry = await Enquiry.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true },
      { new: true }
    );

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: 'Enquiry not found'
      });
    }

    res.json({
      success: true,
      message: 'Enquiry deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Unread Enquiry Counts (Admin)
// @route   GET /api/enquiries/admin/unread-counts
// @access  Private (Admin)
const getUnreadCounts = async (req, res, next) => {
  try {
    const unreadAggregate = await Enquiry.aggregate([
      {
        $match: {
          isDeleted: false,
          isRead: false
        }
      },
      {
        $group: {
          _id: {
            loanType: '$loanType',
            isHomepage: {
              $in: [{ $toLower: '$source' }, ['homepage']]
            }
          },
          count: { $sum: 1 }
        }
      }
    ]);

    const counts = {
      homepage: 0,
      'personal-loan': 0,
      'loan-against-securities': 0,
      'business-loan': 0,
      'home-loan': 0,
      'loan-against-property': 0,
      'education-loan': 0,
      'gold-loan': 0,
      'vehicle-loan': 0
    };

    let totalUnread = 0;
    let unreadHomepage = 0;
    let unreadLoans = 0;

    unreadAggregate.forEach(item => {
      const isHome = item._id.isHomepage;
      const count = item.count;
      totalUnread += count;

      if (isHome) {
        counts.homepage += count;
        unreadHomepage += count;
      } else {
        const loanKey = item._id.loanType;
        if (counts.hasOwnProperty(loanKey)) {
          counts[loanKey] += count;
        }
        unreadLoans += count;
      }
    });

    res.json({
      success: true,
      data: {
        counts,
        totalUnread,
        unreadHomepage,
        unreadLoans,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark Enquiries as Read (Admin)
// @route   PATCH /api/enquiries/admin/mark-read
// @access  Private (Admin)
const markEnquiriesAsRead = async (req, res, next) => {
  try {
    const { category, cutoffTime } = req.body;

    if (!category) {
      return res.status(400).json({
        success: false,
        message: 'Category is required (e.g. "homepage" or loan category slug)'
      });
    }

    const query = {
      isDeleted: false,
      isRead: false
    };

    // Cutoff time filter if supplied to avoid race conditions with enquiries arriving after page open
    if (cutoffTime) {
      const parsedCutoff = new Date(cutoffTime);
      if (!isNaN(parsedCutoff.getTime())) {
        query.createdAt = { $lte: parsedCutoff };
      }
    }

    if (category === 'homepage') {
      query.source = { $in: ['homepage', 'Homepage'] };
    } else {
      if (!LOAN_TYPES.includes(category)) {
        return res.status(400).json({
          success: false,
          message: `Invalid loan category: ${category}`
        });
      }
      query.loanType = category;
      query.source = { $nin: ['homepage', 'Homepage'] };
    }

    const now = new Date();
    const result = await Enquiry.updateMany(query, {
      $set: {
        isRead: true,
        readAt: now
      }
    });

    res.json({
      success: true,
      message: `Enquiries for "${category}" marked as read`,
      data: {
        category,
        markedCount: result.modifiedCount,
        readAt: now
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Overall Dashboard Statistics
// @route   GET /api/admin/dashboard/stats
// @access  Private (Admin)
const getDashboardStats = async (req, res, next) => {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const [
      totalEnquiries,
      newEnquiries,
      contactedEnquiries,
      inProgressEnquiries,
      convertedEnquiries,
      closedEnquiries,
      recentEnquiries,
      enquiriesByProduct,
      totalHomepageEnquiries,
      newHomepageEnquiries,
      recentHomepageEnquiries,
      totalUnreadEnquiries,
      unreadHomepageEnquiries,
      unreadLoanEnquiries,
      newEnquiriesToday
    ] = await Promise.all([
      Enquiry.countDocuments({ isDeleted: false }),
      Enquiry.countDocuments({ isDeleted: false, status: 'New' }),
      Enquiry.countDocuments({ isDeleted: false, status: 'Contacted' }),
      Enquiry.countDocuments({ isDeleted: false, status: 'In Progress' }),
      Enquiry.countDocuments({ isDeleted: false, status: 'Converted' }),
      Enquiry.countDocuments({ isDeleted: false, status: 'Closed' }),
      Enquiry.find({ isDeleted: false }).sort({ createdAt: -1 }).limit(8),
      Enquiry.aggregate([
        { $match: { isDeleted: false } },
        { $group: { _id: '$loanType', count: { $sum: 1 } } }
      ]),
      Enquiry.countDocuments({ isDeleted: false, source: { $in: ['homepage', 'Homepage'] } }),
      Enquiry.countDocuments({ isDeleted: false, source: { $in: ['homepage', 'Homepage'] }, status: 'New' }),
      Enquiry.find({ isDeleted: false, source: { $in: ['homepage', 'Homepage'] } }).sort({ createdAt: -1 }).limit(5),
      Enquiry.countDocuments({ isDeleted: false, isRead: false }),
      Enquiry.countDocuments({ isDeleted: false, isRead: false, source: { $in: ['homepage', 'Homepage'] } }),
      Enquiry.countDocuments({ isDeleted: false, isRead: false, source: { $nin: ['homepage', 'Homepage'] } }),
      Enquiry.countDocuments({ isDeleted: false, createdAt: { $gte: todayStart } })
    ]);

    const Loan = require('../models/Loan');

    const totalLoans = await Loan.countDocuments();

    res.json({
      success: true,
      data: {
        totalEnquiries,
        newEnquiries,
        contactedEnquiries,
        inProgressEnquiries,
        convertedEnquiries,
        closedEnquiries,
        totalLoans,
        recentEnquiries,
        enquiriesByProduct,
        totalHomepageEnquiries,
        newHomepageEnquiries,
        recentHomepageEnquiries,
        totalUnreadEnquiries,
        unreadHomepageEnquiries,
        unreadLoanEnquiries,
        newEnquiriesToday
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
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
};
