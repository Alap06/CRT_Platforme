const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    shortDescription: { type: String, maxlength: 300 },
    category: { type: String, enum: ['health', 'education', 'social', 'emergency', 'environment', 'infrastructure'], required: true },
    status: { type: String, enum: ['draft', 'planned', 'active', 'completed', 'suspended', 'cancelled'], default: 'draft' },
    manager: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    committee: { type: mongoose.Schema.Types.ObjectId, ref: 'Committee' },
    team: [{ user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, role: String, joinedAt: { type: Date, default: Date.now } }],
    partners: [{ name: String, type: String, contribution: String }],
    objectives: [{ title: String, description: String, achieved: Boolean }],
    budget: { planned: Number, spent: { type: Number, default: 0 }, currency: { type: String, default: 'TND' } },
    timeline: { startDate: Date, endDate: Date, actualEndDate: Date },
    milestones: [{ title: String, dueDate: Date, status: { type: String, enum: ['pending', 'in_progress', 'completed'], default: 'pending' }, completedAt: Date }],
    progress: { type: Number, min: 0, max: 100, default: 0 },
    beneficiaries: { target: Number, reached: Number, description: String },
    location: { city: String, governorate: { type: String, default: 'Tozeur' }, areas: [String] },
    images: [{ url: String, caption: String, isMain: Boolean }],
    documents: [{ name: String, url: String, type: String }],
    updates: [{ title: String, content: String, author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, date: { type: Date, default: Date.now } }],
    isPublic: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false }
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

projectSchema.virtual('teamCount').get(function () { return this.team?.length || 0; });
projectSchema.virtual('daysRemaining').get(function () {
    if (!this.timeline?.endDate) return null;
    return Math.max(0, Math.ceil((new Date(this.timeline.endDate) - new Date()) / (1000 * 60 * 60 * 24)));
});

projectSchema.index({ status: 1, isFeatured: -1 });
projectSchema.index({ category: 1 });

projectSchema.methods.addTeamMember = async function (userId, role) {
    if (this.team.find(m => m.user.toString() === userId.toString())) throw new Error('Déjà membre');
    this.team.push({ user: userId, role });
    return this.save();
};

projectSchema.methods.updateProgress = async function () {
    if (!this.milestones?.length) return;
    const completed = this.milestones.filter(m => m.status === 'completed').length;
    this.progress = Math.round((completed / this.milestones.length) * 100);
    return this.save();
};

module.exports = mongoose.model('Project', projectSchema);
