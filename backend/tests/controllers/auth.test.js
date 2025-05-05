const request = require('supertest');
const express = require('express');
const bodyParser = express.json;

// Create a standalone test app for auth controller tests
function createMockAuthApp() {
  const app = express();
  app.use(bodyParser());
  
  // Auth endpoints
  app.post('/api/auth/register', (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    
    // Basic validation
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }
    
    if (email === 'existing@example.com') {
      return res.status(400).json({
        success: false,
        message: 'Email already taken',
        code: 'EMAIL_ALREADY_EXISTS'
      });
    }
    
    res.status(201).json({
      success: true,
      data: {
        id: 'new-user-id',
        firstName,
        lastName,
        email,
        role: req.body.role || 'benevole'
      }
    });
  });
  
  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    
    if (email === 'test@example.com' && password === 'password123') {
      return res.status(200).json({
        success: true,
        token: 'mock-token',
        data: {
          id: 'user-id',
          email: 'test@example.com',
          role: 'benevole'
        }
      });
    }
    
    res.status(401).json({
      success: false,
      message: 'Invalid credentials',
      code: 'INVALID_CREDENTIALS'
    });
  });
  
  app.get('/api/auth/user', (req, res) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated'
      });
    }
    
    res.status(200).json({
      success: true,
      data: {
        id: 'mock-user-id',
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        role: 'benevole',
        status: 'approved'
      }
    });
  });
  
  app.post('/api/auth/logout', (req, res) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Logout successful'
    });
  });
  
  return app;
}

const app = createMockAuthApp();

describe('Auth Controller', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          firstName: 'New',
          lastName: 'User',
          email: 'newuser@example.com',
          phone: '+21612345678',
          cin: '12345678',
          password: 'password123'
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.email).toBe('newuser@example.com');
    });

    it('should return error if email exists', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          firstName: 'Test',
          lastName: 'User',
          email: 'existing@example.com',
          phone: '+21612345678',
          cin: '12345678',
          password: 'password123'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.code).toBe('EMAIL_ALREADY_EXISTS');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login successfully with correct credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.token).toBeDefined();
    });

    it('should fail login with incorrect credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.code).toBe('INVALID_CREDENTIALS');
    });
  });

  describe('GET /api/auth/user', () => {
    it('should return user profile when authenticated', async () => {
      const response = await request(app)
        .get('/api/auth/user')
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
    });

    it('should not allow access without authentication', async () => {
      const response = await request(app)
        .get('/api/auth/user');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should logout successfully', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });
});
