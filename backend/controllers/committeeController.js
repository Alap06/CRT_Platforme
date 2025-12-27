const Committee = require('../models/Committee');

exports.getCommittees = async (req, res) => {
    try {
        const { page = 1, limit = 10, type, governorate, search } = req.query;
        const filter = {};
        if (type) filter.type = type;
        if (governorate) filter.governorate = governorate;
        if (search) filter.$or = [{ name: { $regex: search, $options: 'i' } }, { city: { $regex: search, $options: 'i' } }];
        const total = await Committee.countDocuments(filter);
        const committees = await Committee.find(filter).sort({ type: 1, name: 1 }).skip((page - 1) * limit).limit(parseInt(limit))
            .populate('president', 'firstName lastName email').populate('parent', 'name');
        res.json({ success: true, data: committees, pagination: { total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(total / limit) } });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Erreur' });
    }
};

exports.getCommittee = async (req, res) => {
    try {
        const committee = await Committee.findById(req.params.id).populate('president vicePresident secretary treasurer', 'firstName lastName email')
            .populate('members.user', 'firstName lastName email role').populate('parent', 'name governorate').populate('children', 'name city status memberCount');
        if (!committee) return res.status(404).json({ success: false, message: 'Comité non trouvé' });
        res.json({ success: true, data: committee });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Erreur' });
    }
};

exports.createCommittee = async (req, res) => {
    try {
        const committee = await Committee.create(req.body);
        if (committee.parent) await Committee.findByIdAndUpdate(committee.parent, { $push: { children: committee._id } });
        res.status(201).json({ success: true, message: 'Comité créé', data: committee });
    } catch (err) {
        if (err.code === 11000) return res.status(400).json({ success: false, message: 'Un comité avec ce code existe déjà' });
        if (err.name === 'ValidationError') return res.status(400).json({ success: false, errors: Object.values(err.errors).map(e => e.message) });
        res.status(500).json({ success: false, message: 'Erreur' });
    }
};

exports.updateCommittee = async (req, res) => {
    try {
        const committee = await Committee.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!committee) return res.status(404).json({ success: false, message: 'Comité non trouvé' });
        res.json({ success: true, data: committee });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Erreur' });
    }
};

exports.deleteCommittee = async (req, res) => {
    try {
        const committee = await Committee.findById(req.params.id);
        if (!committee) return res.status(404).json({ success: false, message: 'Comité non trouvé' });
        if (committee.children?.length > 0) return res.status(400).json({ success: false, message: 'Impossible de supprimer un comité avec des sous-comités' });
        if (committee.parent) await Committee.findByIdAndUpdate(committee.parent, { $pull: { children: committee._id } });
        await committee.deleteOne();
        res.json({ success: true, message: 'Comité supprimé' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Erreur' });
    }
};

exports.addMember = async (req, res) => {
    try {
        const committee = await Committee.findById(req.params.id);
        if (!committee) return res.status(404).json({ success: false, message: 'Comité non trouvé' });
        await committee.addMember(req.body.userId, req.body.role);
        res.json({ success: true, message: 'Membre ajouté' });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message || 'Erreur' });
    }
};

exports.removeMember = async (req, res) => {
    try {
        const committee = await Committee.findById(req.params.id);
        if (!committee) return res.status(404).json({ success: false, message: 'Comité non trouvé' });
        await committee.removeMember(req.params.userId);
        res.json({ success: true, message: 'Membre retiré' });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message || 'Erreur' });
    }
};

exports.updateMemberRole = async (req, res) => {
    try {
        const committee = await Committee.findById(req.params.id);
        if (!committee) return res.status(404).json({ success: false, message: 'Comité non trouvé' });
        const member = committee.members.find(m => m.user.toString() === req.params.userId);
        if (!member) return res.status(404).json({ success: false, message: 'Membre non trouvé' });
        member.role = req.body.role;
        await committee.save();
        res.json({ success: true, message: 'Rôle mis à jour' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Erreur' });
    }
};

exports.getHierarchy = async (req, res) => {
    try {
        const hierarchy = await Committee.getHierarchy(req.query.governorate);
        res.json({ success: true, data: hierarchy });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Erreur' });
    }
};

exports.getRegionalCommittees = async (req, res) => {
    try {
        const committees = await Committee.find({ type: 'regional', status: 'active' }).sort({ governorate: 1 })
            .populate('president', 'firstName lastName').select('name governorate city memberCount contact');
        res.json({ success: true, data: committees });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Erreur' });
    }
};

exports.getLocalCommittees = async (req, res) => {
    try {
        const committees = await Committee.find({ parent: req.params.id, type: 'local', status: 'active' }).sort({ city: 1 })
            .populate('president', 'firstName lastName').select('name city memberCount contact');
        res.json({ success: true, data: committees });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Erreur' });
    }
};

exports.getCommitteeStatistics = async (req, res) => {
    try {
        const committee = await Committee.findById(req.params.id);
        if (!committee) return res.status(404).json({ success: false, message: 'Comité non trouvé' });
        res.json({ success: true, data: { members: committee.memberCount } });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Erreur' });
    }
};
