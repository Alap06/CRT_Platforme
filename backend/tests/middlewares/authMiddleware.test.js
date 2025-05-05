const jwt = require('jsonwebtoken');
const { protect, restrictTo } = require('../../middlewares/authMiddleware');
const User = require('../../models/User');
const mongoose = require('mongoose');
const { generateToken } = require('../utils/testUtils');

// Mock express response and request objects
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('Auth Middleware', () => {
  let mockReq;
  let mockRes;
  let mockNext;
  let testUser;
  let validToken;

  // Setup user once before all tests in this describe block
  beforeAll(async () => {
    try {
      testUser = await User.create({
        firstName: 'Test',
        lastName: 'User',
        email: 'testmiddleware@example.com',
        phone: '+21658123456',
        cin: '12345678',
        password: 'password123',
        status: 'approved'
      });

      validToken = jwt.sign(
        { id: testUser._id, role: testUser.role },
        process.env.JWT_SECRET || 'testsecret'
      );
    } catch (error) {
      console.error('Error in test setup:', error);
    }
  }, 30000);

  beforeEach(() => {
    mockReq = {
      headers: {},
      cookies: {}
    };
    mockRes = mockResponse();
    mockNext = jest.fn();
    
    jest.clearAllMocks();
  });

  describe('protect middleware', () => {
    it('should pass if valid token is provided in headers', async () => {
      // Set token in headers
      mockReq.headers.authorization = `Bearer ${validToken}`;
      
      await protect(mockReq, mockRes, mockNext);
      
      expect(mockNext).toHaveBeenCalled();
      expect(mockReq.user).toBeDefined();
      expect(mockReq.user.id).toBe(testUser._id.toString());
    });

    it('should pass if valid token is provided in cookies', async () => {
      // Set token in cookies
      mockReq.cookies.token = validToken;
      
      await protect(mockReq, mockRes, mockNext);
      
      expect(mockNext).toHaveBeenCalled();
      expect(mockReq.user).toBeDefined();
    });

    it('should fail if no token is provided', async () => {
      await protect(mockReq, mockRes, mockNext);

      expect(mockNext).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
        code: 'AUTH_MISSING_TOKEN'
      }));
    });

    it('should fail if token is invalid', async () => {
      mockReq.headers.authorization = 'Bearer invalidtoken';
      
      await protect(mockReq, mockRes, mockNext);
      
      expect(mockNext).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(401);
    });

    it('should fail if user no longer exists', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const invalidUserToken = jwt.sign(
        { id: nonExistentId, role: 'benevole' },
        process.env.JWT_SECRET || 'testsecret'
      );

      mockReq.headers.authorization = `Bearer ${invalidUserToken}`;
      
      await protect(mockReq, mockRes, mockNext);
      
      expect(mockNext).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(401);
    });
  });

  describe('restrictTo middleware', () => {
    it('should allow access to authorized roles', () => {
      mockReq.user = { role: 'admin' };

      const restrictToAdmin = restrictTo('admin');
      restrictToAdmin(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    it('should deny access to unauthorized roles', () => {
      mockReq.user = { role: 'benevole' };

      const restrictToAdmin = restrictTo('admin');
      restrictToAdmin(mockReq, mockRes, mockNext);

      expect(mockNext).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(403);
    });

    it('should deny access when req.user is missing', () => {
      const restrictToAdmin = restrictTo('admin');
      restrictToAdmin(mockReq, mockRes, mockNext);

      expect(mockNext).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(401);
    });
  });

  // Clean up test user after all tests
  afterAll(async () => {
    if (testUser && testUser._id) {
      // Replace deleteOne with findByIdAndDelete
      await User.findByIdAndDelete(testUser._id);
    }
  }, 10000);
});
