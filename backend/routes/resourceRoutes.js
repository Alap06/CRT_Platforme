const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middlewares/authMiddleware');
const { uploadMultiple } = require('../middlewares/uploadMiddleware');
const resourceController = require('../controllers/resourceController');

// Public routes (if any)
router.get('/alerts', protect, resourceController.getLowStockAlerts);
router.get('/statistics', protect, resourceController.getStatistics);

// Protected routes
router.use(protect);

router.get('/', resourceController.getResources);
router.get('/:id', resourceController.getResource);

// Admin only routes
router.use(restrictTo('admin'));

router.post('/', uploadMultiple, resourceController.createResource);
router.put('/:id', uploadMultiple, resourceController.updateResource);
router.delete('/:id', resourceController.deleteResource);

// Stock movements
router.post('/:id/movement', resourceController.addMovement);

// Image management
router.post('/:id/images', uploadMultiple, resourceController.uploadImages);
router.delete('/:id/images/:imageId', resourceController.deleteImage);

module.exports = router;
