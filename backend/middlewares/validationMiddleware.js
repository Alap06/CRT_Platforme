const { check, validationResult } = require('express-validator');

/**
 * Middleware de validation générique pour Express
 * @param {Array} validations - Tableau de validations express-validator
 * @returns {Function} Middleware Express
 */
exports.validate = (validations) => {
  return async (req, res, next) => {
    // Exécuter toutes les validations
    await Promise.all(validations.map(validation => validation.run(req)));
    
    // Vérifier les résultats
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }
    
    // Renvoyer les erreurs de validation
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  };
};

/**
 * Validations réutilisables pour les routes utilisateurs
 */
exports.userValidations = {
  role: check('role')
    .isIn(['benevole', 'donateur', 'partenaire', 'admin'])
    .withMessage('Rôle invalide'),
  
  status: check('status')
    .isIn(['pending', 'approved', 'suspended', 'banned'])
    .withMessage('Statut invalide'),
  
  userId: check('id')
    .isInt()
    .toInt()
    .withMessage('ID utilisateur invalide'),
  
  pagination: [
    check('page').optional().isInt({ min: 1 }).toInt(),
    check('limit').optional().isInt({ min: 1, max: 100 }).toInt()
  ]
};