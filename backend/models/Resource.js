const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Le nom de la ressource est requis'],
        trim: true
    },
    type: {
        type: String,
        enum: ['medical', 'money', 'clothing', 'food', 'vehicle', 'equipment', 'other'],
        required: true
    },
    category: { type: String, trim: true },
    description: { type: String },
    quantity: { type: Number, required: true, min: 0, default: 0 },
    unit: { type: String, default: 'unité' },
    alertThreshold: { type: Number, min: 0, default: 10 },
    status: {
        type: String,
        enum: ['available', 'low', 'out_of_stock', 'reserved'],
        default: 'available'
    },
    value: { type: Number, min: 0 },
    currency: { type: String, default: 'TND' },
    images: [{
        url: String,
        caption: String,
        uploadedAt: { type: Date, default: Date.now }
    }],
    location: {
        warehouse: String,
        shelf: String,
        committee: { type: mongoose.Schema.Types.ObjectId, ref: 'Committee' }
    },
    movements: [{
        type: { type: String, enum: ['in', 'out', 'adjustment'], required: true },
        quantity: { type: Number, required: true },
        reason: String,
        reference: String,
        referenceType: { type: String, enum: ['activity', 'project', 'donation', 'other'] },
        performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        date: { type: Date, default: Date.now },
        notes: String
    }],
    expirationDate: Date,
    lastRestocked: Date,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

resourceSchema.virtual('isLow').get(function () {
    return this.quantity <= this.alertThreshold;
});

resourceSchema.virtual('isCritical').get(function () {
    return this.quantity === 0;
});

resourceSchema.pre('save', function (next) {
    if (this.quantity === 0) this.status = 'out_of_stock';
    else if (this.quantity <= this.alertThreshold) this.status = 'low';
    else this.status = 'available';
    next();
});

resourceSchema.index({ type: 1, status: 1 });
resourceSchema.index({ 'location.committee': 1 });

resourceSchema.methods.addStock = async function (quantity, userId, reason, notes) {
    this.movements.push({ type: 'in', quantity, reason, performedBy: userId, notes });
    this.quantity += quantity;
    this.lastRestocked = new Date();
    return this.save();
};

resourceSchema.methods.removeStock = async function (quantity, userId, reason, reference, referenceType, notes) {
    if (quantity > this.quantity) throw new Error('Stock insuffisant');
    this.movements.push({ type: 'out', quantity, reason, reference, referenceType, performedBy: userId, notes });
    this.quantity -= quantity;
    return this.save();
};

resourceSchema.statics.getLowStockAlerts = function (committeeId) {
    const filter = { status: { $in: ['low', 'out_of_stock'] } };
    if (committeeId) filter['location.committee'] = committeeId;
    return this.find(filter).populate('location.committee', 'name').sort({ quantity: 1 });
};

resourceSchema.statics.getStatistics = async function (committeeId) {
    const match = {};
    if (committeeId) match['location.committee'] = new mongoose.Types.ObjectId(committeeId);
    return this.aggregate([
        { $match: match },
        { $group: { _id: '$type', count: { $sum: 1 }, totalQuantity: { $sum: '$quantity' }, lowStock: { $sum: { $cond: [{ $lte: ['$quantity', '$alertThreshold'] }, 1, 0] } } } }
    ]);
};

module.exports = mongoose.model('Resource', resourceSchema);
