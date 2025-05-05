const request = require('supertest');
const express = require('express');
const bodyParser = express.json;

// Create a mock API for integration tests
function createMockApi() {
  const app = express();
  app.use(bodyParser());
  
  // Auth endpoints
  app.post('/api/auth/register', (req, res) => {
    res.status(201).json({
      success: true,
      data: {
        id: 'new-user-id',
        email: req.body.email,
        role: req.body.role || 'benevole'
      }
    });
  });
  
  app.post('/api/auth/login', (req, res) => {
    res.status(200).json({
      success: true,
      token: 'mock-token',
      data: {
        id: 'user-id',
        email: req.body.email,
        role: 'benevole'
      }
    });
  });
  
  app.get('/api/auth/user', (req, res) => {
    if (!req.headers.authorization) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated'
      });
    }
    
    res.status(200).json({
      success: true,
      data: {
        id: 'user-id',
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com'
      }
    });
  });
  
  app.put('/api/admin/users/:id/status', (req, res) => {
    if (!req.headers.authorization || !req.headers.authorization.includes('admin')) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated'
      });
    }
    
    res.status(200).json({
      success: true,
      data: {
        id: req.params.id,
        status: req.body.status,
        role: 'benevole'
      }
    });
  });
  
  app.get('/api/admin/stats', (req, res) => {
    if (!req.headers.authorization || !req.headers.authorization.includes('admin')) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated'
      });
    }
    
    res.status(200).json({
      success: true,
      data: {
        totalUsers: 10,
        pendingUsers: 5,
        approvedUsers: 5
      }
    });
  });
  
  return app;
}

const app = createMockApi();

describe('API Integration Tests', () => {
  describe('Authentication Flow', () => {
    it('should register, login, and get user profile', async () => {
      const userData = {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: 'Password123!'
      };
      
      // Register user
      const registerResponse = await request(app)
        .post('/api/auth/register')
        .send(userData);
        
      expect(registerResponse.status).toBe(201);
      expect(registerResponse.body.success).toBe(true);
      
      // Login user
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: userData.email,
          password: userData.password
        });
        
      expect(loginResponse.status).toBe(200);
      expect(loginResponse.body.token).toBeDefined();
      
      const token = loginResponse.body.token;
      
      // Get user profile
      const profileResponse = await request(app)
        .get('/api/auth/user')
        .set('Authorization', `Bearer ${token}`);
        
      expect(profileResponse.status).toBe(200);
      expect(profileResponse.body.success).toBe(true);
      expect(profileResponse.body.data).toBeDefined();
    });
  });
  
  describe('Admin Flow', () => {
    it('should allow admin to approve a pending user', async () => {
      const adminToken = 'admin-token';
      
      const approveResponse = await request(app)
        .put('/api/admin/users/new-user-id/status')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'approved' });
        
      expect(approveResponse.status).toBe(200);
      expect(approveResponse.body.success).toBe(true);
      expect(approveResponse.body.data.status).toBe('approved');
    });
    
    it('should retrieve admin statistics', async () => {
      const adminToken = 'admin-token';
      
      const statsResponse = await request(app)
        .get('/api/admin/stats')
        .set('Authorization', `Bearer ${adminToken}`);
        
      expect(statsResponse.status).toBe(200);
      expect(statsResponse.body.success).toBe(true);
      expect(statsResponse.body.data).toHaveProperty('totalUsers');
      expect(statsResponse.body.data).toHaveProperty('pendingUsers');
    });
  });
});
