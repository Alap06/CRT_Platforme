const mongoose = require('mongoose');

const committeeSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    code: { type: String, unique: true },
    type: { type: String, enum: ['national', 'regional', 'local'], required: true },
    governorate: { type: String, required: true },
    city: { type: String },
    status: { type: String, enum: ['active', 'inactive', 'suspended'], default: 'active' },
    president: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    vicePresident: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    secretary: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    treasurer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    members: [{ user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, role: String, joinedAt: { type: Date, default: Date.now }, status: { type: String, default: 'active' } }],
    parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Committee' },
    children: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Committee' }],
    contact: { address: String, phone: String, email: String, website: String },
    foundedAt: Date,
    description: String
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

committeeSchema.virtual('memberCount').get(function () { return this.members?.length || 0; });

committeeSchema.index({ type: 1, governorate: 1 });

committeeSchema.pre('save', function (next) {
    if (this.isNew && !this.code) {
        const prefix = this.type === 'regional' ? 'CR' : 'CL';
        this.code = `${prefix}-${this.governorate.substring(0, 3).toUpperCase()}-${Date.now().toString().slice(-6)}`;
    }
    next();
});

committeeSchema.methods.addMember = async function (userId, role) {
    if (this.members.find(m => m.user.toString() === userId.toString())) throw new Error('Déjà membre');
    this.members.push({ user: userId, role });
    return this.save();
};

committeeSchema.methods.removeMember = async function (userId) {
    const index = this.members.findIndex(m => m.user.toString() === userId.toString());
    if (index === -1) throw new Error('Non membre');
    this.members.splice(index, 1);
    return this.save();
};

committeeSchema.statics.getHierarchy = async function (governorate) {
    const filter = { type: 'regional' };
    if (governorate) filter.governorate = governorate;
    return this.find(filter).populate('children', 'name city memberCount status').populate('president', 'firstName lastName');
};

module.exports = mongoose.model('Committee', committeeSchema);
