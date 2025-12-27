const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true },
    summary: { type: String, maxlength: 500 },
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    category: { type: String, enum: ['news', 'event', 'announcement', 'press', 'success_story', 'campaign'], default: 'news' },
    status: { type: String, enum: ['draft', 'published', 'archived'], default: 'draft' },
    images: [{ url: String, caption: String, isMain: Boolean }],
    tags: [String],
    featured: { type: Boolean, default: false },
    publishedAt: Date,
    views: { type: Number, default: 0 },
    relatedActivity: { type: mongoose.Schema.Types.ObjectId, ref: 'Activity' },
    relatedProject: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    committee: { type: mongoose.Schema.Types.ObjectId, ref: 'Committee' },
    seo: { metaTitle: String, metaDescription: String }
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

newsSchema.virtual('readingTime').get(function () {
    if (!this.content) return 0;
    return Math.ceil(this.content.split(/\s+/).length / 200);
});

newsSchema.virtual('isPublished').get(function () {
    return this.status === 'published' && this.publishedAt && new Date(this.publishedAt) <= new Date();
});

newsSchema.index({ status: 1, publishedAt: -1 });
newsSchema.index({ category: 1 });
newsSchema.index({ slug: 1 });

newsSchema.pre('save', function (next) {
    if (this.isModified('title') && !this.slug) {
        this.slug = this.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now().toString(36);
    }
    next();
});

newsSchema.methods.incrementViews = async function () {
    this.views += 1;
    return this.save();
};

newsSchema.statics.getFeatured = function (limit = 5) {
    return this.find({ status: 'published', featured: true, publishedAt: { $lte: new Date() } })
        .sort({ publishedAt: -1 }).limit(limit).populate('author', 'firstName lastName');
};

newsSchema.statics.getRecent = function (limit = 10, category) {
    const filter = { status: 'published', publishedAt: { $lte: new Date() } };
    if (category) filter.category = category;
    return this.find(filter).sort({ publishedAt: -1 }).limit(limit).populate('author', 'firstName lastName');
};

module.exports = mongoose.model('News', newsSchema);
