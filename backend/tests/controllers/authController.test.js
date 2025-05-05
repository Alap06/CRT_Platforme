const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../server');
const User = require('../../models/User');
const { createTestUser, generateToken, cleanupTestUser } = require('../utils/testUtils');

// Make sure NODE_ENV is set to test
process.env.NODE_ENV = 'test';

describe('Auth Controller', () => {
  // Setup and cleanup
  afterEach(async () => {
    // Clean up any test users by finding and removing them individually
    const testUsers = await User.find({ email: /^test.*@example\.com$/ });
    if (testUsers && Array.isArray(testUsers)) {
      for (const user of testUsers) {
        await User.findById(user._id).remove();
      }
    }
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const userData = {
        firstName: 'John',
        lastName: 'Doe',
        email: `test${Date.now()}@example.com`,
        phone: '12345678',
        cin: '12345678',
        password: 'password123',
        confirmPassword: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data).toHaveProperty('email', userData.email);
      expect(response.body.data).toHaveProperty('role', 'benevole');
    });

    it('should not register a user with existing email', async () => {
      // First, create a user
      const existingUser = await createTestUser();
      
      // Try to register with same email
      const userData = {
        firstName: 'Duplicate',
        lastName: 'User',
        email: existingUser.email,
        phone: '+21656789012',
        cin: '12345679',
        password: 'password123',
        confirmPassword: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.code).toBe('EMAIL_ALREADY_EXISTS');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login a user and return token', async () => {
      // Create a user
      const user = await createTestUser({ status: 'approved' });
      const plainPassword = 'password123'; // The password used in createTestUser

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: user.email,
          password: plainPassword
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body).toHaveProperty('token');
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data).toHaveProperty('email', user.email);
    });

    it('should not login with incorrect credentials', async () => {
      const user = await createTestUser();

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: user.email,
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.code).toBe('INVALID_CREDENTIALS');
    });
  });

  describe('GET /api/auth/user', () => {
    it('should get user profile when authenticated', async () => {
      const user = await createTestUser();
      const token = generateToken(user);

      const response = await request(app)
        .get('/api/auth/user')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data).toHaveProperty('email', user.email);
      expect(response.body.data).toHaveProperty('firstName', user.firstName);
    });

    it('should not allow access without authentication', async () => {
      const response = await request(app)
        .get('/api/auth/user');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should logout a user and clear cookie', async () => {
      const user = await createTestUser();
      const token = generateToken(user);

      const response = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      // Check that the cookie has been cleared (this requires accessing headers)
      expect(response.headers['set-cookie']).toBeDefined();
    });
  });

  describe('POST /api/auth/forgot-password', () => {
    it('should generate reset token for valid email', async () => {
      const user = await createTestUser();

      const response = await request(app)
        .post('/api/auth/forgot-password')
        .send({ email: user.email });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body).toHaveProperty('resetToken');
      expect(response.body).toHaveProperty('resetUrl');
    });

    it('should return error for invalid email', async () => {
      const response = await request(app)
        .post('/api/auth/forgot-password')
        .send({ email: 'nonexistent@example.com' });

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });
});
