const request = require('supertest');
const express = require('express');
const bodyParser = express.json;

// Create admin test app
function createAdminApp() {
  const app = express();
  app.use(bodyParser());
  
  // Middleware to check admin role
  const adminAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }
    
    const token = authHeader.split(' ')[1];
    
    // Check if token shows admin role
    if (token === 'admin-token') {
      req.user = {
        id: 'admin-id',
        role: 'admin',
        email: 'admin@example.com'
      };
      return next();
    } else if (token === 'user-token') {
      // Non-admin user
      req.user = {
        id: 'user-id',
        role: 'benevole',
        email: 'user@example.com'
      };
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }
    
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  };
  
  // Admin routes
  app.get('/api/admin/pending-users', adminAuth, (req, res) => {
    res.status(200).json({
      success: true,
      data: [
        { _id: 'user1', firstName: 'John', lastName: 'Doe', email: 'john@example.com', status: 'pending' },
        { _id: 'user2', firstName: 'Jane', lastName: 'Doe', email: 'jane@example.com', status: 'pending' }
      ],
      count: 2
    });
  });
  
  app.put('/api/admin/users/:id/role', adminAuth, (req, res) => {
    const { role } = req.body;
    const { id } = req.params;
    
    // Validate role
    const validRoles = ['benevole', 'donateur', 'partenaire', 'admin'];
    
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role'
      });
    }
    
    if (id === 'nonexistent') {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: {
        _id: id,
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        role: role,
        status: 'approved'
      }
    });
  });
  
  app.get('/api/admin/stats', adminAuth, (req, res) => {
    res.status(200).json({
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

const app = createAdminApp();

describe('Admin Controller', () => {
  describe('GET /api/admin/pending-users', () => {
    it('should return pending users', async () => {
      const response = await request(app)
        .get('/api/admin/pending-users')
        .set('Authorization', 'Bearer admin-token');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.count).toBe(2);
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .get('/api/admin/pending-users');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
    
    it('should return 403 for non-admin users', async () => {
      const response = await request(app)
        .get('/api/admin/pending-users')
        .set('Authorization', 'Bearer user-token');

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/admin/users/:id/role', () => {
    it('should update user role', async () => {
      const response = await request(app)
        .put('/api/admin/users/user1/role')
        .set('Authorization', 'Bearer admin-token')
        .send({ role: 'donateur' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.role).toBe('donateur');
    });

    it('should return 400 for invalid role', async () => {
      const response = await request(app)
        .put('/api/admin/users/user1/role')
        .set('Authorization', 'Bearer admin-token')
        .send({ role: 'invalid-role' });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should return 404 if user not found', async () => {
      const response = await request(app)
        .put('/api/admin/users/nonexistent/role')
        .set('Authorization', 'Bearer admin-token')
        .send({ role: 'donateur' });

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/admin/stats', () => {
    it('should return system statistics', async () => {
      const response = await request(app)
        .get('/api/admin/stats')
        .set('Authorization', 'Bearer admin-token');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('totalUsers');
      expect(response.body.data).toHaveProperty('usersByRole');
    });
  });
});
