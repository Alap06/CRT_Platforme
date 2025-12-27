const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middlewares/authMiddleware');
const contactController = require('../controllers/contactController');

router.post('/', contactController.createContact);
router.use(protect);
router.use(restrictTo('admin'));
router.get('/', contactController.getContacts);
router.get('/statistics', contactController.getStatistics);
router.get('/:id', contactController.getContact);
router.put('/:id', contactController.updateContact);
router.delete('/:id', contactController.deleteContact);
router.patch('/:id/read', contactController.markAsRead);
router.post('/:id/reply', contactController.addReply);
router.patch('/:id/assign', contactController.assignContact);
router.patch('/:id/close', contactController.closeContact);

module.exports = router;
