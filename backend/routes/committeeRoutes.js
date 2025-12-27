const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middlewares/authMiddleware');
const committeeController = require('../controllers/committeeController');

router.get('/hierarchy', committeeController.getHierarchy);
router.get('/regional', committeeController.getRegionalCommittees);
router.get('/', committeeController.getCommittees);
router.get('/:id', committeeController.getCommittee);
router.get('/:id/local', committeeController.getLocalCommittees);
router.use(protect);
router.use(restrictTo('admin'));
router.post('/', committeeController.createCommittee);
router.put('/:id', committeeController.updateCommittee);
router.delete('/:id', committeeController.deleteCommittee);
router.post('/:id/members', committeeController.addMember);
router.delete('/:id/members/:userId', committeeController.removeMember);
router.patch('/:id/members/:userId', committeeController.updateMemberRole);
router.get('/:id/statistics', committeeController.getCommitteeStatistics);

module.exports = router;
