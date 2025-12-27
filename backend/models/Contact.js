const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true },
    phone: String,
    subject: { type: String, required: true },
    message: { type: String, required: true },
    category: { type: String, enum: ['general', 'volunteer', 'donation', 'partnership', 'complaint', 'suggestion', 'other'], default: 'general' },
    status: { type: String, enum: ['new', 'read', 'in_progress', 'resolved', 'closed'], default: 'new' },
    priority: { type: String, enum: ['low', 'normal', 'high', 'urgent'], default: 'normal' },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    replies: [{ content: String, author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, date: { type: Date, default: Date.now }, sentByEmail: Boolean }],
    readBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    readAt: Date,
    closedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    closedAt: Date,
    ipAddress: String,
    userAgent: String
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

contactSchema.virtual('responseTime').get(function () {
    if (!this.readAt) return null;
    return Math.round((this.readAt - this.createdAt) / (1000 * 60));
});

contactSchema.index({ status: 1, createdAt: -1 });
contactSchema.index({ category: 1 });

contactSchema.methods.markAsRead = async function (userId) {
    if (this.status === 'new') {
        this.status = 'read';
        this.readBy = userId;
        this.readAt = new Date();
    }
    return this.save();
};

contactSchema.methods.addReply = async function (content, authorId, sendEmail = false) {
    this.replies.push({ content, author: authorId, sentByEmail: sendEmail });
    if (this.status === 'new' || this.status === 'read') this.status = 'in_progress';
    return this.save();
};

contactSchema.methods.close = async function (userId) {
    this.status = 'closed';
    this.closedBy = userId;
    this.closedAt = new Date();
    return this.save();
};

contactSchema.statics.getStatistics = async function (options = {}) {
    const match = {};
    if (options.startDate) match.createdAt = { $gte: new Date(options.startDate) };
    if (options.endDate) match.createdAt = { ...match.createdAt, $lte: new Date(options.endDate) };
    return this.aggregate([{ $match: match }, { $group: { _id: '$status', count: { $sum: 1 } } }]);
};

module.exports = mongoose.model('Contact', contactSchema);
