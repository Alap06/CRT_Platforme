const express = require('express');
const router = express.Router();

// Import des routeurs correctement
const authRoutes = require('./authRoutes');
const adminRoutes = require('./adminRoutes');

// Montage des routeurs sur les chemins appropriés
router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);

module.exports = router;