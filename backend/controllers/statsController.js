const User = require('../models/User');
const Activity = require('../models/Activity');
const Donation = require('../models/Donation');
const Project = require('../models/Project');
const Committee = require('../models/Committee');
const Contact = require('../models/Contact');

exports.getDashboardStats = async (req, res) => {
    try {
        const [totalUsers, pendingUsers, activeVolunteers, totalActivities, upcomingActivities, totalDonations, donationStats, activeProjects, totalCommittees, pendingContacts] = await Promise.all([
            User.countDocuments(),
            User.countDocuments({ status: 'pending' }),
            User.countDocuments({ status: 'approved', role: 'benevole' }),
            Activity.countDocuments(),
            Activity.countDocuments({ date: { $gte: new Date() }, status: 'planned' }),
            Donation.countDocuments({ status: 'received' }),
            Donation.aggregate([{ $match: { status: 'received', type: 'money' } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
            Project.countDocuments({ status: 'active' }),
            Committee.countDocuments({ status: 'active' }),
            Contact.countDocuments({ status: 'new' })
        ]);

        res.json({
            success: true,
            data: {
                users: { total: totalUsers, pending: pendingUsers, activeVolunteers },
                activities: { total: totalActivities, upcoming: upcomingActivities },
                donations: { total: totalDonations, amount: donationStats[0]?.total || 0 },
                projects: { active: activeProjects },
                committees: { total: totalCommittees },
                contacts: { pending: pendingContacts }
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Erreur' });
    }
};

exports.getActivityStats = async (req, res) => {
    try {
        const byType = await Activity.aggregate([{ $group: { _id: '$type', count: { $sum: 1 } } }]);
        const byStatus = await Activity.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]);
        res.json({ success: true, data: { byType, byStatus } });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Erreur' });
    }
};

exports.getDonationStats = async (req, res) => {
    try {
        const stats = await Donation.getStatistics(req.query);
        res.json({ success: true, data: stats });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Erreur' });
    }
};

exports.getVolunteerStats = async (req, res) => {
    try {
        const byStatus = await User.aggregate([{ $match: { role: 'benevole' } }, { $group: { _id: '$status', count: { $sum: 1 } } }]);
        res.json({ success: true, data: { byStatus } });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Erreur' });
    }
};

exports.getProjectStats = async (req, res) => {
    try {
        const byStatus = await Project.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]);
        const byCategory = await Project.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }]);
        res.json({ success: true, data: { byStatus, byCategory } });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Erreur' });
    }
};
