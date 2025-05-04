const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Middleware de protection des routes
 * Vérifie l'authentification et la validité du token
 */
exports.protect = async (req, res, next) => {
  let token;

  // 1. Récupération du token depuis différentes sources
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies?.token) {
    token = req.cookies.token;
  }

  // 2. Vérification de la présence du token
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Accès non autorisé : token manquant',
      code: 'AUTH_MISSING_TOKEN'
    });
  }

  try {
    // 3. Vérification et décodage du token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Validation des claims essentiels
    if (!decoded.id || !decoded.role) {
      return res.status(401).json({
        success: false,
        message: 'Token invalide : informations manquantes',
        code: 'AUTH_INVALID_TOKEN'
      });
    }

    // 5. Vérification de l'existence de l'utilisateur
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return res.status(401).json({
        success: false,
        message: 'Utilisateur associé au token introuvable',
        code: 'AUTH_USER_NOT_FOUND'
      });
    }

    // 6. Vérification du statut du compte
    if (currentUser.status !== 'approved') {
      return res.status(403).json({
        success: false,
        message: 'Compte en attente de validation',
        code: 'AUTH_ACCOUNT_PENDING'
      });
    }

    // 7. Vérification du changement de mot de passe
    if (currentUser.passwordChangedAt && decoded.iat < Math.floor(currentUser.passwordChangedAt.getTime() / 1000)) {
      return res.status(401).json({
        success: false,
        message: 'Mot de passe modifié récemment, veuillez vous reconnecter',
        code: 'AUTH_PASSWORD_CHANGED'
      });
    }

    // 8. Ajout des informations utilisateur à la requête
    req.user = {
      id: currentUser.id,
      role: currentUser.role,
      email: currentUser.email,
      status: currentUser.status
    };

    next();
  } catch (err) {
    // 9. Gestion différenciée des erreurs JWT
    const errorMap = {
      TokenExpiredError: {
        message: 'Session expirée, veuillez vous reconnecter',
        code: 'AUTH_TOKEN_EXPIRED'
      },
      JsonWebTokenError: {
        message: 'Token corrompu ou malformé',
        code: 'AUTH_MALFORMED_TOKEN'
      },
      default: {
        message: 'Token invalide',
        code: 'AUTH_INVALID_TOKEN'
      }
    };

    const { message, code } = errorMap[err.name] || errorMap.default;

    return res.status(401).json({
      success: false,
      message,
      code,
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

/**
 * Middleware de restriction par rôle
 * @param {...String} roles - Rôles autorisés
 */
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // 1. Vérification que protect a bien été appelé avant
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Vous devez être connecté pour accéder à cette ressource',
        code: 'AUTH_MISSING_USER'
      });
    }

    // 2. Vérification des rôles autorisés
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Accès interdit : permissions insuffisantes',
        code: 'AUTH_INSUFFICIENT_PERMISSIONS',
        requiredRoles: roles,
        userRole: req.user.role
      });
    }

    next();
  };
};

/**
 * Middleware de vérification de propriété
 * @param {Model} model - Modèle Mongoose/Sequelize
 * @param {String} paramName - Nom du paramètre d'ID (par défaut 'id')
 */
exports.verifyOwnership = (model, paramName = 'id') => {
  return async (req, res, next) => {
    try {
      const resource = await model.findById(req.params[paramName]);
      
      if (!resource) {
        return res.status(404).json({
          success: false,
          message: 'Ressource introuvable',
          code: 'RESOURCE_NOT_FOUND'
        });
      }

      // Vérification que l'utilisateur est propriétaire ou admin
      if (resource.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Accès interdit : vous n\'êtes pas propriétaire de cette ressource',
          code: 'AUTH_NOT_OWNER'
        });
      }

      req.resource = resource;
      next();
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la vérification de propriété',
        code: 'SERVER_ERROR',
        details: process.env.NODE_ENV === 'development' ? err.message : undefined
      });
    }
  };
};

/**
 * Middleware pour les tokens temporaires
 * @param {Object} req - Requête HTTP
 * @param {Object} res - Réponse HTTP
 * @param {Function} next - Fonction next
 */
exports.checkTempToken = (req, res, next) => {
  const token = req.params.token || req.query.token;

  if (!token) {
    return res.status(400).json({
      success: false,
      message: 'Token temporaire manquant',
      code: 'TEMP_TOKEN_MISSING'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (!decoded.temp || !decoded.id) {
      throw new Error('Token invalide');
    }

    req.tempUser = { 
      id: decoded.id,
      purpose: decoded.purpose // Ajout du contexte d'utilisation
    };
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Token temporaire invalide ou expiré',
      code: 'TEMP_TOKEN_INVALID',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};