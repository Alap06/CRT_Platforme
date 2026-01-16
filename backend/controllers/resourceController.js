const Resource = require('../models/Resource');
const { getFileUrl, deleteFile } = require('../middlewares/uploadMiddleware');

// Get all resources with filters
exports.getResources = async (req, res) => {
    try {
        const { page = 1, limit = 20, type, status, search, committee, lowStock } = req.query;
        const filter = {};

        if (type) filter.type = type;
        if (status) filter.status = status;
        if (committee) filter['location.committee'] = committee;
        if (lowStock === 'true') filter.status = { $in: ['low', 'out_of_stock'] };
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        const total = await Resource.countDocuments(filter);
        const resources = await Resource.find(filter)
            .sort({ status: 1, name: 1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .populate('location.committee', 'name')
            .populate('createdBy', 'firstName lastName');

        res.json({
            success: true,
            data: resources,
            pagination: { total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(total / limit) }
        });
    } catch (err) {
        console.error('getResources error:', err);
        res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
};

// Get single resource
exports.getResource = async (req, res) => {
    try {
        const resource = await Resource.findById(req.params.id)
            .populate('location.committee', 'name')
            .populate('movements.performedBy', 'firstName lastName')
            .populate('createdBy', 'firstName lastName');

        if (!resource) {
            return res.status(404).json({ success: false, message: 'Ressource non trouvée' });
        }
        res.json({ success: true, data: resource });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
};

// Create resource
exports.createResource = async (req, res) => {
    try {
        const resourceData = { ...req.body, createdBy: req.user.id };

        // Handle uploaded images
        if (req.files && req.files.length > 0) {
            resourceData.images = req.files.map(file => ({
                url: getFileUrl(file.filename, 'resources'),
                caption: ''
            }));
        } else if (req.file) {
            resourceData.images = [{ url: getFileUrl(req.file.filename, 'resources'), caption: '' }];
        }

        const resource = await Resource.create(resourceData);
        res.status(201).json({ success: true, message: 'Ressource créée', data: resource });
    } catch (err) {
        console.error('createResource error:', err);
        if (err.name === 'ValidationError') {
            return res.status(400).json({ success: false, errors: Object.values(err.errors).map(e => e.message) });
        }
        res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
};

// Update resource
exports.updateResource = async (req, res) => {
    try {
        const updateData = { ...req.body, updatedBy: req.user.id };

        // Handle new uploaded images
        if (req.files && req.files.length > 0) {
            const newImages = req.files.map(file => ({
                url: getFileUrl(file.filename, 'resources'),
                caption: ''
            }));
            // Append to existing images or replace
            if (req.body.appendImages === 'true') {
                const existing = await Resource.findById(req.params.id);
                updateData.images = [...(existing?.images || []), ...newImages];
            } else {
                updateData.images = newImages;
            }
        }

        const resource = await Resource.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
        if (!resource) {
            return res.status(404).json({ success: false, message: 'Ressource non trouvée' });
        }
        res.json({ success: true, data: resource });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
};

// Delete resource
exports.deleteResource = async (req, res) => {
    try {
        const resource = await Resource.findById(req.params.id);
        if (!resource) {
            return res.status(404).json({ success: false, message: 'Ressource non trouvée' });
        }

        // Delete associated images
        if (resource.images && resource.images.length > 0) {
            resource.images.forEach(img => {
                if (img.url) deleteFile(img.url);
            });
        }

        await Resource.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Ressource supprimée' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
};

// Add stock movement
exports.addMovement = async (req, res) => {
    try {
        const { type, quantity, reason, reference, referenceType, notes } = req.body;
        const resource = await Resource.findById(req.params.id);

        if (!resource) {
            return res.status(404).json({ success: false, message: 'Ressource non trouvée' });
        }

        if (type === 'in') {
            await resource.addStock(quantity, req.user.id, reason, notes);
        } else if (type === 'out') {
            await resource.removeStock(quantity, req.user.id, reason, reference, referenceType, notes);
        } else {
            // Adjustment
            resource.movements.push({
                type: 'adjustment',
                quantity,
                reason,
                performedBy: req.user.id,
                notes
            });
            resource.quantity = quantity;
            await resource.save();
        }

        res.json({ success: true, message: 'Mouvement enregistré', data: resource });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// Get low stock alerts
exports.getLowStockAlerts = async (req, res) => {
    try {
        const alerts = await Resource.getLowStockAlerts(req.query.committee);
        res.json({ success: true, data: alerts });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
};

// Get statistics
exports.getStatistics = async (req, res) => {
    try {
        const stats = await Resource.getStatistics(req.query.committee);
        const total = await Resource.countDocuments();
        const lowStock = await Resource.countDocuments({ status: { $in: ['low', 'out_of_stock'] } });

        res.json({
            success: true,
            data: {
                byType: stats,
                total,
                lowStock,
                criticalCount: await Resource.countDocuments({ status: 'out_of_stock' })
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
};

// Upload images to existing resource
exports.uploadImages = async (req, res) => {
    try {
        const resource = await Resource.findById(req.params.id);
        if (!resource) {
            return res.status(404).json({ success: false, message: 'Ressource non trouvée' });
        }

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ success: false, message: 'Aucune image fournie' });
        }

        const newImages = req.files.map(file => ({
            url: getFileUrl(file.filename, 'resources'),
            caption: ''
        }));

        resource.images = [...(resource.images || []), ...newImages];
        await resource.save();

        res.json({ success: true, message: 'Images ajoutées', data: resource });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
};

// Delete image from resource
exports.deleteImage = async (req, res) => {
    try {
        const resource = await Resource.findById(req.params.id);
        if (!resource) {
            return res.status(404).json({ success: false, message: 'Ressource non trouvée' });
        }

        const imageIndex = resource.images.findIndex(img => img._id.toString() === req.params.imageId);
        if (imageIndex === -1) {
            return res.status(404).json({ success: false, message: 'Image non trouvée' });
        }

        // Delete file
        deleteFile(resource.images[imageIndex].url);
        resource.images.splice(imageIndex, 1);
        await resource.save();

        res.json({ success: true, message: 'Image supprimée', data: resource });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
};
