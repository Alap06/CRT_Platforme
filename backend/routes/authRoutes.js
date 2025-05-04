const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');
const { check } = require('express-validator');

// Validation middleware
const validate = validations => [
  ...validations,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

// Routes
router.post('/register', [
  check('firstName').notEmpty().trim(),
  check('lastName').notEmpty().trim(),
  check('email').isEmail().normalizeEmail(),
  check('phone').isMobilePhone(),
  check('cin').isLength({ min: 8, max: 8 }),
  check('password').isLength({ min: 6 }),
  check('confirmPassword').custom((value, { req }) => value === req.body.password)
], authController.register);

router.post('/login', [
  check('email').isEmail().normalizeEmail(),
  check('password').exists()
], authController.login);

router.get('/user', authMiddleware.protect, authController.getUser);
router.post('/logout', authMiddleware.protect, authController.logout);
router.post('/refresh-token', authController.refreshToken);

router.post('/forgot-password', [
  check('email').isEmail().normalizeEmail()
], authController.forgotPassword);

router.put('/reset-password/:token', [
  check('password').isLength({ min: 6 }),
  check('confirmPassword').custom((value, { req }) => value === req.body.password)
], authController.resetPassword);

module.exports = router;