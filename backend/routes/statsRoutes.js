const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middlewares/authMiddleware');
const statsController = require('../controllers/statsController');

router.use(protect);
router.use(restrictTo('admin'));
router.get('/dashboard', statsController.getDashboardStats);
router.get('/activities', statsController.getActivityStats);
router.get('/donations', statsController.getDonationStats);
router.get('/volunteers', statsController.getVolunteerStats);
router.get('/projects', statsController.getProjectStats);

module.exports = router;
