const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
    type: { type: String, enum: ['money', 'goods', 'blood'], required: true },
    donor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    anonymousDonor: { isAnonymous: Boolean, name: String, email: String, phone: String },
    amount: { type: Number, min: 0 },
    currency: { type: String, default: 'TND' },
    goods: { description: String, quantity: Number, unit: String, estimatedValue: Number },
    blood: { bloodType: String, quantity: Number },
    status: { type: String, enum: ['pending', 'received', 'processing', 'completed', 'cancelled'], default: 'pending' },
    paymentMethod: { type: String, enum: ['cash', 'card', 'transfer', 'check', 'online'] },
    receiptNumber: String,
    date: { type: Date, default: Date.now },
    receivedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    receivedAt: Date,
    campaign: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    committee: { type: mongoose.Schema.Types.ObjectId, ref: 'Committee' },
    notes: String,
    taxDeductible: { type: Boolean, default: true }
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

donationSchema.virtual('donorName').get(function () {
    if (this.donor) return null;
    return this.anonymousDonor?.isAnonymous ? 'Anonyme' : this.anonymousDonor?.name;
});

donationSchema.index({ date: -1 });
donationSchema.index({ type: 1, status: 1 });
donationSchema.index({ donor: 1 });

donationSchema.pre('save', function (next) {
    if (this.isNew && !this.receiptNumber) {
        this.receiptNumber = `DON-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    }
    next();
});

donationSchema.statics.getStatistics = async function (options = {}) {
    const match = { status: 'received' };
    if (options.startDate) match.date = { $gte: new Date(options.startDate) };
    if (options.endDate) match.date = { ...match.date, $lte: new Date(options.endDate) };
    if (options.campaign) match.campaign = mongoose.Types.ObjectId(options.campaign);

    const stats = await this.aggregate([
        { $match: match },
        { $group: { _id: '$type', count: { $sum: 1 }, total: { $sum: '$amount' } } }
    ]);
    return stats;
};

module.exports = mongoose.model('Donation', donationSchema);
