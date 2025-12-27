const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middlewares/authMiddleware');
const projectController = require('../controllers/projectController');

router.get('/featured', projectController.getFeaturedProjects);
router.get('/', projectController.getProjects);
router.get('/:id', projectController.getProject);
router.use(protect);
router.get('/user/my-projects', projectController.getMyProjects);
router.post('/', restrictTo('admin', 'partenaire'), projectController.createProject);
router.put('/:id', restrictTo('admin', 'partenaire'), projectController.updateProject);
router.delete('/:id', restrictTo('admin'), projectController.deleteProject);
router.post('/:id/team', restrictTo('admin', 'partenaire'), projectController.addTeamMember);
router.delete('/:id/team/:userId', restrictTo('admin', 'partenaire'), projectController.removeTeamMember);
router.post('/:id/updates', restrictTo('admin', 'partenaire'), projectController.addUpdate);
router.patch('/:id/progress', restrictTo('admin', 'partenaire'), projectController.updateProgress);

module.exports = router;
