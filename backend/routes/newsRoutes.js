const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middlewares/authMiddleware');
const newsController = require('../controllers/newsController');

router.get('/featured', newsController.getFeaturedNews);
router.get('/recent', newsController.getRecentNews);
router.get('/', newsController.getNews);
router.get('/:id', newsController.getNewsArticle);
router.use(protect);
router.use(restrictTo('admin'));
router.post('/', newsController.createNews);
router.put('/:id', newsController.updateNews);
router.delete('/:id', newsController.deleteNews);
router.patch('/:id/publish', newsController.publishNews);

module.exports = router;
