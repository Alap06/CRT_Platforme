const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middlewares/authMiddleware');
const donationController = require('../controllers/donationController');

router.get('/recent', donationController.getRecentDonations);
router.post('/', donationController.createDonation);
router.use(protect);
router.get('/my-donations', donationController.getMyDonations);
router.get('/', restrictTo('admin'), donationController.getDonations);
router.get('/statistics', restrictTo('admin'), donationController.getStatistics);
router.get('/:id', restrictTo('admin'), donationController.getDonation);
router.put('/:id', restrictTo('admin'), donationController.updateDonation);
router.delete('/:id', restrictTo('admin'), donationController.deleteDonation);
router.patch('/:id/confirm', restrictTo('admin'), donationController.confirmDonation);

module.exports = router;
