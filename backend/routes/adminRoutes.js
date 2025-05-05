const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');
const { check } = require('express-validator');
const { validate, userValidations } = require('../middlewares/validationMiddleware');

// Welcome route
router.get('/', (req, res) => {
  res.send('Admin API - Welcome!');
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
 * @param   {string} id - ID de l'utilisateur
 * @returns {Object} Utilisateur mis à jour
 */
router.put(
  '/users/:id/role',
  authMiddleware.protect,
  authMiddleware.restrictTo('admin'),
  validate([
    userValidations.userId,
    userValidations.role
  ]),
  adminController.updateUserRole
);

/**
 * @route   PUT /api/admin/users/:id/status
 * @desc    Modifie le statut d'un utilisateur
 * @access  Private/Admin
 * @param   {string} id - ID de l'utilisateur
 * @returns {Object} Utilisateur mis à jour
 */
router.put(
  '/users/:id/status',
  authMiddleware.protect,
  authMiddleware.restrictTo('admin'),
  validate([
    userValidations.userId,
    userValidations.status
  ]),
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
  validate([
    check('page').optional().isInt({ min: 1 }).toInt(),
    check('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
    check('role').optional().isIn(['benevole', 'donateur', 'partenaire', 'admin']),
    check('status').optional().isIn(['pending', 'approved', 'suspended', 'banned'])
  ]),
  adminController.getAllUsers
);

module.exports = router;