const { FAQ, LendingPartner, News, Page, Setting, Media } = require('../models/WebsiteContent');

// 1. FAQs
const getFAQs = async (req, res, next) => {
  try {
    const { category, admin } = req.query;
    const filter = admin === 'true' ? {} : { isPublished: true };
    if (category && category !== 'All') filter.category = category;
    const faqs = await FAQ.find(filter).sort({ orderIndex: 1, createdAt: 1 });
    res.json({ success: true, data: faqs });
  } catch (error) { next(error); }
};

const createFAQ = async (req, res, next) => {
  try {
    const faq = await FAQ.create(req.body);
    res.status(201).json({ success: true, message: 'FAQ created', data: faq });
  } catch (error) { next(error); }
};

const updateFAQ = async (req, res, next) => {
  try {
    const faq = await FAQ.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, message: 'FAQ updated', data: faq });
  } catch (error) { next(error); }
};

const deleteFAQ = async (req, res, next) => {
  try {
    await FAQ.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'FAQ deleted' });
  } catch (error) { next(error); }
};

// 2. Lending Partners
const getLendingPartners = async (req, res, next) => {
  try {
    const { admin } = req.query;
    const filter = admin === 'true' ? {} : { isActive: true };
    const partners = await LendingPartner.find(filter).sort({ orderIndex: 1, createdAt: 1 });
    res.json({ success: true, data: partners });
  } catch (error) { next(error); }
};

const createLendingPartner = async (req, res, next) => {
  try {
    const partner = await LendingPartner.create(req.body);
    res.status(201).json({ success: true, message: 'Lending partner added', data: partner });
  } catch (error) { next(error); }
};

const updateLendingPartner = async (req, res, next) => {
  try {
    const partner = await LendingPartner.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, message: 'Lending partner updated', data: partner });
  } catch (error) { next(error); }
};

const deleteLendingPartner = async (req, res, next) => {
  try {
    await LendingPartner.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Lending partner deleted' });
  } catch (error) { next(error); }
};

// 3. News
const getNews = async (req, res, next) => {
  try {
    const { admin } = req.query;
    const filter = admin === 'true' ? {} : { isPublished: true };
    const news = await News.find(filter).sort({ publishedDate: -1 });
    res.json({ success: true, data: news });
  } catch (error) { next(error); }
};

const getNewsBySlug = async (req, res, next) => {
  try {
    const newsItem = await News.findOne({ slug: req.params.slug });
    if (!newsItem) return res.status(404).json({ success: false, message: 'News article not found' });
    res.json({ success: true, data: newsItem });
  } catch (error) { next(error); }
};

const createNews = async (req, res, next) => {
  try {
    const slug = (req.body.slug || req.body.title).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const newsItem = await News.create({ ...req.body, slug });
    res.status(201).json({ success: true, message: 'News added', data: newsItem });
  } catch (error) { next(error); }
};

const updateNews = async (req, res, next) => {
  try {
    const newsItem = await News.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, message: 'News updated', data: newsItem });
  } catch (error) { next(error); }
};

const deleteNews = async (req, res, next) => {
  try {
    await News.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'News deleted' });
  } catch (error) { next(error); }
};

// 4. Page CMS Content (Home, About, CIBIL, Contact, Footer)
const getPageContent = async (req, res, next) => {
  try {
    const page = await Page.findOne({ pageKey: req.params.pageKey });
    if (!page) {
      return res.json({ success: true, data: { pageKey: req.params.pageKey, sections: {} } });
    }
    res.json({ success: true, data: page });
  } catch (error) { next(error); }
};

const savePageContent = async (req, res, next) => {
  try {
    const { pageKey } = req.params;
    const { sections, title, seo } = req.body;
    const page = await Page.findOneAndUpdate(
      { pageKey },
      { sections, title, seo, lastUpdatedBy: req.admin ? req.admin.name : 'Admin' },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    res.json({ success: true, message: 'Page content updated successfully', data: page });
  } catch (error) { next(error); }
};

// 5. Settings
const getSettings = async (req, res, next) => {
  try {
    let settings = await Setting.findOne();
    if (!settings) {
      settings = await Setting.create({});
    }
    res.json({ success: true, data: settings });
  } catch (error) { next(error); }
};

const updateSettings = async (req, res, next) => {
  try {
    let settings = await Setting.findOne();
    if (!settings) {
      settings = await Setting.create(req.body);
    } else {
      settings = await Setting.findByIdAndUpdate(settings._id, req.body, { new: true });
    }
    res.json({ success: true, message: 'Settings updated successfully', data: settings });
  } catch (error) { next(error); }
};

// 6. Media
const getMediaList = async (req, res, next) => {
  try {
    const media = await Media.find().sort({ createdAt: -1 });
    res.json({ success: true, data: media });
  } catch (error) { next(error); }
};

const uploadMediaFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    const media = await Media.create({
      originalName: req.file.originalname,
      fileName: req.file.filename,
      filePath: `/uploads/${req.file.filename}`,
      mimeType: req.file.mimetype,
      size: req.file.size
    });
    res.status(201).json({ success: true, message: 'File uploaded successfully', data: media });
  } catch (error) { next(error); }
};

const deleteMediaFile = async (req, res, next) => {
  try {
    await Media.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Media removed from library' });
  } catch (error) { next(error); }
};

module.exports = {
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
};
