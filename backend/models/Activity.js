const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
    title: { type: String, required: [true, 'Le titre est requis'], trim: true, maxlength: 200 },
    description: { type: String, required: [true, 'La description est requise'] },
    type: { type: String, enum: ['formation', 'urgence', 'sante', 'social', 'environnement', 'sensibilisation', 'autre'], required: true },
    status: { type: String, enum: ['planned', 'ongoing', 'completed', 'cancelled'], default: 'planned' },
    date: { type: Date, required: [true, 'La date est requise'] },
    endDate: { type: Date },
    location: {
        address: String,
        city: { type: String, required: true },
        governorate: { type: String, default: 'Tozeur' },
        coordinates: { lat: Number, lng: Number }
    },
    organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    committee: { type: mongoose.Schema.Types.ObjectId, ref: 'Committee' },
    volunteers: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        status: { type: String, enum: ['registered', 'confirmed', 'attended', 'cancelled'], default: 'registered' },
        registeredAt: { type: Date, default: Date.now }
    }],
    maxVolunteers: { type: Number },
    requirements: [String],
    materials: [String],
    images: [{ url: String, caption: String }],
    isPublic: { type: Boolean, default: true },
    beneficiaries: { count: Number, description: String }
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

activitySchema.virtual('volunteersCount').get(function () {
    return this.volunteers?.length || 0;
});

activitySchema.virtual('availableSpots').get(function () {
    if (!this.maxVolunteers) return null;
    return Math.max(0, this.maxVolunteers - (this.volunteers?.length || 0));
});

activitySchema.index({ date: 1, status: 1 });
activitySchema.index({ type: 1 });
activitySchema.index({ 'location.governorate': 1 });

activitySchema.methods.registerVolunteer = async function (userId) {
    const existing = this.volunteers.find(v => v.user.toString() === userId.toString());
    if (existing) throw new Error('Déjà inscrit');
    if (this.maxVolunteers && this.volunteers.length >= this.maxVolunteers) throw new Error('Activité complète');
    this.volunteers.push({ user: userId });
    return this.save();
};

activitySchema.methods.unregisterVolunteer = async function (userId) {
    const index = this.volunteers.findIndex(v => v.user.toString() === userId.toString());
    if (index === -1) throw new Error('Non inscrit');
    this.volunteers.splice(index, 1);
    return this.save();
};

module.exports = mongoose.model('Activity', activitySchema);
