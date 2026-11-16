const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const Admin = require('../models/Admin');
const Loan = require('../models/Loan');
const { Enquiry } = require('../models/Enquiry');
const { Blog, BlogCategory } = require('../models/Blog');
const { FAQ, LendingPartner, News, Page, Setting } = require('../models/WebsiteContent');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/loan_consultancy');
    console.log('[Seed] Connected to database');

    // 1. Seed Admin
    await Admin.deleteMany({});
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Admin@12345', salt);
    await Admin.create({
      name: 'System Administrator',
      email: 'admin@finadviseloans.com',
      password: hashedPassword,
      role: 'superadmin',
      isActive: true
    });
    console.log('[Seed] Admin user seeded (admin@finadviseloans.com / Admin@12345)');

    // 2. Seed 7 Loans
    await Loan.deleteMany({});
    const loans = [
      {
        slug: 'personal-loan',
        name: 'Personal Loan',
        tagline: 'Instant liquidity for personal emergencies, medical expenses, or weddings',
        icon: 'UserCheck',
        orderIndex: 1,
        shortDescription: 'Collateral-free personal loans tailored for salaried and self-employed professionals with rapid approval and competitive terms.',
        fullDescription: 'Our Personal Loan facilitation helps you access quick capital without pledging any collateral. Whether it is a medical emergency, home renovation, wedding celebration, or higher education expenses, our verified lending partners ensure transparent documentation and customized repayment tenures matching your financial capacity.',
        indicativeInterestRate: '10.49% - 18.00% p.a.',
        maxTenure: 'Up to 5 Years',
        maxLoanAmount: 'Up to ₹40 Lakhs',
        keyBenefits: [
          { title: 'Zero Collateral Required', description: 'Completely unsecured facility without pledging any personal assets.' },
          { title: 'Fast Disbursement', description: 'Direct credit into your bank account within 24 to 48 hours of verification.' },
          { title: 'Flexible Tenures', description: 'Repayment horizons ranging from 12 to 60 months with manageable EMIs.' },
          { title: 'Minimal Documentation', description: 'Basic KYC, income proof, and bank statements for rapid clearance.' }
        ],
        eligibilityCriteria: [
          { criteria: 'Age Limit', detail: '21 to 58 years for salaried, up to 65 for self-employed' },
          { criteria: 'Monthly Income', detail: 'Minimum ₹25,000 net monthly take-home salary' },
          { criteria: 'Work Experience', detail: 'Minimum 1 year total work experience with at least 6 months in current firm' },
          { criteria: 'Credit Score', detail: 'Preferably 700+ for optimal terms and lower interest rates' }
        ],
        requiredDocuments: [
          { category: 'Identity & Address Proof', items: ['Aadhaar Card', 'Passport / Voter ID / Driving License', 'Utility Bill'] },
          { category: 'Income Proof', items: ['Latest 3 months salary slips', 'Latest 6 months bank statement showing salary credits', 'Form 16 / ITR of last 2 years'] }
        ],
        featuresAndAdvantages: [
          { title: 'No End-Use Restrictions', description: 'Use funds freely for any legal personal or household necessity.' },
          { title: 'Part-Prepayment Options', description: 'Pay off lump sums periodically to reduce overall interest liability.' }
        ],
        applicationProcess: [
          { stepNumber: 1, stepTitle: 'Enquiry Submission', stepDescription: 'Fill our simple online enquiry form specifying your employment & income.' },
          { stepNumber: 2, stepTitle: 'Consultant Review', stepDescription: 'Our loan specialist analyzes eligibility across multiple partner banks.' },
          { stepNumber: 3, stepTitle: 'Documentation & Approval', stepDescription: 'Assist in hassle-free verification with selected lender.' },
          { stepNumber: 4, stepTitle: 'Disbursement', stepDescription: 'Funds credited directly to your savings bank account.' }
        ],
        faqs: [
          { question: 'What is the processing fee on personal loans?', answer: 'Processing fees typically range from 1% to 2.5% of the sanctioned loan amount, depending on the lending bank.' },
          { question: 'Can I apply if I am self-employed?', answer: 'Yes, self-employed individuals with 2+ years of continuous business operations and audited ITRs are eligible.' }
        ],
        isPublished: true
      },
      {
        slug: 'loan-against-securities',
        name: 'Loan Against Securities',
        tagline: 'Unlock liquidity against mutual funds and shares without liquidating portfolio',
        icon: 'TrendingUp',
        orderIndex: 2,
        shortDescription: 'Leverage your equity shares, mutual funds, and sovereign gold bonds into an active credit overdraft line without losing investment gains.',
        fullDescription: 'Loan Against Securities (LAS) lets you capitalize on your wealth without disrupting long-term compounding. Pledge approved mutual fund units or listed equity securities to get an immediate overdraft credit facility where you only pay interest on the amount actually utilized.',
        indicativeInterestRate: '9.00% - 12.50% p.a.',
        maxTenure: 'Renewable 12 Months',
        maxLoanAmount: 'Up to ₹5 Crores',
        keyBenefits: [
          { title: 'Retain Portfolio Growth', description: 'Dividends, bonuses, and capital appreciation remain 100% yours.' },
          { title: 'Interest on Utilization Only', description: 'Pay interest strictly on the drawn amount, not the sanctioned limit.' },
          { title: 'No Premature Exit Penalties', description: 'Avoid selling assets at distress or during market downturns.' },
          { title: 'Instant Digital Pledging', description: 'Seamless pledge creation through depository participants (NSDL/CDSL).' }
        ],
        eligibilityCriteria: [
          { criteria: 'Eligible Securities', detail: 'Approved listed shares, equity/debt mutual funds, sovereign gold bonds' },
          { criteria: 'Minimum Holding Value', detail: 'Portfolio holding value of at least ₹1,00,000' },
          { criteria: 'Applicant Type', detail: 'Resident Individuals, HUFs, Sole Proprietorships, and Corporate Entities' }
        ],
        requiredDocuments: [
          { category: 'Demats & Holdings', items: ['Latest Holding Statement / Consolidated Account Statement (CAS)', 'DP ID & Client Master List (CML)'] },
          { category: 'Identity & KYC', items: ['PAN Card', 'Proof of Address', 'Cancelled Cheque'] }
        ],
        featuresAndAdvantages: [
          { title: 'Loan-to-Value (LTV)', description: 'Up to 50% for equity shares and up to 85% for debt mutual funds.' },
          { title: 'Digital Depository Lien', description: 'Securities remain securely in your demat account under bank lien.' }
        ],
        applicationProcess: [
          { stepNumber: 1, stepTitle: 'Submit Portfolio Details', stepDescription: 'Provide CAS or security details through our secure consultation form.' },
          { stepNumber: 2, stepTitle: 'Limit Calculation', stepDescription: 'Our advisors match with lenders offering maximum LTV and lowest spreads.' },
          { stepNumber: 3, stepTitle: 'Digital Lien Marking', stepDescription: 'Lien is created via OTP directly through CDSL or NSDL.' },
          { stepNumber: 4, stepTitle: 'Limit Activation', stepDescription: 'Overdraft line is activated in your linked current/savings account.' }
        ],
        faqs: [
          { question: 'Do I still receive dividends while securities are pledged?', answer: 'Yes, all corporate actions like dividends and bonuses flow directly to your registered bank account.' }
        ],
        isPublished: true
      },
      {
        slug: 'business-loan',
        name: 'Business Loan',
        tagline: 'Catalyze enterprise growth, working capital, and operational expansion',
        icon: 'Briefcase',
        orderIndex: 3,
        shortDescription: 'Unsecured and secured business financing solutions designed to fuel working capital, inventory purchases, and business expansion.',
        fullDescription: 'Fuel your business aspirations with tailored Business Loans. Whether you are managing seasonal working capital peaks, purchasing raw materials, hiring talent, or scaling physical operations, we connect MSMEs and enterprises with competitive institutional lenders across India.',
        indicativeInterestRate: '12.00% - 19.50% p.a.',
        maxTenure: 'Up to 7 Years',
        maxLoanAmount: 'Up to ₹2 Crores',
        keyBenefits: [
          { title: 'Customized Repayment Terms', description: 'Monthly or structured installments synchronized with your enterprise cash flow.' },
          { title: 'Unsecured Options Available', description: 'Collateral-free capital for established enterprises with strong banking records.' },
          { title: 'High Ticket Sizes', description: 'Access up to ₹2 Crores based on verified turnover and balance sheet health.' },
          { title: 'Tax Benefits', description: 'Interest paid on business loans is fully tax-deductible as business expenditure.' }
        ],
        eligibilityCriteria: [
          { criteria: 'Business Vintage', detail: 'Minimum 2 years of active business operations' },
          { criteria: 'Annual Turnover', detail: 'Minimum ₹40 Lakhs reported annual turnover' },
          { criteria: 'Profitability', detail: 'Profit-making operations for the preceding 2 financial years' }
        ],
        requiredDocuments: [
          { category: 'Financials', items: ['Last 2 years audited Balance Sheet & P&L', 'Income Tax Returns with computations for 2 years', 'Latest 12 months Bank Account Statements'] },
          { category: 'Business Proof', items: ['GST Registration Certificate', 'Udyam / MSME Registration', 'Partnership Deed / MOA & AOA'] }
        ],
        featuresAndAdvantages: [
          { title: 'Flexible Credit Facilities', description: 'Term loans, overdraft facilities, or letters of credit tailored to requirements.' }
        ],
        applicationProcess: [
          { stepNumber: 1, stepTitle: 'Business Assessment', stepDescription: 'Submit business turnover, vintage, and funding requirements.' },
          { stepNumber: 2, stepTitle: 'Financial Evaluation', stepDescription: 'Our corporate desk evaluates cash flow, debt service capacity, and banking velocity.' },
          { stepNumber: 3, stepTitle: 'Sanction & Documentation', stepDescription: 'Coordinate with partner institutional credit teams for prompt sanction.' },
          { stepNumber: 4, stepTitle: 'Capital Inflow', stepDescription: 'Disbursement directly to your corporate operating account.' }
        ],
        faqs: [
          { question: 'Can newly registered startups apply?', answer: 'Unsecured business loans generally require at least 2 years operational history. For newer startups, loan against property or secured credit may be suitable.' }
        ],
        isPublished: true
      },
      {
        slug: 'home-loan',
        name: 'Home Loan',
        tagline: 'Realize your dream home with low interest rates and extended repayment tenures',
        icon: 'Home',
        orderIndex: 4,
        shortDescription: 'Comprehensive home financing for ready-to-move properties, under-construction projects, home construction, and balance transfers.',
        fullDescription: 'Buying a home is one of life’s most significant milestones. Our Home Loan consultation brings you the most competitive home finance schemes from leading banks and housing finance corporations. Enjoy transparent terms, long tenures up to 30 years, and expert guidance at every step.',
        indicativeInterestRate: '8.40% - 9.85% p.a.',
        maxTenure: 'Up to 30 Years',
        maxLoanAmount: 'Up to ₹10 Crores',
        keyBenefits: [
          { title: 'Lowest Interest Rates', description: 'Benefit from benchmark repo-linked interest rates in the market.' },
          { title: 'Extended Repayments', description: 'Keep your monthly EMI affordable with tenures stretching up to 30 years.' },
          { title: 'Tax Deductions', description: 'Claim tax deductions under Section 80C (Principal) and Section 24(b) (Interest).' },
          { title: 'Balance Transfer Facilities', description: 'Refinance existing high-interest home loans with lower rates and top-up capital.' }
        ],
        eligibilityCriteria: [
          { criteria: 'Age', detail: '21 to 65 years' },
          { criteria: 'Employment', detail: 'Salaried employees or established self-employed professionals/business owners' },
          { criteria: 'CIBIL Score', detail: '750+ offers access to the lowest interest rate tiers' }
        ],
        requiredDocuments: [
          { category: 'Property Papers', items: ['Allotment Letter / Agreement of Sale', 'Approved building plan & layout', 'NOC from builder/society', 'Chain of title deeds'] },
          { category: 'Financial Documents', items: ['Salary slips (3 months) / ITRs (3 years)', 'Bank statements (6 months)'] }
        ],
        featuresAndAdvantages: [
          { title: 'Doorstep Advisory', description: 'Our legal and technical advisors assist in legal property verification.' }
        ],
        applicationProcess: [
          { stepNumber: 1, stepTitle: 'Loan Enquiry', stepDescription: 'Provide basic property valuation and applicant income details.' },
          { stepNumber: 2, stepTitle: 'Sanction in Principle', stepDescription: 'Receive pre-approved eligibility letter to choose properties with confidence.' },
          { stepNumber: 3, stepTitle: 'Legal & Technical Check', stepDescription: 'Lender completes property title search and technical valuation.' },
          { stepNumber: 4, stepTitle: 'Loan Sanction & Registry', stepDescription: 'Final sanction issued and funds released on sale deed registration.' }
        ],
        faqs: [
          { question: 'What is the maximum financing percentage for home loans?', answer: 'RBI guidelines permit financing up to 90% for loans up to ₹30 Lakhs, 80% for loans between ₹30 Lakhs to ₹75 Lakhs, and 75% for loans above ₹75 Lakhs.' }
        ],
        isPublished: true
      },
      {
        slug: 'loan-against-property',
        name: 'Loan Against Property',
        tagline: 'High-value liquidity by unlocking equity trapped in residential or commercial real estate',
        icon: 'Building2',
        orderIndex: 5,
        shortDescription: 'Monetize existing residential, commercial, or industrial real estate assets for major business capital, debt consolidation, or asset acquisition.',
        fullDescription: 'Loan Against Property (LAP) is a mortgage loan facility that allows you to borrow substantial funds at significantly lower interest rates than unsecured loans by mortgaging your freehold residential or commercial properties. The ownership remains entirely with you while you leverage the property’s current market value.',
        indicativeInterestRate: '9.25% - 11.75% p.a.',
        maxTenure: 'Up to 15 Years',
        maxLoanAmount: 'Up to ₹15 Crores',
        keyBenefits: [
          { title: 'High Loan Quantum', description: 'Unlock up to 60-70% of the current market valuation of your property.' },
          { title: 'Lower Interest Slabs', description: 'Much cheaper than personal or unsecured commercial credit lines.' },
          { title: 'Longer Tenures', description: 'Spread repayments up to 15 years to safeguard business operational liquidity.' },
          { title: 'Retain Property Utility', description: 'Continue living in or renting out the property throughout the loan tenure.' }
        ],
        eligibilityCriteria: [
          { criteria: 'Property Title', detail: 'Clear, marketable freehold title without existing encumbrances' },
          { criteria: 'Eligible Properties', detail: 'Self-occupied residential, rented residential, commercial offices, or retail spaces' },
          { criteria: 'Applicant Type', detail: 'Salaried, Self-employed, Partnership firms, Private Limited companies' }
        ],
        requiredDocuments: [
          { category: 'Property Ownership Documents', items: ['Title deed, conveyance deed, or sale deed', 'Approved building plan and OC', 'Property tax receipts', 'Prior encumbrance certificates'] },
          { category: 'Income Credentials', items: ['Last 3 years audited financials & ITR', 'Banking statements of last 12 months'] }
        ],
        featuresAndAdvantages: [
          { title: 'Multi-Purpose Financing', description: 'Zero restrictions on how you deploy funds for business or personal uses.' }
        ],
        applicationProcess: [
          { stepNumber: 1, stepTitle: 'Submit Property Particulars', stepDescription: 'Enter property location, estimated market value, and requirement.' },
          { stepNumber: 2, stepTitle: 'Valuation & Title Audit', stepDescription: 'Lender valuation engineers survey the property for fair market appraisal.' },
          { stepNumber: 3, stepTitle: 'Credit Underwriting', stepDescription: 'Income assessment aligned with optimal loan-to-value ratio.' },
          { stepNumber: 4, stepTitle: 'Mortgage & Disbursement', stepDescription: 'Equitable or registered mortgage execution followed by funds release.' }
        ],
        faqs: [
          { question: 'Can commercial properties be mortgaged?', answer: 'Yes, commercial properties such as shops, office units, and warehouses with clear title deeds are acceptable.' }
        ],
        isPublished: true
      },
      {
        slug: 'education-loan',
        name: 'Education Loan',
        tagline: 'Finance higher education in premier Indian universities and top global destinations',
        icon: 'GraduationCap',
        orderIndex: 6,
        shortDescription: 'Dedicated financial support for domestic and international higher education covering tuition fees, living expenses, and travel.',
        fullDescription: 'Do not let financial constraints hold back career ambitions. Our Education Loan advisory guides students and parents through secured and unsecured student loan options from premier banks and specialized NBFCs. We cover up to 100% of overseas education costs with flexible repayment moratoria.',
        indicativeInterestRate: '9.50% - 13.50% p.a.',
        maxTenure: 'Up to 15 Years (plus Moratorium)',
        maxLoanAmount: 'Up to ₹1.5 Crores',
        keyBenefits: [
          { title: 'Comprehensive Cost Coverage', description: 'Covers course tuition, airfare, hostel accommodation, laptop, and insurance.' },
          { title: 'Repayment Moratorium', description: 'Course duration plus 6 to 12 months grace period before EMI starts.' },
          { title: 'Tax Exemption under Sec 80E', description: 'Entire interest paid is eligible for deduction without any upper limit.' },
          { title: 'Collateral-Free Options', description: 'Unsecured education loans up to ₹50 Lakhs for top global and Indian universities.' }
        ],
        eligibilityCriteria: [
          { criteria: 'Academic Record', detail: 'Secured admission in recognized college/university in India or abroad' },
          { criteria: 'Co-applicant', detail: 'Parents, legal guardian, or earning spouse with stable income' },
          { criteria: 'Qualifying Exams', detail: 'Scores in GRE, GMAT, IELTS, TOEFL, CAT, GATE, etc.' }
        ],
        requiredDocuments: [
          { category: 'Academic Records', items: ['Admission confirmation letter / I-20 form', 'Mark sheets of 10th, 12th, Graduation', 'Entrance exam scorecards'] },
          { category: 'Co-Applicant Documents', items: ['KYC proofs', 'Salary slips / 2 years ITR', '6 months bank statement'] }
        ],
        featuresAndAdvantages: [
          { title: 'Pre-Visa Disbursal', description: 'Assistance in meeting strict financial evidence requirements for student visas.' }
        ],
        applicationProcess: [
          { stepNumber: 1, stepTitle: 'Course & College Submission', stepDescription: 'Provide targeted university, program details, and estimated expenses.' },
          { stepNumber: 2, stepTitle: 'Lender Selection', stepDescription: 'Identify banks offering prime interest concessions for your specific university.' },
          { stepNumber: 3, stepTitle: 'Sanction Letter Issuance', stepDescription: 'Receive formal sanction letter required for university I-20 or visa interview.' },
          { stepNumber: 4, stepTitle: 'Tuition Transfer', stepDescription: 'Direct forex transfer to foreign university or domestic institute.' }
        ],
        faqs: [
          { question: 'When do I have to start repaying the education loan?', answer: 'Repayment typically starts 6 to 12 months after course completion, or 6 months after securing employment, whichever is earlier.' }
        ],
        isPublished: true
      },
      {
        slug: 'gold-loan',
        name: 'Gold Loan',
        tagline: 'Instant, hassle-free cash within minutes against physical gold ornaments',
        icon: 'Coins',
        orderIndex: 7,
        shortDescription: 'Quick, high-value cash facility against gold jewellery with minimal paperwork, zero credit score checks, and safe locker storage.',
        fullDescription: 'Gold Loan is one of the fastest ways to access immediate liquidity. Pledge your idle gold jewellery or coins to meet urgent personal or business cash requirements. With maximum LTV as per RBI guidelines and industry-standard security lockers with insurance, your gold remains completely safe.',
        indicativeInterestRate: '8.90% - 14.00% p.a.',
        maxTenure: 'Up to 24 Months',
        maxLoanAmount: 'Up to ₹50 Lakhs',
        keyBenefits: [
          { title: 'Fastest Loan Sanction', description: 'Loan appraisal and disbursement completed within 30 to 60 minutes.' },
          { title: 'Zero CIBIL Requirement', description: 'Credit score is not a deciding factor since physical gold serves as collateral.' },
          { title: 'High Safety & Insurance', description: 'Gold is stored in bank-grade secure vaults with comprehensive insurance.' },
          { title: 'Flexible Repayment Schemes', description: 'Bullet repayment, interest-only monthly EMI, or regular term schedules.' }
        ],
        eligibilityCriteria: [
          { criteria: 'Age', detail: '18 to 70 years' },
          { criteria: 'Collateral Type', detail: 'Gold ornaments / hallmarked coins of 18K to 24K purity' },
          { criteria: 'Gold Ownership', detail: 'Applicant must be the rightful owner of the pledged gold' }
        ],
        requiredDocuments: [
          { category: 'Basic KYC', items: ['Aadhaar Card / Voter ID / Passport', 'PAN Card or Form 60', 'Passport-size photographs'] }
        ],
        featuresAndAdvantages: [
          { title: 'No Income Proof Required', description: 'Ideal for homemakers, farmers, students, and informal entrepreneurs.' }
        ],
        applicationProcess: [
          { stepNumber: 1, stepTitle: 'Submit Enquiry', stepDescription: 'Indicate approximate gold weight in grams and funding requirement.' },
          { stepNumber: 2, stepTitle: 'Doorstep / Branch Assay', stepDescription: 'Certified valuer tests gold purity non-destructively in your presence.' },
          { stepNumber: 3, stepTitle: 'Immediate Cash / NEFT', stepDescription: 'Funds transferred instantly to your bank account.' },
          { stepNumber: 4, stepTitle: 'Safe Custody', stepDescription: 'Jewellery sealed and deposited in high-security bank vault.' }
        ],
        faqs: [
          { question: 'What happens to my gold ornaments while deposited?', answer: 'Your gold is weighed, sealed in tamper-proof bags in your presence, and placed in multi-tier bank vaults with 100% insurance coverage.' }
        ],
        isPublished: true
      }
    ];

    await Loan.insertMany(loans);
    console.log('[Seed] 7 Loan Categories seeded successfully');

    // 3. Seed Sample Enquiries across all 7 Categories
    await Enquiry.deleteMany({});
    const sampleEnquiries = [
      {
        loanType: 'personal-loan',
        fullName: 'Vikram Sharma',
        mobileNumber: '9820112345',
        email: 'vikram.sharma@example.com',
        city: 'Mumbai',
        requiredLoanAmount: 500000,
        privacyConsent: true,
        loanDetails: {
          employmentType: 'Salaried',
          monthlyIncome: 65000
        },
        status: 'New',
        adminNotes: [{ note: 'Interested in urgent loan for home renovation.', addedBy: 'System' }]
      },
      {
        loanType: 'loan-against-securities',
        fullName: 'Rajesh Mehta',
        mobileNumber: '9840223456',
        email: 'rajesh.mehta@example.com',
        city: 'Ahmedabad',
        requiredLoanAmount: 1500000,
        privacyConsent: true,
        loanDetails: {
          securityType: 'Mutual Funds',
          approximateInvestmentValue: 3000000
        },
        status: 'Contacted',
        adminNotes: [{ note: 'Holding CAS statement from CAMS/KFintech.', addedBy: 'Admin' }]
      },
      {
        loanType: 'business-loan',
        fullName: 'Sunita Reddy',
        mobileNumber: '9876543211',
        email: 'sunita.reddy@example.com',
        city: 'Hyderabad',
        requiredLoanAmount: 3500000,
        privacyConsent: true,
        loanDetails: {
          businessType: 'Pvt Ltd Company',
          businessVintage: '3-5 years',
          annualTurnover: 12000000
        },
        status: 'In Progress',
        adminNotes: [{ note: 'Audit reports collected, checking with HDFC & ICICI.', addedBy: 'Senior Consultant' }]
      },
      {
        loanType: 'home-loan',
        fullName: 'Arjun Deshmukh',
        mobileNumber: '9811234567',
        email: 'arjun.deshmukh@example.com',
        city: 'Pune',
        requiredLoanAmount: 4500000,
        privacyConsent: true,
        loanDetails: {
          propertyValue: 6000000,
          propertyLocation: 'Baner, Pune',
          employmentType: 'Salaried'
        },
        status: 'New',
        adminNotes: [{ note: 'Under-construction flat booking.', addedBy: 'System' }]
      },
      {
        loanType: 'loan-against-property',
        fullName: 'Manoj Kumar Gupta',
        mobileNumber: '9711889900',
        email: 'manoj.gupta@example.com',
        city: 'Delhi',
        requiredLoanAmount: 8000000,
        privacyConsent: true,
        loanDetails: {
          propertyType: 'Commercial',
          propertyLocation: 'Connaught Place, New Delhi',
          propertyValue: 18000000
        },
        status: 'Converted',
        adminNotes: [{ note: 'Sanction letter issued from Axis Bank at 9.40%.', addedBy: 'Manager' }]
      },
      {
        loanType: 'education-loan',
        fullName: 'Ananya Iyer',
        mobileNumber: '9988776655',
        email: 'ananya.iyer@example.com',
        city: 'Bengaluru',
        requiredLoanAmount: 2500000,
        privacyConsent: true,
        loanDetails: {
          courseName: 'MS in Computer Science',
          institutionName: 'Technical University of Munich (TUM)',
          studyLocation: 'International / Overseas',
          educationExpenses: 3000000
        },
        status: 'Contacted',
        adminNotes: [{ note: 'I-20 equivalent received, requires forex sanction.', addedBy: 'Admin' }]
      },
      {
        loanType: 'gold-loan',
        fullName: 'Pooja Agarwal',
        mobileNumber: '9871122334',
        email: 'pooja.agarwal@example.com',
        city: 'Jaipur',
        requiredLoanAmount: 300000,
        privacyConsent: true,
        loanDetails: {
          approximateGoldWeight: 75,
          goldPurity: '22K'
        },
        status: 'New',
        adminNotes: [{ note: 'Wants doorstep valuation assistance.', addedBy: 'System' }]
      }
    ];

    for (const item of sampleEnquiries) {
      await Enquiry.create(item);
    }
    console.log('[Seed] Sample enquiries created for each of the 7 products');

    // 4. Seed Lending Partners
    await LendingPartner.deleteMany({});
    const partners = [
      { name: 'State Bank of India (SBI)', category: 'Public Sector Bank', description: 'India’s largest public lender offering competitive interest rates.', orderIndex: 1 },
      { name: 'HDFC Bank', category: 'Private Bank', description: 'Premier private sector bank with seamless digital processing.', orderIndex: 2 },
      { name: 'ICICI Bank', category: 'Private Bank', description: 'Leading technology-first banking partner with wide retail branch network.', orderIndex: 3 },
      { name: 'Axis Bank', category: 'Private Bank', description: 'Flexible consumer & enterprise financing solutions.', orderIndex: 4 },
      { name: 'Kotak Mahindra Bank', category: 'Private Bank', description: 'Innovative financing solutions and fast turn-around times.', orderIndex: 5 },
      { name: 'Bajaj Finance Ltd', category: 'NBFC', description: 'Leading diversified NBFC providing rapid loan approvals.', orderIndex: 6 },
      { name: 'Tata Capital Financial Services', category: 'NBFC', description: 'Trusted brand offering customized loan facilities.', orderIndex: 7 },
      { name: 'Piramal Capital & Housing Finance', category: 'Housing Finance Company', description: 'Affordable and flexible home mortgage partner.', orderIndex: 8 }
    ];
    await LendingPartner.insertMany(partners);
    console.log('[Seed] Lending partners seeded');

    // 5. Seed Blogs & Categories
    await Blog.deleteMany({});
    await BlogCategory.deleteMany({});

    const categories = [
      { name: 'Loan Guidance', slug: 'loan-guidance', description: 'Step-by-step guidance on securing different types of loans' },
      { name: 'Credit Score & CIBIL', slug: 'credit-score-cibil', description: 'Mastering credit profiles and repairing low scores' },
      { name: 'Interest Rates & EMIs', slug: 'interest-rates-emis', description: 'Market updates on repo rate changes and EMI planning' },
      { name: 'Financial Planning', slug: 'financial-planning', description: 'Prudent borrowing strategies and debt management' }
    ];
    await BlogCategory.insertMany(categories);

    const blogs = [
      {
        title: 'Mastering Your CIBIL Score: 7 Proven Ways to Cross 750+',
        slug: 'mastering-your-cibil-score-750-plus',
        category: 'Credit Score & CIBIL',
        author: 'Senior Credit Analyst',
        summary: 'A high credit score is your passport to competitive loan interest rates. Learn the concrete actions you can take today to elevate your score past 750.',
        content: `A CIBIL credit score is a 3-digit numerical summary of your credit history, ranging between 300 and 900. Lenders view a score above 750 as the benchmark for creditworthiness.\n\n### 1. Maintain Pristine Repayment Discipline\nPayment history accounts for approximately 35% of your credit score calculation. Even a single delayed EMI or credit card payment can shave 20 to 50 points off your score. Set up auto-debits for your credit card bills and loan EMIs to avoid accidental oversights.\n\n### 2. Keep Your Credit Utilization Ratio (CUR) Under 30%\nIf you have a total credit limit of ₹2,00,000 across your cards, strive never to utilize more than ₹60,000 at any billing cycle. A high credit utilization signals credit hunger and downward financial pressure to credit reporting agencies.\n\n### 3. Maintain a Healthy Credit Mix\nHaving a balanced proportion of secured credit (such as Home Loans or Auto Loans) and unsecured credit (like Personal Loans or Credit Cards) signals responsible multi-instrument management.\n\n### 4. Avoid Submitting Multiple Direct Loan Applications\nEvery time you apply directly with multiple banks simultaneously, each bank performs a hard inquiry on your credit bureau record. Multiple hard inquiries in a brief window negatively impact your score. Working with an independent loan consultancy helps you find pre-vetted options without racking up indiscriminate hard inquiries.`,
        readTime: '6 min read',
        seoTitle: 'How to Improve CIBIL Score Above 750 | Expert Guide',
        seoDescription: 'Discover actionable strategies to boost your credit score above 750 for lower interest rates and faster loan approvals.',
        isPublished: true
      },
      {
        title: 'Loan Against Securities vs Personal Loan: Which One is Right for You?',
        slug: 'loan-against-securities-vs-personal-loan-comparison',
        category: 'Loan Guidance',
        author: 'Financial Advisory Desk',
        summary: 'Should you pledge your investments or opt for an unsecured personal loan? We break down the cost, interest impact, and liquidity trade-offs.',
        content: `When urgent capital needs arise, borrowers often face the dilemma: should they apply for an unsecured personal loan or pledge their equity portfolio / mutual funds via a Loan Against Securities (LAS)?\n\n### Cost of Borrowing\nPersonal loans are completely unsecured and carry interest rates typically between 10.5% and 18%. In contrast, Loan Against Securities is backed by high-quality collateral, allowing lending partners to offer interest rates between 9% and 12%.\n\n### Interest Calculation: Lump Sum vs Overdraft\nIn a personal loan, interest is charged on the entire disbursed loan principal from day one. In Loan Against Securities, banks offer an overdraft limit where interest is levied strictly on the exact amount you withdraw for the exact days you use it.\n\n### Conclusion\nIf you have an existing portfolio of mutual funds or blue-chip shares and want to avoid selling during volatile markets, LAS is virtually always the more economical choice. If you do not have sizable investments, an unsecured personal loan remains the quickest accessible liquidity source.`,
        readTime: '5 min read',
        seoTitle: 'Loan Against Securities vs Personal Loan Comparison',
        seoDescription: 'Detailed comparison of interest rates, benefits, and flexibility between personal loans and loan against securities.',
        isPublished: true
      },
      {
        title: 'Complete Checklist: Documents Required for Home Loan Approval in India',
        slug: 'home-loan-documents-checklist-india',
        category: 'Loan Guidance',
        author: 'Mortgage Solutions Team',
        summary: 'Avoid delays in home purchase transactions by organizing your KYC, income records, and property title papers ahead of time.',
        content: `Securing a home loan is a multi-step process involving credit underwriting, legal title search, and technical valuation of the property.\n\n### 1. Identity & KYC Documents\n- PAN Card (mandatory for financial validation)\n- Proof of Residence: Aadhaar Card, Passport, or Electricity Bill\n- Passport-sized photographs\n\n### 2. Financial Documents for Salaried Applicants\n- Salary slips for the last 3 months\n- Form 16 / Income Tax Returns for the last 2 assessment years\n- Bank statement showing salary credits for 6 months\n\n### 3. Financial Documents for Self-Employed Applicants\n- Audited Balance Sheet and Profit & Loss accounts for 3 years\n- ITR with computational breakdown for 3 years\n- Bank account statements of operating accounts for 12 months\n- Business registration documents (GST, MSME, Partnership Deed/MOA)\n\n### 4. Property Documents Required\n- Copy of Allotment Letter / Agreement to Sell\n- Approved floor plan and sanction blueprint\n- Encumbrance Certificate (EC) for the past 13 to 30 years\n- NOC from the housing society or developer`,
        readTime: '7 min read',
        seoTitle: 'Home Loan Documents Checklist India | FinAdvise',
        seoDescription: 'Check all necessary documents for salaried and self-employed home loan applicants in India.',
        isPublished: true
      }
    ];
    await Blog.insertMany(blogs);
    console.log('[Seed] Blogs and categories seeded');

    // 6. Seed FAQs
    await FAQ.deleteMany({});
    const faqs = [
      { question: 'What does a Loan Consultancy firm do?', answer: 'A loan consultancy acts as an expert facilitator between loan applicants and RBI-registered banks/NBFCs. We evaluate your financial profile, compare terms across 20+ lenders, assist in documentation, and ensure you get the lowest interest rate and fastest sanction without upfront advisory fees for standard loans.', category: 'General', orderIndex: 1 },
      { question: 'Does applying through a loan consultant affect my CIBIL score?', answer: 'No. When you submit your enquiry to us, we conduct preliminary advisory matching without triggering hard inquiries. Only when you explicitly agree to apply to a specific lender does that bank perform a formal check.', category: 'General', orderIndex: 2 },
      { question: 'Can I apply for multiple loan categories at the same time?', answer: 'Yes, our platform accommodates diverse financing needs including personal emergencies, home purchases, and enterprise expansion. You can submit dedicated enquiries for the respective categories.', category: 'General', orderIndex: 3 },
      { question: 'How long does loan disbursement take?', answer: 'Turnaround times vary: Gold Loans can be sanctioned in 30 minutes, Personal Loans take 24 to 48 hours, Business Loans take 2 to 5 days, while Home Loans & Loans Against Property typically require 7 to 14 days due to legal title validation.', category: 'General', orderIndex: 4 },
      { question: 'Are there any hidden costs in the loan application process?', answer: 'We believe in 100% transparent borrowing. Lenders charge standard processing fees, stamp duty, and statutory taxes which are clearly itemized in the bank sanction letter before you sign any agreement.', category: 'General', orderIndex: 5 }
    ];
    await FAQ.insertMany(faqs);
    console.log('[Seed] FAQs seeded');

    // 7. Seed News
    await News.deleteMany({});
    const news = [
      {
        title: 'RBI Keeps Repo Rate Steady: What It Means for Your Loan EMIs',
        slug: 'rbi-keeps-repo-rate-steady-emi-impact',
        source: 'Reserve Bank of India Insights',
        summary: 'The Monetary Policy Committee keeps key lending rates unchanged, offering stability to floating-rate home loan and LAP borrowers.',
        content: 'The Reserve Bank of India’s Monetary Policy Committee has decided to maintain the policy repo rate unchanged, providing predictable EMI cycles for existing home loan and mortgage borrowers. Financial analysts recommend borrowers focus on debt prepayment strategies to shorten long-term tenures during stable rate regimes.',
        publishedDate: new Date()
      },
      {
        title: 'Digital Loan Disbursals Surpass Traditional Retail Channels in Q2',
        slug: 'digital-loan-disbursals-growth',
        source: 'FinTech India Journal',
        summary: 'Digital KYC and account aggregator integrations lead to 35% faster turnaround in personal and SME credit underwriting.',
        content: 'Driven by account aggregator frameworks and automated bank statement analysis, leading Indian private banks and NBFCs reported record digital credit disbursals in Q2. Borrowers benefit from significantly reduced documentation times and instant in-principle sanction letters.',
        publishedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
      }
    ];
    await News.insertMany(news);
    console.log('[Seed] News articles seeded');

    // 8. Seed Default Settings & Home Page Content
    await Setting.deleteMany({});
    await Setting.create({
      companyName: 'FinAdvise Loan Consultancy',
      tagline: 'Your Trusted Gateway to Smarter Financing Solutions',
      contactEmail: 'contact@finadviseloans.com',
      contactPhone: '+91 98765 43210',
      alternatePhone: '+91 80000 12345',
      officeAddress: 'Tower B, 4th Floor, Financial District, Bandra Kurla Complex, Mumbai, Maharashtra 400051',
      workingHours: 'Mon - Sat: 9:30 AM to 6:30 PM',
      disclaimerText: 'FinAdvise is an independent loan consultancy and loan facilitation service. We partner with RBI registered Banks and NBFCs to bring you transparent loan offers. We do not charge upfront fees for standard loan advisory.',
      socialLinks: {
        facebook: 'https://facebook.com',
        linkedin: 'https://linkedin.com',
        twitter: 'https://twitter.com',
        instagram: 'https://instagram.com'
      }
    });

    await Page.deleteMany({});
    await Page.create({
      pageKey: 'home',
      title: 'Home Page CMS Content',
      sections: {
        hero: {
          badge: 'Trusted by 50,000+ Borrowers Across India',
          title: 'Simplifying Loans with Transparent Expert Advisory',
          subtitle: 'Compare and access the best Personal Loans, Home Loans, Business Financing, and Loans Against Securities from India’s leading Banks & NBFCs with zero hassle.',
          exploreButtonText: 'Explore Loans',
          enquireButtonText: 'Enquire Now'
        },
        whyChooseUs: {
          title: 'Why Borrowers Choose FinAdvise',
          subtitle: 'We combine deep banking relationships with unbiased financial advisory to secure the lowest rates and fastest turnarounds.',
          points: [
            { title: '20+ Leading Lending Partners', desc: 'Direct tie-ups with top public/private banks and trusted NBFCs.' },
            { title: 'Zero Upfront Advisory Charges', desc: 'Transparent guidance with no hidden platform fees for borrowers.' },
            { title: 'Tailored Financial Matching', desc: 'Algorithms match you to lenders most likely to approve your profile.' },
            { title: 'End-to-End Documentation Support', desc: 'Dedicated loan managers manage documentation from application to disbursal.' }
          ]
        },
        process: {
          title: 'Our Simple 4-Step Loan Assistance Process',
          subtitle: 'Experience a smooth, paperless, and time-saving journey from enquiry to fund disbursement.',
          steps: [
            { step: '01', title: 'Submit Loan Enquiry', desc: 'Choose your loan category and fill out our simple, tailored online form.' },
            { step: '02', title: 'Consultant Eligibility Assessment', desc: 'Our senior advisor evaluates your eligibility across 20+ banking partners.' },
            { step: '03', title: 'Document Verification & Sanction', desc: 'We coordinate with the bank for digital verification and prompt sanction.' },
            { step: '04', title: 'Funds Disbursed to Account', desc: 'Receive funds directly into your bank account with complete transparency.' }
          ]
        }
      }
    });

    await Page.create({
      pageKey: 'about',
      title: 'About Us Page CMS Content',
      sections: {
        heroTitle: 'About FinAdvise',
        heroSubtitle: 'Your Trusted Gateway to Smarter Financing.',
        introHeading: 'Empowering Smarter Financial Decisions',
        introText: 'FinAdvise is an independent loan consultancy dedicated to assisting retail borrowers, business owners, and corporate enterprises navigate the diverse landscape of institutional financing across India. We believe that borrowing capital should be a transparent, well-informed, and straightforward experience.'
      }
    });
    console.log('[Seed] Settings & Page Content seeded');

    console.log('\n=========================================');
    console.log(' DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    console.log(' Admin: admin@finadviseloans.com / Admin@12345');
    console.log('=========================================\n');
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]:', error);
    process.exit(1);
  }
};

seedData();
