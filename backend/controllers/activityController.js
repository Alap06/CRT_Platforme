const Activity = require('../models/Activity');

exports.getActivities = async (req, res) => {
    try {
        const { page = 1, limit = 10, type, status, search } = req.query;
        const filter = {};
        if (type) filter.type = type;
        if (status) filter.status = status;
        if (search) filter.$or = [{ title: { $regex: search, $options: 'i' } }, { description: { $regex: search, $options: 'i' } }];

        const total = await Activity.countDocuments(filter);
        const activities = await Activity.find(filter).sort({ date: -1 }).skip((page - 1) * limit).limit(parseInt(limit))
            .populate('organizer', 'firstName lastName email').populate('committee', 'name');

        res.json({ success: true, data: activities, pagination: { total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(total / limit) } });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Erreur lors de la récupération des activités' });
    }
};

exports.getActivity = async (req, res) => {
    try {
        const activity = await Activity.findById(req.params.id).populate('organizer', 'firstName lastName email phone')
            .populate('volunteers.user', 'firstName lastName email').populate('committee', 'name governorate');
        if (!activity) return res.status(404).json({ success: false, message: 'Activité non trouvée' });
        res.json({ success: true, data: activity });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Erreur' });
    }
};

exports.createActivity = async (req, res) => {
    try {
        const activity = await Activity.create({ ...req.body, organizer: req.user.id });
        res.status(201).json({ success: true, message: 'Activité créée', data: activity });
    } catch (err) {
        if (err.name === 'ValidationError') return res.status(400).json({ success: false, errors: Object.values(err.errors).map(e => e.message) });
        res.status(500).json({ success: false, message: 'Erreur' });
    }
};

exports.updateActivity = async (req, res) => {
    try {
        let activity = await Activity.findById(req.params.id);
        if (!activity) return res.status(404).json({ success: false, message: 'Activité non trouvée' });
        if (activity.organizer.toString() !== req.user.id && req.user.role !== 'admin') return res.status(403).json({ success: false, message: 'Non autorisé' });
        activity = await Activity.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        res.json({ success: true, data: activity });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Erreur' });
    }
};

exports.deleteActivity = async (req, res) => {
    try {
        const activity = await Activity.findById(req.params.id);
        if (!activity) return res.status(404).json({ success: false, message: 'Activité non trouvée' });
        await activity.deleteOne();
        res.json({ success: true, message: 'Activité supprimée' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Erreur' });
    }
};

exports.registerVolunteer = async (req, res) => {
    try {
        const activity = await Activity.findById(req.params.id);
        if (!activity) return res.status(404).json({ success: false, message: 'Activité non trouvée' });
        await activity.registerVolunteer(req.user.id);
        res.json({ success: true, message: 'Inscription réussie' });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message || 'Erreur' });
    }
};

exports.unregisterVolunteer = async (req, res) => {
    try {
        const activity = await Activity.findById(req.params.id);
        if (!activity) return res.status(404).json({ success: false, message: 'Activité non trouvée' });
        await activity.unregisterVolunteer(req.user.id);
        res.json({ success: true, message: 'Désinscription réussie' });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message || 'Erreur' });
    }
};

exports.updateVolunteerStatus = async (req, res) => {
    try {
        const activity = await Activity.findById(req.params.id);
        if (!activity) return res.status(404).json({ success: false, message: 'Activité non trouvée' });
        const volunteer = activity.volunteers.find(v => v.user.toString() === req.params.volunteerId);
        if (!volunteer) return res.status(404).json({ success: false, message: 'Bénévole non trouvé' });
        volunteer.status = req.body.status;
        await activity.save();
        res.json({ success: true, message: 'Statut mis à jour' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Erreur' });
    }
};

exports.getUpcomingActivities = async (req, res) => {
    try {
        const activities = await Activity.find({ date: { $gte: new Date() }, status: { $in: ['planned', 'ongoing'] }, isPublic: true })
            .sort({ date: 1 }).limit(parseInt(req.query.limit) || 5).populate('organizer', 'firstName lastName').populate('committee', 'name');
        res.json({ success: true, data: activities });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Erreur' });
    }
};

exports.getMyActivities = async (req, res) => {
    try {
        const activities = await Activity.find({ 'volunteers.user': req.user.id }).sort({ date: -1 }).populate('organizer', 'firstName lastName').populate('committee', 'name');
        res.json({ success: true, data: activities });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Erreur' });
    }
};
