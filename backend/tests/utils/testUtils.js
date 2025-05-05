const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');

// Set environment for testing
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_secret';

/**
 * Safely remove user documents - without using deleteMany
 * @param {Object} criteria - Search criteria
 * @returns {Promise} Operation result
 */
const cleanupUsers = async (criteria = {}) => {
  try {
    // Find all matching users
    const users = await User.find(criteria);
    
    // Remove each one individually
    let count = 0;
    for (const user of users) {
      await user.remove();
      count++;
    }
    
    return { deletedCount: count };
  } catch (err) {
    console.error('Error cleaning up users:', err);
    throw err;
  }
};

/**
 * Generate JWT token for testing
 * @param {Object} user - User object
 * @returns {string} JWT token
 */
exports.generateToken = function(user) {
  if (!user || !user._id) {
    throw new Error('Invalid user provided to generateToken');
  }
  
  return jwt.sign(
    { 
      id: user._id,
      role: user.role || 'benevole',
      test: true
    },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
};

exports.generateTestToken = exports.generateToken; // Alias for compatibility

/**
 * Create a test user with default values
 * @param {Object} overrides - Override default values
 * @returns {Promise<Object>} Created user
 */
exports.createTestUser = async (overrides = {}) => {
  // Default data
  const defaultData = {
    firstName: 'Test',
    lastName: 'User',
    email: `test${Date.now()}@example.com`,
    phone: '12345678',
    cin: '12345678',
    password: 'password123',
    role: 'benevole',
    status: 'approved' // Always approved for tests
  };

  // Merge with overrides
  const userData = { ...defaultData, ...overrides };

  try {
    // Clean up any existing users with same email
    await cleanupUsers({ email: userData.email });
    
    // Create and return new user
    return await User.create(userData);
  } catch (err) {
    console.error('Error creating test user:', err);
    throw err;
  }
};

/**
 * Clean up a test user
 * @param {Object} user - User to clean up
 */
exports.cleanupTestUser = async (user) => {
  if (!user) return;
  
  try {
    if (user._id) {
      const userToRemove = await User.findById(user._id);
      if (userToRemove) {
        await userToRemove.remove();
      }
    } else if (user.email) {
      await cleanupUsers({ email: user.email });
    }
  } catch (err) {
    console.error('Error cleaning up test user:', err);
  }
};

/**
 * Clean up all test users
 */
exports.cleanupAllTestUsers = async () => {
  return await cleanupUsers({ email: /^test.*@example\.com$/ });
};

/**
 * Connect to the test database
 */
exports.connectTestDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/test_db', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (err) {
    console.error('Error connecting to test database:', err);
    throw err;
  }
};

/**
 * Disconnect from the test database
 */
exports.disconnectTestDB = async () => {
  try {
    await mongoose.connection.close();
  } catch (err) {
    console.error('Error disconnecting from test database:', err);
  }
};

// Export cleanup function
exports.cleanupUsers = cleanupUsers;
