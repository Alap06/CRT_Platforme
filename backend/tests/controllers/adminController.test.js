const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../server');
const User = require('../../models/User');
const { createTestUser, generateToken, cleanupTestUser } = require('../utils/testUtils');

// Set test environment
process.env.NODE_ENV = 'test';

describe('Admin Controller', () => {
  let adminUser;
  let adminToken;
  let regularUser;
  
  // Setup admin user and token before each test
  beforeEach(async () => {
    // Create admin with approved status
    adminUser = await createTestUser({ 
      role: 'admin',
      status: 'approved',
      email: `admin${Date.now()}@example.com` 
    });
    
    // Generate token with admin role
    adminToken = generateToken(adminUser);
    
    // Create regular user with pending status
    regularUser = await createTestUser({
      status: 'pending',
      email: `user${Date.now()}@example.com`
    });
  });
  
  // Clean up after each test
  afterEach(async () => {
    await cleanupTestUser(adminUser);
    await cleanupTestUser(regularUser);
  });

  describe('GET /api/admin/pending-users', () => {
    it('should return pending users for admin', async () => {
      // Create some pending users
      await createTestUser({ 
        status: 'pending',
        email: 'pending1@example.com',
        cin: '11111111'
      });
      
      await createTestUser({ 
        status: 'pending',
        email: 'pending2@example.com',
        cin: '22222222' 
      });

      const response = await request(app)
        .get('/api/admin/pending-users')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThanOrEqual(2);
      
      // All users should have pending status
      response.body.data.forEach(user => {
        expect(user.status).toBe('pending');
      });
    });

    it('should deny access to non-admin users', async () => {
      const regularUserToken = generateToken(regularUser);
      
      const response = await request(app)
        .get('/api/admin/pending-users')
        .set('Authorization', `Bearer ${regularUserToken}`);

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/admin/users/:id/role', () => {
    it('should update user role as admin', async () => {
      const response = await request(app)
        .put(`/api/admin/users/${regularUser._id}/role`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ role: 'donateur' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.role).toBe('donateur');
      expect(response.body.data.status).toBe('approved');
      
      // Verify in database
      const updatedUser = await User.findById(regularUser._id);
      expect(updatedUser.role).toBe('donateur');
      expect(updatedUser.status).toBe('approved');
    });

    it('should reject invalid roles', async () => {
      const response = await request(app)
        .put(`/api/admin/users/${regularUser._id}/role`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ role: 'invalidRole' });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/admin/users/:id/status', () => {
    it('should update user status as admin', async () => {
      const response = await request(app)
        .put(`/api/admin/users/${regularUser._id}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'approved' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe('approved');
      
      // Verify in database
      const updatedUser = await User.findById(regularUser._id);
      expect(updatedUser.status).toBe('approved');
    });
  });

  describe('GET /api/admin/stats', () => {
    it('should return system statistics', async () => {
      const response = await request(app)
        .get('/api/admin/stats')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('totalUsers');
      expect(response.body.data).toHaveProperty('pendingUsers');
      expect(response.body.data).toHaveProperty('approvedUsers');
      expect(typeof response.body.data.totalUsers).toBe('number');
    });
  });

  describe('GET /api/admin/users', () => {
    it('should return paginated users', async () => {
      // Create some extra users to test pagination
      for (let i = 0; i < 5; i++) {
        await createTestUser({ 
          email: `paginationtest${i}@example.com`,
          cin: `5555555${i}`
        });
      }

      const response = await request(app)
        .get('/api/admin/users?page=1&limit=3')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeLessThanOrEqual(3);
      expect(response.body.pagination).toHaveProperty('total');
      expect(response.body.pagination).toHaveProperty('page', 1);
      expect(response.body.pagination).toHaveProperty('limit', 3);
      expect(response.body.pagination).toHaveProperty('pages');
    });

    it('should filter users by role', async () => {
      await createTestUser({ 
        role: 'donateur',
        email: 'donateur1@example.com',
        cin: '33333333' 
      });
      
      await createTestUser({ 
        role: 'donateur',
        email: 'donateur2@example.com',
        cin: '44444444' 
      });

      const response = await request(app)
        .get('/api/admin/users?role=donateur')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThanOrEqual(2);
      
      // All returned users should be donateurs
      response.body.data.forEach(user => {
        expect(user.role).toBe('donateur');
      });
    });
  });
});
