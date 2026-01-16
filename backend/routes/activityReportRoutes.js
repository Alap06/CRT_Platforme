const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middlewares/authMiddleware');
const { uploadMultiple } = require('../middlewares/uploadMiddleware');
const reportController = require('../controllers/activityReportController');

// Protected routes
router.use(protect);

// Get reports
router.get('/', reportController.getReports);
router.get('/pending', reportController.getPendingReports);
router.get('/statistics', reportController.getStatistics);
router.get('/activity/:activityId', reportController.getByActivity);
router.get('/:id', reportController.getReport);

// Create and manage reports
router.post('/', uploadMultiple, reportController.createReport);
router.put('/:id', uploadMultiple, reportController.updateReport);
router.delete('/:id', restrictTo('admin'), reportController.deleteReport);

// Workflow actions
router.patch('/:id/submit', reportController.submitReport);
router.patch('/:id/approve', restrictTo('admin'), reportController.approveReport);
router.patch('/:id/reject', restrictTo('admin'), reportController.rejectReport);

// Image management
router.post('/:id/images', uploadMultiple, reportController.uploadImages);
router.delete('/:id/images/:imageId', reportController.deleteImage);

module.exports = router;
