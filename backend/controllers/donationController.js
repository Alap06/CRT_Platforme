const Donation = require('../models/Donation');

exports.getDonations = async (req, res) => {
    try {
        const { page = 1, limit = 10, type, status } = req.query;
        const filter = {};
        if (type) filter.type = type;
        if (status) filter.status = status;
        const total = await Donation.countDocuments(filter);
        const donations = await Donation.find(filter).sort({ date: -1 }).skip((page - 1) * limit).limit(parseInt(limit))
            .populate('donor', 'firstName lastName email').populate('committee', 'name');
        res.json({ success: true, data: donations, pagination: { total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(total / limit) } });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Erreur' });
    }
};

exports.getDonation = async (req, res) => {
    try {
        const donation = await Donation.findById(req.params.id).populate('donor', 'firstName lastName email phone').populate('receivedBy', 'firstName lastName');
        if (!donation) return res.status(404).json({ success: false, message: 'Donation non trouvée' });
        res.json({ success: true, data: donation });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Erreur' });
    }
};

exports.createDonation = async (req, res) => {
    try {
        const donationData = { ...req.body };
        if (req.user) donationData.donor = req.user.id;
        const donation = await Donation.create(donationData);
        res.status(201).json({ success: true, message: 'Donation enregistrée', data: donation });
    } catch (err) {
        if (err.name === 'ValidationError') return res.status(400).json({ success: false, errors: Object.values(err.errors).map(e => e.message) });
        res.status(500).json({ success: false, message: 'Erreur' });
    }
};

exports.updateDonation = async (req, res) => {
    try {
        const donation = await Donation.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!donation) return res.status(404).json({ success: false, message: 'Donation non trouvée' });
        res.json({ success: true, data: donation });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Erreur' });
    }
};

exports.deleteDonation = async (req, res) => {
    try {
        const donation = await Donation.findByIdAndDelete(req.params.id);
        if (!donation) return res.status(404).json({ success: false, message: 'Donation non trouvée' });
        res.json({ success: true, message: 'Donation supprimée' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Erreur' });
    }
};

exports.confirmDonation = async (req, res) => {
    try {
        const donation = await Donation.findById(req.params.id);
        if (!donation) return res.status(404).json({ success: false, message: 'Donation non trouvée' });
        donation.status = 'received';
        donation.receivedBy = req.user.id;
        donation.receivedAt = new Date();
        await donation.save();
        res.json({ success: true, message: 'Donation confirmée', data: donation });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Erreur' });
    }
};

exports.getStatistics = async (req, res) => {
    try {
        const stats = await Donation.getStatistics(req.query);
        res.json({ success: true, data: stats });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Erreur' });
    }
};

exports.getMyDonations = async (req, res) => {
    try {
        const donations = await Donation.find({ donor: req.user.id }).sort({ date: -1 });
        const totalDonated = donations.filter(d => d.type === 'money' && d.status === 'received').reduce((sum, d) => sum + d.amount, 0);
        res.json({ success: true, data: donations, summary: { count: donations.length, totalDonated } });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Erreur' });
    }
};

exports.getRecentDonations = async (req, res) => {
    try {
        const donations = await Donation.find({ status: 'received' }).sort({ date: -1 }).limit(parseInt(req.query.limit) || 10)
            .select('amount type date donor').populate('donor', 'firstName lastName');
        res.json({ success: true, data: donations });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Erreur' });
    }
};
