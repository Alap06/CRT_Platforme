const Contact = require('../models/Contact');

exports.getContacts = async (req, res) => {
    try {
        const { page = 1, limit = 10, status, category } = req.query;
        const filter = {};
        if (status) filter.status = status;
        if (category) filter.category = category;
        const total = await Contact.countDocuments(filter);
        const contacts = await Contact.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(parseInt(limit)).populate('assignedTo', 'firstName lastName');
        res.json({ success: true, data: contacts, pagination: { total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(total / limit) } });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Erreur' });
    }
};

exports.getContact = async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id).populate('assignedTo readBy closedBy', 'firstName lastName').populate('replies.author', 'firstName lastName');
        if (!contact) return res.status(404).json({ success: false, message: 'Message non trouvé' });
        res.json({ success: true, data: contact });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Erreur' });
    }
};

exports.createContact = async (req, res) => {
    try {
        const contact = await Contact.create({ ...req.body, ipAddress: req.ip, userAgent: req.get('User-Agent') });
        res.status(201).json({ success: true, message: 'Message envoyé', data: { id: contact._id } });
    } catch (err) {
        if (err.name === 'ValidationError') return res.status(400).json({ success: false, errors: Object.values(err.errors).map(e => e.message) });
        res.status(500).json({ success: false, message: 'Erreur' });
    }
};

exports.updateContact = async (req, res) => {
    try {
        const contact = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!contact) return res.status(404).json({ success: false, message: 'Message non trouvé' });
        res.json({ success: true, data: contact });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Erreur' });
    }
};

exports.deleteContact = async (req, res) => {
    try {
        const contact = await Contact.findByIdAndDelete(req.params.id);
        if (!contact) return res.status(404).json({ success: false, message: 'Message non trouvé' });
        res.json({ success: true, message: 'Message supprimé' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Erreur' });
    }
};

exports.markAsRead = async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);
        if (!contact) return res.status(404).json({ success: false, message: 'Message non trouvé' });
        await contact.markAsRead(req.user.id);
        res.json({ success: true, message: 'Marqué comme lu' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Erreur' });
    }
};

exports.addReply = async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);
        if (!contact) return res.status(404).json({ success: false, message: 'Message non trouvé' });
        await contact.addReply(req.body.content, req.user.id, req.body.sendEmail);
        res.json({ success: true, message: 'Réponse ajoutée' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Erreur' });
    }
};

exports.assignContact = async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);
        if (!contact) return res.status(404).json({ success: false, message: 'Message non trouvé' });
        contact.assignedTo = req.body.userId;
        await contact.save();
        res.json({ success: true, message: 'Assigné' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Erreur' });
    }
};

exports.closeContact = async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);
        if (!contact) return res.status(404).json({ success: false, message: 'Message non trouvé' });
        await contact.close(req.user.id);
        res.json({ success: true, message: 'Fermé' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Erreur' });
    }
};

exports.getStatistics = async (req, res) => {
    try {
        const stats = await Contact.getStatistics(req.query);
        res.json({ success: true, data: stats });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Erreur' });
    }
};
