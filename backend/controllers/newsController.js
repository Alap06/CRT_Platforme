const News = require('../models/News');

exports.getNews = async (req, res) => {
    try {
        const { page = 1, limit = 10, category, status, featured, search } = req.query;
        const filter = {};
        if (category) filter.category = category;
        if (featured === 'true') filter.featured = true;
        if (search) filter.$or = [{ title: { $regex: search, $options: 'i' } }];
        if (!req.user || req.user.role !== 'admin') { filter.status = 'published'; filter.publishedAt = { $lte: new Date() }; }
        else if (status) filter.status = status;

        const total = await News.countDocuments(filter);
        const news = await News.find(filter).sort({ featured: -1, publishedAt: -1 }).skip((page - 1) * limit).limit(parseInt(limit)).populate('author', 'firstName lastName');
        res.json({ success: true, data: news, pagination: { total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(total / limit) } });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Erreur' });
    }
};

exports.getNewsArticle = async (req, res) => {
    try {
        const query = req.params.id.match(/^[0-9a-fA-F]{24}$/) ? { _id: req.params.id } : { slug: req.params.id };
        const article = await News.findOne(query).populate('author', 'firstName lastName');
        if (!article) return res.status(404).json({ success: false, message: 'Article non trouvé' });
        article.incrementViews().catch(() => { });
        res.json({ success: true, data: article });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Erreur' });
    }
};

exports.createNews = async (req, res) => {
    try {
        const article = await News.create({ ...req.body, author: req.user.id });
        res.status(201).json({ success: true, message: 'Article créé', data: article });
    } catch (err) {
        if (err.name === 'ValidationError') return res.status(400).json({ success: false, errors: Object.values(err.errors).map(e => e.message) });
        res.status(500).json({ success: false, message: 'Erreur' });
    }
};

exports.updateNews = async (req, res) => {
    try {
        const article = await News.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!article) return res.status(404).json({ success: false, message: 'Article non trouvé' });
        res.json({ success: true, data: article });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Erreur' });
    }
};

exports.deleteNews = async (req, res) => {
    try {
        const article = await News.findByIdAndDelete(req.params.id);
        if (!article) return res.status(404).json({ success: false, message: 'Article non trouvé' });
        res.json({ success: true, message: 'Article supprimé' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Erreur' });
    }
};

exports.publishNews = async (req, res) => {
    try {
        const article = await News.findById(req.params.id);
        if (!article) return res.status(404).json({ success: false, message: 'Article non trouvé' });
        article.status = 'published';
        article.publishedAt = new Date();
        await article.save();
        res.json({ success: true, data: article });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Erreur' });
    }
};

exports.getFeaturedNews = async (req, res) => {
    try {
        const news = await News.getFeatured(parseInt(req.query.limit) || 5);
        res.json({ success: true, data: news });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Erreur' });
    }
};

exports.getRecentNews = async (req, res) => {
    try {
        const news = await News.getRecent(parseInt(req.query.limit) || 10, req.query.category);
        res.json({ success: true, data: news });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Erreur' });
    }
};
