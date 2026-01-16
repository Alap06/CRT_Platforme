const mongoose = require('mongoose');

const activityReportSchema = new mongoose.Schema({
    activity: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Activity',
        required: true
    },
    title: {
        type: String,
        required: [true, 'Le titre du rapport est requis'],
        trim: true
    },
    summary: {
        type: String,
        required: [true, 'Le résumé est requis'],
        maxlength: 500
    },
    description: {
        type: String,
        required: true
    },
    objectives: [{
        title: String,
        achieved: { type: Boolean, default: false },
        details: String
    }],
    beneficiaries: {
        count: { type: Number, min: 0 },
        categories: [{
            name: String,
            count: Number
        }],
        description: String
    },
    resourcesUsed: [{
        resource: { type: mongoose.Schema.Types.ObjectId, ref: 'Resource' },
        name: String,
        quantity: Number,
        unit: String
    }],
    budget: {
        planned: Number,
        actual: Number,
        currency: { type: String, default: 'TND' },
        details: String
    },
    volunteers: {
        count: { type: Number, min: 0 },
        hours: { type: Number, min: 0 },
        list: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
    },
    images: [{
        url: String,
        caption: String,
        uploadedAt: { type: Date, default: Date.now }
    }],
    documents: [{
        name: String,
        url: String,
        type: String,
        uploadedAt: { type: Date, default: Date.now }
    }],
    challenges: String,
    recommendations: String,
    lessons: String,
    status: {
        type: String,
        enum: ['draft', 'submitted', 'approved', 'rejected'],
        default: 'draft'
    },
    submittedAt: Date,
    approvedAt: Date,
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    committee: { type: mongoose.Schema.Types.ObjectId, ref: 'Committee' }
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

activityReportSchema.index({ activity: 1 });
activityReportSchema.index({ status: 1 });
activityReportSchema.index({ createdAt: -1 });

activityReportSchema.methods.submit = async function () {
    this.status = 'submitted';
    this.submittedAt = new Date();
    return this.save();
};

activityReportSchema.methods.approve = async function (userId) {
    this.status = 'approved';
    this.approvedAt = new Date();
    this.approvedBy = userId;
    return this.save();
};

activityReportSchema.methods.reject = async function (userId) {
    this.status = 'rejected';
    this.approvedBy = userId;
    return this.save();
};

activityReportSchema.statics.getByActivity = function (activityId) {
    return this.findOne({ activity: activityId })
        .populate('activity', 'title date')
        .populate('createdBy', 'firstName lastName')
        .populate('approvedBy', 'firstName lastName');
};

activityReportSchema.statics.getPending = function (committeeId) {
    const filter = { status: 'submitted' };
    if (committeeId) filter.committee = committeeId;
    return this.find(filter)
        .populate('activity', 'title date')
        .populate('createdBy', 'firstName lastName')
        .sort({ submittedAt: -1 });
};

module.exports = mongoose.model('ActivityReport', activityReportSchema);
