const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middlewares/authMiddleware');
const { uploadMultiple } = require('../middlewares/uploadMiddleware');
const newsController = require('../controllers/newsController');

router.get('/featured', newsController.getFeaturedNews);
router.get('/recent', newsController.getRecentNews);
router.get('/', newsController.getNews);
router.get('/:id', newsController.getNewsArticle);

router.use(protect);
router.use(restrictTo('admin'));

router.post('/', uploadMultiple, newsController.createNews);
router.put('/:id', uploadMultiple, newsController.updateNews);
router.delete('/:id', newsController.deleteNews);
router.patch('/:id/publish', newsController.publishNews);

// Image management
router.post('/:id/images', uploadMultiple, newsController.uploadImages);
router.delete('/:id/images/:imageId', newsController.deleteImage);

module.exports = router;

