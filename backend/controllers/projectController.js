const Project = require('../models/Project');

exports.getProjects = async (req, res) => {
    try {
        const { page = 1, limit = 10, status, category, featured, search } = req.query;
        const filter = {};
        if (status) filter.status = status;
        if (category) filter.category = category;
        if (featured === 'true') filter.isFeatured = true;
        if (search) filter.$or = [{ title: { $regex: search, $options: 'i' } }];
        if (!req.user || req.user.role !== 'admin') filter.isPublic = true;

        const total = await Project.countDocuments(filter);
        const projects = await Project.find(filter).sort({ isFeatured: -1, createdAt: -1 }).skip((page - 1) * limit).limit(parseInt(limit))
            .populate('manager', 'firstName lastName email').populate('committee', 'name');
        res.json({ success: true, data: projects, pagination: { total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(total / limit) } });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Erreur' });
    }
};

exports.getProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id).populate('manager', 'firstName lastName email phone')
            .populate('team.user', 'firstName lastName email').populate('updates.author', 'firstName lastName').populate('committee', 'name governorate');
        if (!project) return res.status(404).json({ success: false, message: 'Projet non trouvé' });
        res.json({ success: true, data: project });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Erreur' });
    }
};

exports.createProject = async (req, res) => {
    try {
        const project = await Project.create({ ...req.body, manager: req.body.manager || req.user.id });
        res.status(201).json({ success: true, message: 'Projet créé', data: project });
    } catch (err) {
        if (err.name === 'ValidationError') return res.status(400).json({ success: false, errors: Object.values(err.errors).map(e => e.message) });
        res.status(500).json({ success: false, message: 'Erreur' });
    }
};

exports.updateProject = async (req, res) => {
    try {
        let project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ success: false, message: 'Projet non trouvé' });
        if (project.manager.toString() !== req.user.id && req.user.role !== 'admin') return res.status(403).json({ success: false, message: 'Non autorisé' });
        project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        res.json({ success: true, data: project });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Erreur' });
    }
};

exports.deleteProject = async (req, res) => {
    try {
        const project = await Project.findByIdAndDelete(req.params.id);
        if (!project) return res.status(404).json({ success: false, message: 'Projet non trouvé' });
        res.json({ success: true, message: 'Projet supprimé' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Erreur' });
    }
};

exports.addTeamMember = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ success: false, message: 'Projet non trouvé' });
        await project.addTeamMember(req.body.userId, req.body.role);
        res.json({ success: true, message: 'Membre ajouté' });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message || 'Erreur' });
    }
};

exports.removeTeamMember = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ success: false, message: 'Projet non trouvé' });
        project.team = project.team.filter(m => m.user.toString() !== req.params.userId);
        await project.save();
        res.json({ success: true, message: 'Membre retiré' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Erreur' });
    }
};

exports.addUpdate = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ success: false, message: 'Projet non trouvé' });
        project.updates.push({ title: req.body.title, content: req.body.content, author: req.user.id });
        await project.save();
        res.json({ success: true, message: 'Mise à jour ajoutée' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Erreur' });
    }
};

exports.updateProgress = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ success: false, message: 'Projet non trouvé' });
        if (req.body.progress !== undefined) project.progress = req.body.progress;
        else await project.updateProgress();
        await project.save();
        res.json({ success: true, message: 'Progression mise à jour', data: { progress: project.progress } });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Erreur' });
    }
};

exports.getFeaturedProjects = async (req, res) => {
    try {
        const projects = await Project.find({ isFeatured: true, isPublic: true, status: { $in: ['active', 'completed'] } })
            .sort({ createdAt: -1 }).limit(parseInt(req.query.limit) || 6).populate('manager', 'firstName lastName').populate('committee', 'name');
        res.json({ success: true, data: projects });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Erreur' });
    }
};

exports.getMyProjects = async (req, res) => {
    try {
        const projects = await Project.find({ $or: [{ manager: req.user.id }, { 'team.user': req.user.id }] }).sort({ createdAt: -1 })
            .populate('manager', 'firstName lastName').populate('committee', 'name');
        res.json({ success: true, data: projects });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Erreur' });
    }
};
