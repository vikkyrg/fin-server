const Loan = require('../models/Loan');
const mongoose = require('mongoose');

// Default initial 7 products used if MongoDB collection is empty or offline
const DEFAULT_LOAN_PRODUCTS = [
  {
    slug: 'personal-loan',
    name: 'Personal Loan',
    tagline: 'Collateral-free personal financing with rapid sanction and flexible tenures',
    icon: 'UserCheck',
    heroImage: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=1200&q=80',
    orderIndex: 1,
    indicativeInterestRate: '10.49% - 18.00% p.a.',
    maxTenure: '12 to 72 Months',
    maxLoanAmount: 'Up to ₹40 Lakhs',
    processingFee: '1.0% - 2.5% + GST',
    shortDescription: 'Collateral-free instant personal loan for salaried and self-employed professionals with minimal documentation, competitive interest rates, and approval in 24 hours.',
    overview: 'A Personal Loan is an unsecured credit facility designed to help individuals manage immediate liquidity requirements without pledging any collateral or personal assets. Whether addressing unexpected medical emergencies, financing higher education, funding home improvement, or consolidating high-interest credit card debt into a single predictable installment, our multi-bank advisory pairs your credit profile with verified RBI-registered banking partners.',
    keyBenefits: [
      { title: 'Zero Collateral Required', description: 'Completely unsecured loan requiring no asset pledging, hypothecation, or third-party guarantor.' },
      { title: 'Rapid 24-Hour Disbursal', description: 'Direct credit into your registered savings account within 24 to 48 hours of digital verification.' },
      { title: 'Flexible Repayment Horizons', description: 'Choose comfortable EMI repayment tenures ranging from 12 to 72 months aligned with your cash flow.' },
      { title: 'Minimal Digital Paperwork', description: 'Hassle-free e-KYC, paperless bank statement analysis, and automated digital income checks.' },
      { title: 'No End-Use Restrictions', description: 'Deploy sanctioned loan capital freely across any legitimate personal, family, or domestic requirement.' },
      { title: 'Part-Prepayment Facilities', description: 'Lenders offer convenient part-prepayment options after minimum mandatory lock-in periods to reduce interest.' }
    ],
    features: [
      { title: 'Fixed Interest Rates', description: 'Predictable monthly EMIs throughout the loan tenure unaffected by market volatility.' },
      { title: 'Multi-Lender Comparison', description: 'Compare offers across 20+ top public/private banks without multiple hard credit bureau inquiries.' },
      { title: 'Doorstep & Digital Support', description: 'Dedicated personal loan manager assists from loan application submission to final disbursement.' }
    ],
    eligibilityCriteria: [
      { criteria: 'Age Requirement', detail: '21 to 58 years for salaried individuals; 23 to 65 years for self-employed professionals' },
      { criteria: 'Minimum Monthly Income', detail: 'Minimum net monthly in-hand salary of ₹25,000 in metro cities; ₹20,000 in non-metros' },
      { criteria: 'Employment Vintage', detail: 'Minimum 1 year total professional experience with at least 6 continuous months in current firm' },
      { criteria: 'Credit Score Benchmark', detail: 'CIBIL score of 700+ preferred for competitive interest rates and rapid clearance' },
      { criteria: 'Nationality & Residence', detail: 'Resident Indian citizen residing within serviceable city limits of partner banks' }
    ],
    requiredDocuments: [
      { category: 'Identity & Age Proof', items: ['Aadhaar Card (DigiLocker verified)', 'PAN Card (Mandatory for credit bureau validation)', 'Passport or Valid Indian Driving License'] },
      { category: 'Address Proof', items: ['Aadhaar Card / Utility Bill (Electricity, Gas, Water)', 'Registered Rent Agreement or Bank Passbook'] },
      { category: 'Income Proof (Salaried)', items: ['Latest 3 months salary slips with deductions itemized', 'Latest 6 months salary account bank statements', 'Form 16 or Income Tax Returns for past 2 assessment years'] },
      { category: 'Income Proof (Self-Employed)', items: ['Audited Balance Sheet & Profit-Loss Account for past 2 years', 'ITR computations for 2 consecutive years', 'Operating bank account statements for last 12 months'] }
    ],
    applicationProcess: [
      { stepNumber: 1, stepTitle: 'Submit Loan Details', stepDescription: 'Fill out our dedicated personal loan enquiry form with employment profile and required amount.' },
      { stepNumber: 2, stepTitle: 'Multi-Bank Matching', stepDescription: 'Our financial advisory desk matches your profile against 20+ partner banks for optimal rate quotes.' },
      { stepNumber: 3, stepTitle: 'Digital Verification', stepDescription: 'Submit KYC and income documents via secure paperless e-KYC channels for fast underwriting.' },
      { stepNumber: 4, stepTitle: 'Sanction & Disbursal', stepDescription: 'Execute e-Mandate and digital loan agreement; funds are credited directly to your bank account.' }
    ],
    faqs: [
      { question: 'What is a Personal Loan and how does it work?', answer: 'A personal loan is an unsecured installment loan provided by banks and NBFCs without requiring collateral. The borrowed principal plus interest is repaid in fixed monthly EMIs over a predetermined tenure.' },
      { question: 'Can I apply for a personal loan if I am self-employed?', answer: 'Yes. Self-employed individuals, doctors, chartered accountants, and business owners with at least 2 years of profitable operations and filed ITRs are eligible for personal loans.' },
      { question: 'What is the processing fee charged on personal loans?', answer: 'Processing fees generally vary from 1.0% to 2.5% of the sanctioned loan principal plus applicable GST, deducted upfront from the disbursed amount.' },
      { question: 'Does applying through FinAdvise affect my credit score?', answer: 'No. Our preliminary advisory matching does not trigger hard credit bureau inquiries. A formal hard pull is only conducted once you select a specific lender.' },
      { question: 'Can I prepay or foreclose my personal loan before tenure ends?', answer: 'Yes. Most lenders allow foreclosure or part-prepayment after completing 6 to 12 monthly installments, subject to bank foreclosure guidelines.' }
    ],
    isPublished: true
  },
  {
    slug: 'loan-against-securities',
    name: 'Loan Against Securities',
    tagline: 'Unlock liquidity against mutual funds and shares without liquidating portfolio',
    icon: 'TrendingUp',
    heroImage: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80',
    orderIndex: 2,
    indicativeInterestRate: '9.00% - 12.50% p.a.',
    maxTenure: '12 to 36 Months (Renewable)',
    maxLoanAmount: 'Up to ₹5 Crores',
    processingFee: '0.5% - 1.0% + GST',
    shortDescription: 'Leverage your equity shares, mutual funds, and sovereign gold bonds into an active credit overdraft line without losing dividends, compounding, or market upside.',
    overview: 'Loan Against Securities (LAS) allows long-term investors to unlock instant liquidity against their market investments without liquidating their holdings during volatile cycles. By creating a digital lien in favor of partner banks through NSDL or CDSL depositories, you receive an overdraft limit where interest is levied strictly on the funds you withdraw for the exact days utilized.',
    keyBenefits: [
      { title: 'Retain 100% Portfolio Growth', description: 'Dividends, bonuses, rights issues, and compounding capital appreciation remain completely yours.' },
      { title: 'Pay Interest on Usage Only', description: 'Operates as an overdraft credit line. If you utilize ₹2 Lakhs from a ₹10 Lakh limit, you pay interest only on ₹2 Lakhs.' },
      { title: 'Zero Premature Exit Penalties', description: 'Avoid selling mutual funds before tax lock-in expires or during market corrections at distress valuations.' },
      { title: '100% Digital Lien Marking', description: 'Seamless pledge creation directly through OTP authorization with NSDL, CDSL, CAMS, or KFintech.' },
      { title: 'Substantially Lower Interest', description: 'Because securities act as high-quality liquid collateral, interest rates are markedly lower than unsecured credit.' },
      { title: 'Annual Limit Renewal', description: 'Overdraft limit is easily renewed annually upon regular interest servicing without repeated documentation.' }
    ],
    features: [
      { title: 'Attractive Loan-to-Value (LTV)', description: 'Receive up to 50% LTV against approved equity shares and up to 85% against debt mutual funds.' },
      { title: 'Flexible Repayment', description: 'Service monthly interest and repay principal whenever surplus cash flows into your business or account.' },
      { title: 'Multi-Security Basket', description: 'Pledge a diversified basket of equities, balanced funds, equity mutual funds, and SGBs under one facility.' }
    ],
    eligibilityCriteria: [
      { criteria: 'Eligible Securities', detail: 'Approved listed equities on NSE/BSE, equity mutual funds, debt funds, and Sovereign Gold Bonds (SGB)' },
      { criteria: 'Minimum Portfolio Value', detail: 'Minimum investment portfolio valuation of ₹1,00,000 held in demat account or mutual fund folios' },
      { criteria: 'Eligible Borrowers', detail: 'Resident Individuals, HUFs, Sole Proprietorships, and Corporate Entities holding demat accounts' },
      { criteria: 'Depository Registration', detail: 'Demat accounts held with registered depository participants under NSDL or CDSL' },
      { criteria: 'Applicant Age Limit', detail: '18 to 70 years with valid KYC and active linked bank savings/current account' }
    ],
    requiredDocuments: [
      { category: 'Holdings Documentation', items: ['Consolidated Account Statement (CAS) from CAMS/KFintech or NSDL/CDSL', 'Client Master List (CML) showing DP ID and Client ID', 'Holding statement with latest NAV / Market Closing Valuation'] },
      { category: 'Identity & Address KYC', items: ['PAN Card copy', 'Aadhaar Card / Passport / Voter ID', 'Cancelled cheque of linked bank savings/current account'] }
    ],
    applicationProcess: [
      { stepNumber: 1, stepTitle: 'Submit Portfolio Statement', stepDescription: 'Upload your latest CAS or select mutual fund AMC folios through our secure consultation desk.' },
      { stepNumber: 2, stepTitle: 'LTV & Limit Valuation', stepDescription: 'Our advisors match with lenders offering maximum LTV spreads and lowest annual benchmark rates.' },
      { stepNumber: 3, stepTitle: 'Digital Lien Creation', stepDescription: 'Authorize digital pledge marking via depository OTP on CDSL/NSDL without parting with your securities.' },
      { stepNumber: 4, stepTitle: 'Overdraft Line Activation', stepDescription: 'Your sanctioned credit overdraft line is activated in your linked bank account within 24 hours.' }
    ],
    faqs: [
      { question: 'Do I still receive dividends while my shares or mutual funds are pledged?', answer: 'Yes. All corporate dividends, bonuses, stock splits, and mutual fund payouts continue to flow directly into your registered bank account.' },
      { question: 'What happens if the market value of my pledged shares drops?', answer: 'If portfolio value drops below required margin thresholds due to market volatility, the lender requests a margin top-up by pledging additional securities or paying cash.' },
      { question: 'How is interest calculated on Loan Against Securities?', answer: 'Interest is calculated on a simple daily reducing balance based strictly on the utilized amount, not on the total sanctioned limit.' },
      { question: 'Can I unpledge individual securities when needed?', answer: 'Yes. You can unpledge partial or whole securities anytime as long as the remaining portfolio maintains the required Loan-to-Value margin.' },
      { question: 'Which mutual fund schemes are accepted for pledging?', answer: 'Most equity schemes, ELSS (after mandatory 3-year lock-in), debt funds, and index funds registered with SEBI-approved AMCs are acceptable.' }
    ],
    isPublished: true
  },
  {
    slug: 'business-loan',
    name: 'Business Loan',
    tagline: 'Catalyze enterprise growth, working capital, and operational expansion',
    icon: 'Briefcase',
    heroImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    orderIndex: 3,
    indicativeInterestRate: '11.25% - 19.50% p.a.',
    maxTenure: 'Up to 7 Years',
    maxLoanAmount: 'Up to ₹2 Crores',
    processingFee: '1.5% - 3.0% + GST',
    shortDescription: 'Unsecured and collateralized business financing solutions designed to fuel working capital, raw material inventory, equipment acquisition, and business expansion.',
    overview: 'Fuel your business aspirations with tailored Business Loans. Whether managing seasonal working capital cycles, purchasing modern industrial machinery, hiring talent, or scaling physical operations, our commercial desk matches MSMEs and established enterprises with verified institutional banks and non-banking finance companies across India.',
    keyBenefits: [
      { title: 'Collateral-Free Options', description: 'Access up to ₹75 Lakhs in unsecured commercial credit based solely on verified business cash flows and banking velocity.' },
      { title: 'High Quantum Sanctions', description: 'Scale funding up to ₹2 Crores for manufacturing, trading, distribution, and service enterprises.' },
      { title: 'Custom Repayment Structures', description: 'Term loans, dropline overdrafts, or seasonal repayment cycles synchronized with your sales realization.' },
      { title: '100% Tax-Deductible Interest', description: 'Interest paid on business loans is fully recognized as legitimate business expenditure under the Income Tax Act.' },
      { title: 'Enhance Credit Reputation', description: 'Timely servicing builds corporate credit profile with commercial bureaus like CIBIL Commercial and CRIF.' },
      { title: 'Fast Commercial Underwriting', description: 'Automated GST analytics and bank statement underwriting minimize sanction turnaround to 3-5 business days.' }
    ],
    features: [
      { title: 'Flexible Credit Facilities', description: 'Choose between structured term loans, working capital overdraft lines, and bank guarantees.' },
      { title: 'No Equity Dilution', description: 'Retain complete equity control, board voting power, and management autonomy over your enterprise.' },
      { title: 'Transparent Terms', description: 'Zero hidden clauses or variable margins; all processing levies and charges are declared upfront.' }
    ],
    eligibilityCriteria: [
      { criteria: 'Business Vintage', detail: 'Minimum 2 years of active, continuous business operations with verified registration' },
      { criteria: 'Minimum Annual Turnover', detail: 'Minimum ₹40 Lakhs reported annual gross turnover reflected in GST returns and bank credits' },
      { criteria: 'Profitability Track Record', detail: 'Positive profit after tax (PAT) or positive operating cash flows for preceding 2 financial years' },
      { criteria: 'Applicant & Constitution', detail: 'Sole Proprietorship, Partnership Firm, Private Limited Company, or LLP entities' },
      { criteria: 'Promoter Age & CIBIL', detail: 'Promoter age 24 to 65 years with commercial and personal CIBIL scores of 680+' }
    ],
    requiredDocuments: [
      { category: 'Financial Documents', items: ['Last 2 years audited Balance Sheet & Profit-Loss Account with CA certification', 'Income Tax Returns (ITR) with complete computation schedules for 2 consecutive years', 'Latest 12 months operating bank account statements in PDF format'] },
      { category: 'Business Registration Proof', items: ['GST Registration Certificate and 12-month GST filing returns', 'Udyam / MSME Registration Certificate', 'Partnership Deed / MOA & AOA with Certificate of Incorporation'] },
      { category: 'Promoter KYC', items: ['PAN Card of Company and Promoters/Directors', 'Aadhaar Card and address proof of all key partners/directors', 'Current operational business address proof (Utility bill / Lease deed)'] }
    ],
    applicationProcess: [
      { stepNumber: 1, stepTitle: 'Enterprise Review', stepDescription: 'Submit business turnover, vintage, and funding requirements through our consultation form.' },
      { stepNumber: 2, stepTitle: 'Financial Appraisal', stepDescription: 'Our corporate desk evaluates debt-service coverage ratio (DSCR) and banking velocity across 20+ institutions.' },
      { stepNumber: 3, stepTitle: 'Lender Term Sheet', stepDescription: 'Receive comparative term sheets with optimal interest rates, processing charges, and repayment horizons.' },
      { stepNumber: 4, stepTitle: 'Sanction & Fund Release', stepDescription: 'Digital sanction letter issued and capital disbursed directly into your commercial current account.' }
    ],
    faqs: [
      { question: 'What is the difference between secured and unsecured business loans?', answer: 'Unsecured business loans require zero collateral and are sanctioned based on turnover and bank statements. Secured business loans require property, machinery, or liquid assets pledged as security, offering lower interest rates and higher amounts.' },
      { question: 'Can newly registered startup companies apply?', answer: 'Unsecured business loans generally require at least 2 years of verified operations. For early-stage companies, secured business credit or loans against property are recommended.' },
      { question: 'Is GST registration mandatory for business loans?', answer: 'Yes. Most institutional lenders require GST registration and at least 12 months of GSTR-3B filings to verify legitimate operational turnover.' },
      { question: 'Can business loans be used to buy machinery or inventory?', answer: 'Yes. Funds can be deployed freely for inventory replenishment, machinery modernization, hiring, expansion, or debtor financing.' },
      { question: 'What is the repayment tenure for business term loans?', answer: 'Business term loans generally feature repayment tenures between 12 months and 7 years, tailored to your projected cash flow.' }
    ],
    isPublished: true
  },
  {
    slug: 'home-loan',
    name: 'Home Loan',
    tagline: 'Realize your dream home with low interest rates and extended repayment tenures',
    icon: 'Home',
    heroImage: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80',
    orderIndex: 4,
    indicativeInterestRate: '8.40% - 9.85% p.a.',
    maxTenure: 'Up to 30 Years',
    maxLoanAmount: 'Up to ₹10 Crores',
    processingFee: '0.25% - 0.50% + GST',
    shortDescription: 'Comprehensive home financing for ready-to-move properties, under-construction apartments, self-construction, plot purchase, and balance transfer with top-up.',
    overview: 'Purchasing a home is among life’s most significant financial milestones. Our Home Loan advisory connects you with market-leading repo-linked home finance schemes from premier public sector banks, private institutions, and housing finance companies. Enjoy extended tenures up to 30 years, minimal interest spreads, and transparent legal and technical validation.',
    keyBenefits: [
      { title: 'Market-Leading Benchmark Rates', description: 'Benefit from benchmark repo-linked lending rates (RLLR) ensuring automatic rate reductions during rate-cut cycles.' },
      { title: 'Extended 30-Year Repayments', description: 'Keep monthly EMIs affordable by spreading repayments across comfortable tenures stretching up to 30 years.' },
      { title: 'Substantial Tax Benefits', description: 'Claim annual tax deductions up to ₹1.5 Lakh under Section 80C (Principal) and up to ₹2 Lakh under Section 24(b) (Interest).' },
      { title: 'Home Loan Balance Transfer', description: 'Transfer existing high-interest mortgages to lower rate lenders along with high-value top-up capital.' },
      { title: 'High Loan-to-Value (LTV)', description: 'Sanctions up to 90% of agreement value for properties up to ₹30 Lakhs, and up to 75-80% for higher ticket sizes.' },
      { title: 'Doorstep Technical & Legal Guidance', description: 'Lenders verify developer approvals, clear legal titles, and municipal sanctions before releasing funds.' }
    ],
    features: [
      { title: 'No Prepayment Penalty', description: 'Zero prepayment or foreclosure charges on floating interest rate home loans for individual borrowers.' },
      { title: 'PMAY & Govt Subsidies', description: 'Assistance in tapping into applicable credit-linked interest subsidy schemes for first-time home buyers.' },
      { title: 'Top-Up Loan Availability', description: 'Access supplementary capital at attractive home loan interest rates for interior design or renovation.' }
    ],
    eligibilityCriteria: [
      { criteria: 'Applicant Age Bracket', detail: '21 to 65 years (maximum age at loan maturity)' },
      { criteria: 'Eligible Profiles', detail: 'Salaried employees in private/public sector, professionals (CAs, Doctors), and self-employed business owners' },
      { criteria: 'Minimum Income', detail: 'Net monthly income of ₹30,000 for salaried applicants; stable audited ITRs for self-employed' },
      { criteria: 'Credit Score Benchmark', detail: 'CIBIL score of 750+ qualifies for the absolute lowest interest rate slabs in the market' },
      { criteria: 'Co-Applicant Inclusions', detail: 'Co-applicant (spouse, parents, working child) can be added to significantly increase loan quantum' }
    ],
    requiredDocuments: [
      { category: 'Property Ownership Documents', items: ['Copy of Allotment Letter / Registered Agreement of Sale', 'Approved floor plan and structural layout approved by municipal corporation', 'Chain of title deeds for the past 30 years / Encumbrance Certificate (EC)', 'NOC from builder, development authority, or cooperative housing society'] },
      { category: 'Salaried Financial Records', items: ['Latest 3 months salary slips with deductions itemized', 'Form 16 for past 2 financial years', '6 months salary account bank statements'] },
      { category: 'Self-Employed Financial Records', items: ['3 years audited Balance Sheet & P&L statements with computation sheets', '3 years Income Tax Returns (ITR)', '12 months primary operating bank statements'] }
    ],
    applicationProcess: [
      { stepNumber: 1, stepTitle: 'Enquiry & Eligibility Check', stepDescription: 'Enter property purchase value, applicant income, and location to calculate maximum sanction eligibility.' },
      { stepNumber: 2, stepTitle: 'Pre-Approval Sanction', stepDescription: 'Receive in-principle sanction letter empowering you to negotiate property purchases with complete confidence.' },
      { stepNumber: 3, stepTitle: 'Legal & Technical Appraisal', stepDescription: 'Lender engineers and advocates conduct title search, technical valuation, and municipal approval audit.' },
      { stepNumber: 4, stepTitle: 'Loan Agreement & Registry', stepDescription: 'Execute loan documents, deposit original title deeds, and funds are disbursed upon sale registration.' }
    ],
    faqs: [
      { question: 'What is the maximum financing percentage for home loans?', answer: 'Under RBI regulations, banks can finance up to 90% for property values up to ₹30 Lakhs, 80% for values between ₹30 Lakhs and ₹75 Lakhs, and 75% for properties above ₹75 Lakhs.' },
      { question: 'Are there foreclosure charges on home loans?', answer: 'Under RBI guidelines, floating interest rate home loans sanctioned to individual borrowers carry zero prepayment or foreclosure penalties.' },
      { question: 'Can I add a co-applicant to increase my loan eligibility?', answer: 'Yes. Adding an earning co-applicant like your spouse, father, mother, or son allows the lender to pool both incomes, significantly raising total sanction capacity.' },
      { question: 'What is the difference between fixed and floating interest rates?', answer: 'A fixed rate remains constant regardless of economic shifts, while a floating rate adjusts in tandem with the RBI repo rate, allowing you to benefit from rate reductions.' },
      { question: 'How long does home loan sanction take?', answer: 'Pre-approval takes 2 to 3 days. Complete legal verification and technical appraisal usually require 7 to 10 working days.' }
    ],
    isPublished: true
  },
  {
    slug: 'loan-against-property',
    name: 'Loan Against Property',
    tagline: 'High-value liquidity by unlocking equity trapped in residential or commercial real estate',
    icon: 'Building2',
    heroImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    orderIndex: 5,
    indicativeInterestRate: '9.15% - 11.75% p.a.',
    maxTenure: 'Up to 15 Years',
    maxLoanAmount: 'Up to ₹15 Crores',
    processingFee: '0.75% - 1.50% + GST',
    shortDescription: 'Monetize existing residential, commercial, or industrial real estate assets for major business capital, debt consolidation, or asset acquisition at substantially lower interest rates.',
    overview: 'Loan Against Property (LAP) is a secured mortgage credit facility allowing property owners to borrow substantial capital at significantly lower interest rates than unsecured loans by mortgaging their freehold residential, commercial, or industrial properties. The ownership and operational utility of the property remain 100% yours throughout the repayment tenure.',
    keyBenefits: [
      { title: 'Substantial Loan Quantum', description: 'Unlock up to 60-75% of the fair market valuation of your property, securing ticket sizes up to ₹15 Crores.' },
      { title: 'Significantly Lower Rates', description: 'Backed by immovable real estate, interest rates are markedly cheaper than personal or unsecured commercial credit.' },
      { title: 'Comfortable 15-Year Horizon', description: 'Spread installments across up to 15 years to maintain healthy business operational liquidity.' },
      { title: 'Retain Full Property Utility', description: 'Continue living in, operating from, or renting out your mortgaged real estate without interruption.' },
      { title: 'Zero End-Use Restrictions', description: 'Deploy capital freely for business expansion, child higher education, debt consolidation, or personal requirements.' },
      { title: 'Balance Transfer with High Top-Up', description: 'Refinance existing high-interest commercial debt or LAP to lower benchmark interest rates with top-up funds.' }
    ],
    features: [
      { title: 'Commercial & Residential Accepted', description: 'Mortgage self-occupied homes, rented commercial offices, retail shops, or industrial units.' },
      { title: 'Overdraft or Term Loan Choice', description: 'Choose between standard term loan installments or a dropline overdraft facility.' },
      { title: 'High Property Valuation Multipliers', description: 'Experienced empanelled valuation engineers ensure your property is appraised at fair market rates.' }
    ],
    eligibilityCriteria: [
      { criteria: 'Eligible Properties', detail: 'Freehold residential flats, independent bungalows, commercial offices, shops, and approved industrial units' },
      { criteria: 'Property Title Health', detail: 'Clear, marketable title free from any existing encumbrances, litigation, or title defects' },
      { criteria: 'Eligible Borrowers', detail: 'Salaried employees, self-employed professionals, sole proprietorships, partnership firms, and private limited companies' },
      { criteria: 'Applicant Age Bracket', detail: '25 to 65 years with stable, verifiable income track record' },
      { criteria: 'CIBIL Requirement', detail: 'Minimum credit score of 700+ for optimal interest rate slabs and faster sanction' }
    ],
    requiredDocuments: [
      { category: 'Property Title Documents', items: ['Registered Title Deed, Conveyance Deed, or Sale Deed', 'Prior title deeds chain establishing 30 years continuous ownership history', 'Approved building plan, municipal sanction layout, and Occupancy Certificate (OC)', 'Latest Property Tax payment receipt and mutation certificate', 'Encumbrance Certificate (EC) for the past 13 to 30 years'] },
      { category: 'Financial & Income Proof', items: ['Last 3 years audited Balance Sheet & P&L accounts with computation sheets', 'Last 3 years Income Tax Returns (ITR)', 'Latest 12 months operating bank account statements'] }
    ],
    applicationProcess: [
      { stepNumber: 1, stepTitle: 'Submit Property Details', stepDescription: 'Provide property location, estimated market valuation, property type, and required funding.' },
      { stepNumber: 2, stepTitle: 'Technical & Legal Search', stepDescription: 'Empanelled advocates conduct thorough 30-year title search; valuation engineers inspect the site.' },
      { stepNumber: 3, stepTitle: 'Financial Assessment', stepDescription: 'Credit underwriter assesses debt-service capacity against property market value to approve sanction.' },
      { stepNumber: 4, stepTitle: 'Mortgage & Disbursement', stepDescription: 'Execute equitable mortgage agreement, deposit original title deeds, and funds are disbursed.' }
    ],
    faqs: [
      { question: 'What is the key difference between a Home Loan and a Loan Against Property?', answer: 'A Home Loan is taken specifically to purchase or construct a new home. A Loan Against Property is a mortgage on an existing property you already own to secure capital for business or personal use.' },
      { question: 'Can I mortgage commercial or industrial properties?', answer: 'Yes. Commercial office units, retail shops, and approved industrial premises with clear title deeds are acceptable collateral for LAP.' },
      { question: 'What happens to the property during the loan tenure?', answer: 'The original title deeds are safely held in the lending bank’s high-security vault. You retain full ownership, occupancy, and can continue using or renting the property.' },
      { question: 'Can rented-out properties be mortgaged?', answer: 'Yes. Rented properties can be mortgaged, and the rental cash flow (Lease Rental Discounting / LRD) can even be factored in to increase your loan eligibility.' },
      { question: 'What is the maximum Loan-to-Value (LTV) ratio on LAP?', answer: 'Lenders typically finance between 50% and 75% of the property’s current fair market valuation, depending on whether it is residential or commercial.' }
    ],
    isPublished: true
  },
  {
    slug: 'education-loan',
    name: 'Education Loan',
    tagline: 'Finance higher education in premier Indian universities and top global destinations',
    icon: 'GraduationCap',
    heroImage: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
    orderIndex: 6,
    indicativeInterestRate: '9.50% - 13.50% p.a.',
    maxTenure: 'Up to 15 Years (plus Moratorium)',
    maxLoanAmount: 'Up to ₹1.5 Crores',
    processingFee: '0.50% - 1.50% + GST',
    shortDescription: 'Dedicated financial assistance for domestic and international higher education covering tuition fees, living expenses, travel, laptop, and insurance with flexible repayment moratorium.',
    overview: 'Do not let financial constraints hold back global academic ambitions. Our Education Loan advisory guides students and parents through secured and unsecured student loan options from premier banks and specialized NBFCs. We cover up to 100% of study expenses for premier Indian institutions and top global universities across the USA, UK, Canada, Australia, Germany, and Europe.',
    keyBenefits: [
      { title: '100% Comprehensive Expense Cover', description: 'Covers college tuition, accommodation, living expenses, international airfare, study materials, laptop, and insurance.' },
      { title: 'Repayment Moratorium Grace Period', description: 'Zero EMI during the study course duration plus an additional 6 to 12 months grace period after course completion.' },
      { title: 'Uncapped Tax Exemption (Sec 80E)', description: 'Entire interest paid on education loans is fully deductible from taxable income under Section 80E without upper ceiling.' },
      { title: 'Collateral-Free Options up to ₹50 Lakhs', description: 'Unsecured education loans for top-tier universities based solely on student academic pedigree and co-applicant profile.' },
      { title: 'Pre-Visa Disbursal Sanction', description: 'Receive verifiable loan sanction letters required for university I-20, CAS, or international student visa interviews.' },
      { title: 'Concessional Rates for Female Students', description: 'Partner banks offer specialized 0.50% interest rate concessions for female students pursuing higher education.' }
    ],
    features: [
      { title: 'Secured & Unsecured Schemes', description: 'Flexible loan structures matching your family asset portfolio and target university ranking.' },
      { title: 'Direct Forex Transfer', description: 'Direct tuition transfer in foreign currency (USD, GBP, EUR, AUD, CAD) directly to university bank accounts.' },
      { title: 'Easy Co-Applicant Requirements', description: 'Parents, legal guardians, siblings, or working spouses can act as financial co-applicants.' }
    ],
    eligibilityCriteria: [
      { criteria: 'Academic Admission Status', detail: 'Confirmed admission offer / I-20 / CAS letter from a recognized domestic or international college/university' },
      { criteria: 'Eligible Courses', detail: 'Undergraduate degrees, Masters (STEM, MBA, MS, Data Science), Medical, and recognized professional courses' },
      { criteria: 'Financial Co-Applicant', detail: 'Parent, legal guardian, or working sibling with stable income (salaried or self-employed)' },
      { criteria: 'Qualifying Standardized Exams', detail: 'Valid scores in GRE, GMAT, IELTS, TOEFL, SAT, CAT, GATE, or NEET as required by target course' },
      { criteria: 'Nationality', detail: 'Indian citizen with a valid Indian passport for overseas education' }
    ],
    requiredDocuments: [
      { category: 'Academic Records', items: ['University Admission Offer Letter / I-20 / CAS letter with fee breakdown', 'Academic mark sheets for 10th, 12th, and Undergraduate Degree', 'Standardized test scorecards (GRE, GMAT, IELTS, TOEFL, etc.)'] },
      { category: 'Student KYC', items: ['Valid Indian Passport (Mandatory for overseas education)', 'Aadhaar Card and PAN Card', 'Passport-size photographs'] },
      { category: 'Co-Applicant Financial Records', items: ['Last 3 months salary slips or last 2 years audited ITR with computation', 'Last 6 months salary/operating bank account statements', 'KYC documents of co-applicant (PAN & Aadhaar)'] }
    ],
    applicationProcess: [
      { stepNumber: 1, stepTitle: 'Submit University Details', stepDescription: 'Enter target university, program name, country of study, and estimated expense requirements.' },
      { stepNumber: 2, stepTitle: 'Lender Selection & Rate Negotiation', stepDescription: 'Compare partner banks and specialized NBFCs offering preferred interest rates for your university.' },
      { stepNumber: 3, stepTitle: 'Formal Sanction Letter Issuance', stepDescription: 'Receive the official loan sanction letter needed for visa financial evidence or university confirmation.' },
      { stepNumber: 4, stepTitle: 'Tuition Transfer & Travel Release', stepDescription: 'Direct forex wire transfer to university account and living expenses credited to student forex card.' }
    ],
    faqs: [
      { question: 'When do I have to start repaying the education loan?', answer: 'Repayment generally begins 6 to 12 months after course completion, or 6 months after securing employment, whichever occurs earlier. During the study period, you only service simple interest or nil EMI.' },
      { question: 'Is collateral always required for an education loan?', answer: 'No. Unsecured education loans up to ₹50 Lakhs are available for premier listed universities based on academic merit and co-applicant income. For higher amounts, collateral may be pledged.' },
      { question: 'What is covered under the education loan amount?', answer: 'Sanctioned funds cover 100% of college tuition fees, hostel/accommodation expenses, examination fees, books, equipment, laptop, student visa fees, and return airfare.' },
      { question: 'What tax deductions are available on education loans?', answer: 'Under Section 80E of the Indian Income Tax Act, the entire interest paid on an education loan is deductible from gross taxable income for up to 8 years without any upper limit.' },
      { question: 'Can education loans be sanctioned before visa approval?', answer: 'Yes. In fact, most foreign embassies require a verifiable financial sanction letter before granting student visas.' }
    ],
    isPublished: true
  },
  {
    slug: 'gold-loan',
    name: 'Gold Loan',
    tagline: 'Instant, hassle-free cash within minutes against physical gold ornaments',
    icon: 'Coins',
    heroImage: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=1200&q=80',
    orderIndex: 7,
    indicativeInterestRate: '8.85% - 14.00% p.a.',
    maxTenure: '3 to 24 Months',
    maxLoanAmount: 'Up to ₹2 Crores',
    processingFee: '0.25% - 0.75% + GST',
    shortDescription: 'Quick, high-value cash facility against gold jewellery with minimal paperwork, transparent non-destructive karat assay, and bank-grade secure locker storage.',
    overview: 'Gold Loan is one of the fastest and most convenient ways to access immediate liquidity. By pledging idle gold jewellery or hallmarked coins to meet urgent personal or business cash requirements, you unlock up to 75% of your gold’s true market value. With bank-grade vault storage, comprehensive insurance, and zero income document mandates, your physical gold remains completely secure.',
    keyBenefits: [
      { title: 'Express 30-Minute Disbursal', description: 'Pledge appraisal, non-destructive assay, and funds transfer completed in under 30 to 60 minutes.' },
      { title: 'Zero Income Proof Mandate', description: 'Ideal for informal entrepreneurs, homemakers, farmers, and students who lack formal income tax returns.' },
      { title: 'Bank-Grade Vault Safety', description: 'Pledged ornaments are weighed, photographed, sealed in tamper-proof bags, and vaulted with 100% insurance.' },
      { title: 'Flexible Repayment Options', description: 'Choose bullet repayment (pay principal + interest at tenure end), interest-only monthly EMIs, or regular schedules.' },
      { title: 'Maximum Loan-to-Value (LTV)', description: 'Receive up to 75% of the prevailing 22K/24K gold market price in strict accordance with RBI guidelines.' },
      { title: 'Minimal Credit Score Dependency', description: 'Because loans are fully secured by physical gold, minor past credit score blemishes do not hinder approvals.' }
    ],
    features: [
      { title: 'Non-Destructive Karat Assay', description: 'Gold purity is tested using electronic karat meters in your presence without scraping or damaging ornaments.' },
      { title: 'Part-Release Allowed', description: 'Repay partial loan principal to retrieve specific ornaments whenever convenient.' },
      { title: 'Doorstep Valuation Service', description: 'Select banking partners offer certified doorstep valuation and direct NEFT account transfer.' }
    ],
    eligibilityCriteria: [
      { criteria: 'Eligible Pledged Collateral', detail: 'Gold jewellery, ornaments, and hallmarked coins of 18K, 20K, 22K, or 24K purity' },
      { criteria: 'Minimum Gold Weight', detail: 'Minimum gold weight of 10 grams net gold content (excluding embedded stones, pearls, or gems)' },
      { criteria: 'Applicant Age Bracket', detail: '18 to 70 years' },
      { criteria: 'Applicant Ownership', detail: 'The applicant must be the rightful owner of the pledged gold ornaments' },
      { criteria: 'Basic Identification', detail: 'Valid government KYC proof (Aadhaar, PAN Card, Voter ID, or Passport)' }
    ],
    requiredDocuments: [
      { category: 'Basic KYC Proof', items: ['Aadhaar Card (e-KYC verified)', 'PAN Card or Form 60', 'Passport-size photographs of borrower'] },
      { category: 'Bank Verification', items: ['Cancelled cheque or passbook copy of bank account where loan funds will be credited'] }
    ],
    applicationProcess: [
      { stepNumber: 1, stepTitle: 'Submit Enquiry', stepDescription: 'Enter approximate gold weight in grams, expected purity, and required loan funding amount.' },
      { stepNumber: 2, stepTitle: 'Gold Assay & Valuation', stepDescription: 'Certified valuer tests gold purity in your presence using precision electronic karat meters.' },
      { stepNumber: 3, stepTitle: 'Instant NEFT / Cash Credit', stepDescription: 'Loan agreement executed and funds transferred immediately to your verified bank account.' },
      { stepNumber: 4, stepTitle: 'Sealed Vault Custody', stepDescription: 'Jewellery is sealed in tamper-proof bags in your presence and deposited into bank safe vault.' }
    ],
    faqs: [
      { question: 'What happens to my gold jewellery while it is in the bank vault?', answer: 'Your gold is weighed, sealed in tamper-proof containers in your presence, and stored inside multi-tier bank vaults with 100% insurance coverage until the loan is fully repaid.' },
      { question: 'How is gold purity determined?', answer: 'Authorized appraisers test purity non-destructively using electronic karat meters and touchstones in your presence, ensuring zero damage to your jewellery.' },
      { question: 'What is a bullet repayment scheme in gold loans?', answer: 'In bullet repayment, you pay neither principal nor monthly interest during the tenure. The entire principal plus accumulated interest is paid as a single lump-sum at the end of the loan tenure.' },
      { question: 'Can I repay early and retrieve my gold without penalty?', answer: 'Yes. Most gold loan partners allow early repayment anytime without foreclosure penalties, releasing your gold immediately upon closure.' },
      { question: 'What happens if gold market prices drop significantly?', answer: 'Under RBI guidelines, if market prices fall significantly, the lender may request a small margin adjustment or part-payment to maintain the mandatory 75% LTV.' }
    ],
    isPublished: true
  },
  {
    slug: 'vehicle-loan',
    name: 'Vehicle Loan',
    tagline: 'Financing for new and used cars with flexible tenures and competitive interest rates',
    icon: 'CarFront',
    heroImage: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80',
    orderIndex: 8,
    indicativeInterestRate: '8.75% - 14.50% p.a.',
    maxTenure: 'Up to 7 Years',
    maxLoanAmount: 'Up to ₹1.5 Crores',
    processingFee: '0.5% - 1.5% + GST',
    shortDescription: 'Financing for new and used cars with flexible tenures and competitive interest rates.',
    overview: 'A Vehicle Loan provides tailored financing solutions to help you purchase your dream new car, certified pre-owned vehicle, or commercial vehicle. With financing up to 100% on-road funding from top partner banks, minimal documentation, instant digital sanctions, and extended repayment tenures up to 7 years, drive home your preferred vehicle with complete peace of mind.',
    keyBenefits: [
      { title: 'Up to 100% On-Road Funding', description: 'Comprehensive finance covering ex-showroom price, registration, and insurance.' },
      { title: 'Flexible Tenures Up to 7 Years', description: 'Structure manageable monthly EMIs spanning 12 to 84 months.' },
      { title: 'Multi-Bank Interest Comparison', description: 'Access competitive interest rates from 20+ leading banks and NBFCs.' },
      { title: 'Fast Digital Approvals', description: 'Minimal documentation with doorstep or branch delivery support.' }
    ],
    features: [
      { title: 'Fixed Interest Rates', description: 'Predictable monthly EMIs throughout the loan tenure unaffected by market volatility.' },
      { title: 'Dealership Coordination', description: 'Direct disbursal and tie-up with authorized automobile dealerships across India.' }
    ],
    eligibilityCriteria: [
      { criteria: 'Age Bracket', detail: '21 to 65 years' },
      { criteria: 'Minimum Income', detail: '₹25,000 net monthly salary or profitable 2-year business ITR' },
      { criteria: 'Credit Score', detail: 'CIBIL score of 700+ preferred' }
    ],
    requiredDocuments: [
      { category: 'Basic KYC', items: ['Aadhaar Card', 'PAN Card', 'Valid Driving License'] },
      { category: 'Income Proof', items: ['Latest 3 months salary slips or 2 years ITR', '6 months bank statements'] },
      { category: 'Vehicle Invoice', items: ['Proforma Invoice from authorized car dealership'] }
    ],
    applicationProcess: [
      { stepNumber: 1, stepTitle: 'Select Car & Loan Details', stepDescription: 'Provide car model details and required loan amount.' },
      { stepNumber: 2, stepTitle: 'Bank Quote Matching', stepDescription: 'Compare interest rates and processing terms across partner banks.' },
      { stepNumber: 3, stepTitle: 'Document Verification', stepDescription: 'Submit KYC and income documents for digital verification.' },
      { stepNumber: 4, stepTitle: 'Dealer Disbursal', stepDescription: 'Funds disbursed directly to dealership for car delivery.' }
    ],
    faqs: [
      { question: 'What is the maximum tenure for a vehicle loan?', answer: 'Vehicle loans are available for repayment tenures up to 7 years (84 months) for new cars and up to 5 years for used cars.' }
    ],
    isPublished: true
  }
];

// Helper to seed or verify database loans
const ensureLoansSeeded = async () => {
  if (mongoose.connection && mongoose.connection.readyState === 1) {
    const count = await Loan.countDocuments();
    if (count < 8) {
      for (const item of DEFAULT_LOAN_PRODUCTS) {
        await Loan.findOneAndUpdate(
          { slug: item.slug },
          item,
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );
      }
      console.log('[Loan] All 7 Loan Products ensured in MongoDB');
    }
  }
};

// @desc    Get all loans (Public: only published, Admin: all if query admin=true)
// @route   GET /api/loans
// @access  Public
const getAllLoans = async (req, res, next) => {
  try {
    const isDashboard = req.query.admin === 'true';
    const isDbConnected = mongoose.connection && mongoose.connection.readyState === 1;

    if (isDbConnected) {
      await ensureLoansSeeded();
      const filter = isDashboard ? {} : { isPublished: true };
      const loans = await Loan.find(filter).sort({ orderIndex: 1, createdAt: 1 });
      if (loans && loans.length > 0) {
        return res.json({
          success: true,
          data: loans
        });
      }
    }

    // Fallback: Return in-memory verified loan products
    const fallbackLoans = isDashboard 
      ? DEFAULT_LOAN_PRODUCTS 
      : DEFAULT_LOAN_PRODUCTS.filter(l => l.isPublished);

    res.json({
      success: true,
      data: fallbackLoans
    });
  } catch (error) {
    // If DB fails, serve default loans gracefully
    res.json({
      success: true,
      data: DEFAULT_LOAN_PRODUCTS
    });
  }
};

// @desc    Get single loan by slug
// @route   GET /api/loans/:slug
// @access  Public
const getLoanBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const isDbConnected = mongoose.connection && mongoose.connection.readyState === 1;

    if (isDbConnected) {
      await ensureLoansSeeded();
      const loan = await Loan.findOne({ slug });
      if (loan) {
        if (!loan.isPublished && req.query.admin !== 'true') {
          return res.status(404).json({
            success: false,
            message: 'Loan product currently unavailable'
          });
        }
        return res.json({
          success: true,
          data: loan
        });
      }
    }

    // Fallback: Check verified products list
    const foundFallback = DEFAULT_LOAN_PRODUCTS.find(l => l.slug === slug);
    if (foundFallback) {
      if (!foundFallback.isPublished && req.query.admin !== 'true') {
        return res.status(404).json({
          success: false,
          message: 'Loan product currently unavailable'
        });
      }
      return res.json({
        success: true,
        data: foundFallback
      });
    }

    return res.status(404).json({
      success: false,
      message: `Loan product '${slug}' not found`
    });
  } catch (error) {
    const foundFallback = DEFAULT_LOAN_PRODUCTS.find(l => l.slug === req.params.slug);
    if (foundFallback) {
      return res.json({
        success: true,
        data: foundFallback
      });
    }
    next(error);
  }
};

// @desc    Create new loan category
// @route   POST /api/admin/loans
// @access  Private (Admin)
const createLoan = async (req, res, next) => {
  try {
    const loan = await Loan.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Loan category created successfully',
      data: loan
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update loan
// @route   PUT /api/admin/loans/:slug
// @access  Private (Admin)
const updateLoan = async (req, res, next) => {
  try {
    const isDbConnected = mongoose.connection && mongoose.connection.readyState === 1;
    if (isDbConnected) {
      const loan = await Loan.findOneAndUpdate(
        { slug: req.params.slug },
        req.body,
        { new: true, runValidators: true }
      );
      if (loan) {
        return res.json({
          success: true,
          message: 'Loan updated successfully in MongoDB',
          data: loan
        });
      }
    }

    // In-memory update if DB is transitioning
    const idx = DEFAULT_LOAN_PRODUCTS.findIndex(l => l.slug === req.params.slug);
    if (idx !== -1) {
      DEFAULT_LOAN_PRODUCTS[idx] = { ...DEFAULT_LOAN_PRODUCTS[idx], ...req.body };
      return res.json({
        success: true,
        message: 'Loan updated successfully',
        data: DEFAULT_LOAN_PRODUCTS[idx]
      });
    }

    return res.status(404).json({
      success: false,
      message: 'Loan not found'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle publish status
// @route   PATCH /api/admin/loans/:slug/publish
// @access  Private (Admin)
const toggleLoanPublish = async (req, res, next) => {
  try {
    const isDbConnected = mongoose.connection && mongoose.connection.readyState === 1;
    if (isDbConnected) {
      const loan = await Loan.findOne({ slug: req.params.slug });
      if (loan) {
        loan.isPublished = !loan.isPublished;
        await loan.save();
        return res.json({
          success: true,
          message: `Loan has been ${loan.isPublished ? 'published' : 'unpublished'}`,
          data: loan
        });
      }
    }

    const found = DEFAULT_LOAN_PRODUCTS.find(l => l.slug === req.params.slug);
    if (found) {
      found.isPublished = !found.isPublished;
      return res.json({
        success: true,
        message: `Loan has been ${found.isPublished ? 'published' : 'unpublished'}`,
        data: found
      });
    }

    res.status(404).json({
      success: false,
      message: 'Loan not found'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllLoans,
  getLoanBySlug,
  createLoan,
  updateLoan,
  toggleLoanPublish,
  DEFAULT_LOAN_PRODUCTS
};
