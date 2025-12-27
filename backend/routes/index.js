const express = require('express');
const router = express.Router();

// Import des routeurs
const authRoutes = require('./authRoutes');
const adminRoutes = require('./adminRoutes');
const activityRoutes = require('./activityRoutes');
const donationRoutes = require('./donationRoutes');
const projectRoutes = require('./projectRoutes');
const committeeRoutes = require('./committeeRoutes');
const newsRoutes = require('./newsRoutes');
const contactRoutes = require('./contactRoutes');
const statsRoutes = require('./statsRoutes');

// Montage des routeurs sur les chemins appropriés
router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);
router.use('/activities', activityRoutes);
router.use('/donations', donationRoutes);
router.use('/projects', projectRoutes);
router.use('/committees', committeeRoutes);
router.use('/news', newsRoutes);
router.use('/contacts', contactRoutes);
router.use('/stats', statsRoutes);

module.exports = router;