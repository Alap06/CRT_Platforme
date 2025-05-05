const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');
const { loginRequestInspector } = require('../middlewares/loginMiddleware');
const { check } = require('express-validator');
const { validate } = require('../middlewares/validationMiddleware');

// Routes
router.post('/register', validate([
  check('firstName').notEmpty().trim(),
  check('lastName').notEmpty().trim(),
  check('email').isEmail().normalizeEmail(),
  check('phone').isMobilePhone(),
  check('cin').isLength({ min: 8, max: 8 }),
  check('password').isLength({ min: 6 }),
  check('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Les mots de passe ne correspondent pas');
    }
    return true;
  })
]), authController.register);

// Login route with better request inspection
router.post('/login', loginRequestInspector, authController.login);

router.get('/user', authMiddleware.protect, authController.getUser);
router.post('/logout', authMiddleware.protect, authController.logout);
router.post('/refresh-token', authController.refreshToken);

router.post('/forgot-password', validate([
  check('email').isEmail().normalizeEmail()
]), authController.forgotPassword);

router.put('/reset-password/:token', validate([
  check('password').isLength({ min: 6 }),
  check('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Les mots de passe ne correspondent pas');
    }
    return true;
  })
]), authController.resetPassword);

module.exports = router;