const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middlewares/authMiddleware');
const activityController = require('../controllers/activityController');

router.get('/upcoming', activityController.getUpcomingActivities);
router.get('/', activityController.getActivities);
router.get('/:id', activityController.getActivity);

router.use(protect);
router.get('/user/my-activities', activityController.getMyActivities);
router.post('/:id/register', activityController.registerVolunteer);
router.delete('/:id/register', activityController.unregisterVolunteer);
router.post('/', restrictTo('admin', 'benevole'), activityController.createActivity);
router.put('/:id', restrictTo('admin', 'benevole'), activityController.updateActivity);
router.delete('/:id', restrictTo('admin'), activityController.deleteActivity);
router.patch('/:id/volunteers/:volunteerId', restrictTo('admin', 'benevole'), activityController.updateVolunteerStatus);

module.exports = router;
