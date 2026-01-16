const ActivityReport = require('../models/ActivityReport');
const Activity = require('../models/Activity');
const { getFileUrl, deleteFile } = require('../middlewares/uploadMiddleware');

// Get all reports with filters
exports.getReports = async (req, res) => {
    try {
        const { page = 1, limit = 20, status, activity, committee, search } = req.query;
        const filter = {};

        if (status) filter.status = status;
        if (activity) filter.activity = activity;
        if (committee) filter.committee = committee;
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { summary: { $regex: search, $options: 'i' } }
            ];
        }

        const total = await ActivityReport.countDocuments(filter);
        const reports = await ActivityReport.find(filter)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .populate('activity', 'title date type')
            .populate('createdBy', 'firstName lastName')
            .populate('committee', 'name');

        res.json({
            success: true,
            data: reports,
            pagination: { total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(total / limit) }
        });
    } catch (err) {
        console.error('getReports error:', err);
        res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
};

// Get single report
exports.getReport = async (req, res) => {
    try {
        const report = await ActivityReport.findById(req.params.id)
            .populate('activity', 'title date type location organizer')
            .populate('createdBy', 'firstName lastName email')
            .populate('approvedBy', 'firstName lastName')
            .populate('volunteers.list', 'firstName lastName')
            .populate('resourcesUsed.resource', 'name type unit')
            .populate('committee', 'name');

        if (!report) {
            return res.status(404).json({ success: false, message: 'Rapport non trouvé' });
        }
        res.json({ success: true, data: report });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
};

// Get report by activity
exports.getByActivity = async (req, res) => {
    try {
        const report = await ActivityReport.getByActivity(req.params.activityId);
        if (!report) {
            return res.status(404).json({ success: false, message: 'Rapport non trouvé pour cette activité' });
        }
        res.json({ success: true, data: report });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
};

// Create report
exports.createReport = async (req, res) => {
    try {
        // Verify activity exists
        const activity = await Activity.findById(req.body.activity);
        if (!activity) {
            return res.status(404).json({ success: false, message: 'Activité non trouvée' });
        }

        // Check if report already exists for this activity
        const existing = await ActivityReport.findOne({ activity: req.body.activity });
        if (existing) {
            return res.status(400).json({ success: false, message: 'Un rapport existe déjà pour cette activité' });
        }

        const reportData = {
            ...req.body,
            createdBy: req.user.id,
            committee: activity.committee
        };

        // Handle uploaded images
        if (req.files && req.files.length > 0) {
            reportData.images = req.files.map(file => ({
                url: getFileUrl(file.filename, 'reports'),
                caption: ''
            }));
        }

        const report = await ActivityReport.create(reportData);
        res.status(201).json({ success: true, message: 'Rapport créé', data: report });
    } catch (err) {
        console.error('createReport error:', err);
        if (err.name === 'ValidationError') {
            return res.status(400).json({ success: false, errors: Object.values(err.errors).map(e => e.message) });
        }
        res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
};

// Update report
exports.updateReport = async (req, res) => {
    try {
        const report = await ActivityReport.findById(req.params.id);
        if (!report) {
            return res.status(404).json({ success: false, message: 'Rapport non trouvé' });
        }

        // Only allow edit on draft or rejected reports
        if (report.status === 'approved') {
            return res.status(400).json({ success: false, message: 'Impossible de modifier un rapport approuvé' });
        }

        const updateData = { ...req.body, updatedBy: req.user.id };

        // Handle new uploaded images
        if (req.files && req.files.length > 0) {
            const newImages = req.files.map(file => ({
                url: getFileUrl(file.filename, 'reports'),
                caption: ''
            }));
            updateData.images = [...(report.images || []), ...newImages];
        }

        const updatedReport = await ActivityReport.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
        res.json({ success: true, data: updatedReport });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
};

// Delete report
exports.deleteReport = async (req, res) => {
    try {
        const report = await ActivityReport.findById(req.params.id);
        if (!report) {
            return res.status(404).json({ success: false, message: 'Rapport non trouvé' });
        }

        // Delete associated images
        if (report.images && report.images.length > 0) {
            report.images.forEach(img => {
                if (img.url) deleteFile(img.url);
            });
        }

        await ActivityReport.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Rapport supprimé' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
};

// Submit report for approval
exports.submitReport = async (req, res) => {
    try {
        const report = await ActivityReport.findById(req.params.id);
        if (!report) {
            return res.status(404).json({ success: false, message: 'Rapport non trouvé' });
        }

        await report.submit();
        res.json({ success: true, message: 'Rapport soumis pour approbation', data: report });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
};

// Approve report
exports.approveReport = async (req, res) => {
    try {
        const report = await ActivityReport.findById(req.params.id);
        if (!report) {
            return res.status(404).json({ success: false, message: 'Rapport non trouvé' });
        }

        await report.approve(req.user.id);
        res.json({ success: true, message: 'Rapport approuvé', data: report });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
};

// Reject report
exports.rejectReport = async (req, res) => {
    try {
        const report = await ActivityReport.findById(req.params.id);
        if (!report) {
            return res.status(404).json({ success: false, message: 'Rapport non trouvé' });
        }

        await report.reject(req.user.id);
        res.json({ success: true, message: 'Rapport rejeté', data: report });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
};

// Get pending reports
exports.getPendingReports = async (req, res) => {
    try {
        const reports = await ActivityReport.getPending(req.query.committee);
        res.json({ success: true, data: reports });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
};

// Upload images to existing report
exports.uploadImages = async (req, res) => {
    try {
        const report = await ActivityReport.findById(req.params.id);
        if (!report) {
            return res.status(404).json({ success: false, message: 'Rapport non trouvé' });
        }

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ success: false, message: 'Aucune image fournie' });
        }

        const newImages = req.files.map(file => ({
            url: getFileUrl(file.filename, 'reports'),
            caption: req.body.caption || ''
        }));

        report.images = [...(report.images || []), ...newImages];
        await report.save();

        res.json({ success: true, message: 'Images ajoutées', data: report });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
};

// Delete image from report
exports.deleteImage = async (req, res) => {
    try {
        const report = await ActivityReport.findById(req.params.id);
        if (!report) {
            return res.status(404).json({ success: false, message: 'Rapport non trouvé' });
        }

        const imageIndex = report.images.findIndex(img => img._id.toString() === req.params.imageId);
        if (imageIndex === -1) {
            return res.status(404).json({ success: false, message: 'Image non trouvée' });
        }

        deleteFile(report.images[imageIndex].url);
        report.images.splice(imageIndex, 1);
        await report.save();

        res.json({ success: true, message: 'Image supprimée', data: report });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
};

// Get statistics
exports.getStatistics = async (req, res) => {
    try {
        const total = await ActivityReport.countDocuments();
        const pending = await ActivityReport.countDocuments({ status: 'submitted' });
        const approved = await ActivityReport.countDocuments({ status: 'approved' });
        const draft = await ActivityReport.countDocuments({ status: 'draft' });

        res.json({
            success: true,
            data: { total, pending, approved, draft }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
};
