const express = require('express');
const bodyParser = express.json;

/**
 * Creates a simple mocked Express app for testing
 */
function createTestApp() {
  const app = express();
  
  app.use(bodyParser());
  
  // Mock auth middleware
  app.use((req, res, next) => {
    if (req.path.includes('/admin') && !req.headers.authorization) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }
    
    // Add user object to request for protected routes
    if (req.headers.authorization) {
      req.user = {
        id: req.path.includes('/admin') ? 'admin-user-id' : 'regular-user-id',
        role: req.path.includes('/admin') ? 'admin' : 'benevole',
        email: req.path.includes('/admin') ? 'admin@example.com' : 'user@example.com'
      };
    }
    
    next();
  });
  
  // Auth routes
  app.post('/api/auth/register', (req, res) => {
    const { email } = req.body;
    
    if (email === 'existing@example.com') {
      return res.status(400).json({
        success: false,
        message: 'Cet email est déjà utilisé',
        code: 'EMAIL_ALREADY_EXISTS'
      });
    }
    
    return res.status(201).json({
      success: true,
      data: {
        id: 'new-user-id',
        email: req.body.email,
        role: req.body.role || 'benevole'
      }
    });
  });
  
  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    
    if (email === 'test@example.com' && password === 'password123') {
      return res.status(200).json({
        success: true,
        token: 'mock-jwt-token',
        data: {
          id: 'user-id',
          email,
          role: 'benevole'
        }
      });
    }
    
    return res.status(401).json({
      success: false,
      message: 'Email ou mot de passe incorrect',
      code: 'INVALID_CREDENTIALS'
    });
  });
  
  app.get('/api/auth/user', (req, res) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: {
        id: req.user.id,
        firstName: 'Test',
        lastName: 'User',
        email: req.user.email,
        role: req.user.role,
        status: 'approved'
      }
    });
  });
  
  app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('token');
    return res.status(200).json({
      success: true,
      message: 'Déconnexion réussie'
    });
  });
  
  // Admin routes
  app.get('/api/admin/pending-users', (req, res) => {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: [
        { _id: 'user1', firstName: 'John', lastName: 'Doe', email: 'john@example.com', status: 'pending' },
        { _id: 'user2', firstName: 'Jane', lastName: 'Doe', email: 'jane@example.com', status: 'pending' }
      ],
      count: 2
    });
  });
  
  app.put('/api/admin/users/:id/role', (req, res) => {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }
    
    const validRoles = ['benevole', 'donateur', 'partenaire', 'admin'];
    if (!validRoles.includes(req.body.role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role'
      });
    }
    
    if (req.params.id === 'nonexistent') {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: {
        _id: req.params.id,
        firstName: 'Updated',
        lastName: 'User',
        email: 'user@example.com',
        role: req.body.role,
        status: 'approved'
      }
    });
  });
  
  app.get('/api/admin/stats', (req, res) => {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: {
        totalUsers: 10,
        pendingUsers: 2,
        approvedUsers: 7,
        suspendedUsers: 1,
        usersByRole: {
          benevole: 5,
          donateur: 3,
          admin: 2
        }
      }
    });
  });
  
  return app;
}

module.exports = createTestApp;
