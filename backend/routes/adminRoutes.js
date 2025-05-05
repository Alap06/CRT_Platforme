const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');
const { check, validationResult } = require('express-validator');
//router.post('/some-path', authMiddleware.someMiddleware, authController.someMethod);

// Define routes
router.get('/', (req, res) => {
  res.send('Hello from Express!');
});

/**
 * @route   GET /api/admin/pending-users
 * @desc    Récupère la liste des utilisateurs en attente de validation
 * @access  Private/Admin
 * @returns {Object} Liste des utilisateurs avec pagination
 */
router.get('/pending-users', 
  authMiddleware.protect,
  authMiddleware.restrictTo('admin'),
  adminController.getPendingUsers
);

/**
 * @route   PUT /api/admin/users/:id/role
 * @desc    Modifie le rôle d'un utilisateur
 * @access  Private/Admin
 * @param   {number} id - ID de l'utilisateur
 * @returns {Object} Utilisateur mis à jour
 */
router.put(
  '/users/:id/role',
  authMiddleware.protect,
  authMiddleware.restrictTo('admin'),
  [
    check('id').isInt().toInt(),
    check('role').isIn(['benevole', 'donateur', 'partenaire', 'admin']).withMessage('Rôle invalide')
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    next();
  },
  adminController.updateUserRole
);

/**
 * @route   PUT /api/admin/users/:id/status
 * @desc    Modifie le statut d'un utilisateur
 * @access  Private/Admin
 * @param   {number} id - ID de l'utilisateur
 * @returns {Object} Utilisateur mis à jour
 */
router.post('/login', authController.login); // Example
router.put(
  '/users/:id/status',
  authMiddleware.protect,
  authMiddleware.restrictTo('admin'),
  [
    check('id').isInt().toInt(),
    check('status').isIn(['pending', 'approved', 'suspended', 'banned']).withMessage('Statut invalide')
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    next();
  },
  adminController.updateUserStatus
);

/**
 * @route   GET /api/admin/stats
 * @desc    Récupère les statistiques système
 * @access  Private/Admin
 * @returns {Object} Statistiques de l'application
 */
router.get(
  '/stats',
  authMiddleware.protect,
  authMiddleware.restrictTo('admin'),
  adminController.getSystemStats
);

/**
 * @route   GET /api/admin/dashboard
 * @desc    Récupère les données du tableau de bord admin
 * @access  Private/Admin
 * @returns {Object} Données du tableau de bord
 */
router.get(
  '/dashboard',
  authMiddleware.protect,
  authMiddleware.restrictTo('admin'),
  adminController.getDashboard
);

/**
 * @route   GET /api/admin/users
 * @desc    Récupère la liste des utilisateurs (avec filtres)
 * @access  Private/Admin
 * @returns {Object} Liste paginée des utilisateurs
 */
router.get(
  '/users',
  authMiddleware.protect,
  authMiddleware.restrictTo('admin'),
  [
    check('page').optional().isInt({ min: 1 }).toInt(),
    check('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
    check('role').optional().isIn(['benevole', 'donateur', 'partenaire', 'admin']),
    check('status').optional().isIn(['pending', 'approved', 'suspended', 'banned'])
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    next();
  },
  adminController.getAllUsers
);

module.exports = router;