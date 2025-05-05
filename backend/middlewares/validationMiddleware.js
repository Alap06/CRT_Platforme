const { check, validationResult } = require('express-validator');

/**
 * Middleware de validation générique pour Express
 * @param {Array} validations - Tableau de validations express-validator
 * @returns {Function} Middleware Express
 */
exports.validate = (validations) => {
  return async (req, res, next) => {
    try {
      // Exécuter toutes les validations
      await Promise.all(validations.map(validation => validation.run(req)));
      
      // Vérifier les résultats
      const errors = validationResult(req);
      if (errors.isEmpty()) {
        return next();
      }
      
      // Format errors in a more user-friendly format
      const formattedErrors = errors.array().map(error => ({
        field: error.path,
        message: error.msg
      }));
      
      // Renvoyer les erreurs de validation
      return res.status(400).json({
        success: false,
        message: 'Erreur de validation',
        code: 'VALIDATION_ERROR',
        errors: formattedErrors
      });
    } catch (err) {
      console.error('Validation middleware error:', err);
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la validation des données',
        code: 'VALIDATION_SYSTEM_ERROR'
      });
    }
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
    .isMongoId()
    .withMessage('ID utilisateur invalide'),
  
  pagination: [
    check('page').optional().isInt({ min: 1 }).toInt(),
    check('limit').optional().isInt({ min: 1, max: 100 }).toInt()
  ]
};