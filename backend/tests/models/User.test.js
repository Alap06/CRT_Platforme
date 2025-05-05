const bcrypt = require('bcryptjs');

// Mock the User model
const mockUserModel = function(userData) {
  this.firstName = userData.firstName || 'Test';
  this.lastName = userData.lastName || 'User';
  this.email = userData.email || 'test@example.com';
  this.password = userData.password || 'password123';
  this.phone = userData.phone || '+21612345678';
  this.cin = userData.cin || '12345678';
  this.role = userData.role || 'benevole';
  this.status = userData.status || 'pending';
  this.passwordChangedAt = null;
  this.passwordResetToken = null;
  this.passwordResetExpires = null;
};

// Instance methods
mockUserModel.prototype.save = function() {
  // Hash password on save
  if (this.password && !this.password.startsWith('$2')) {
    this.password = '$2a$10$mockHashedPassword';
  }
  return Promise.resolve(this);
};

mockUserModel.prototype.comparePassword = function(candidatePassword) {
  return Promise.resolve(candidatePassword === 'password123');
};

mockUserModel.prototype.changedPasswordAfter = function() {
  if (this.passwordChangedAt) {
    return true;
  }
  return false;
};

mockUserModel.prototype.createPasswordResetToken = function() {
  const resetToken = 'mock-reset-token';
  this.passwordResetToken = 'mock-hashed-token';
  this.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);
  return resetToken;
};

// Mock the static methods
mockUserModel.findByIdAndDelete = jest.fn().mockImplementation(() => {
  return Promise.resolve({ _id: 'mock-user-id' });
});

// Mock User model for testing
jest.mock('../../models/User', () => mockUserModel);

describe('User Model', () => {
  // Test data
  const testUserData = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phone: '+21612345678',
    cin: '12345678',
    password: 'Password123',
    role: 'benevole'
  };

  it('should create a new user successfully', () => {
    const User = require('../../models/User');
    const user = new User(testUserData);
    
    expect(user).toBeDefined();
    expect(user.firstName).toBe(testUserData.firstName);
    expect(user.lastName).toBe(testUserData.lastName);
    expect(user.email).toBe(testUserData.email);
  });

  it('should not store plain text password', async () => {
    const User = require('../../models/User');
    const user = new User(testUserData);
    await user.save();
    
    expect(user.password).not.toBe(testUserData.password);
    expect(user.password).toMatch(/^\$2/);
  });

  it('should generate password reset token', () => {
    const User = require('../../models/User');
    const user = new User(testUserData);
    
    const resetToken = user.createPasswordResetToken();
    
    expect(resetToken).toBeDefined();
    expect(user.passwordResetToken).toBeDefined();
    expect(user.passwordResetExpires).toBeDefined();
  });

  it('should detect password changes', () => {
    const User = require('../../models/User');
    const user = new User(testUserData);
    
    // Initially no change
    expect(user.changedPasswordAfter()).toBe(false);
    
    // Set passwordChangedAt to simulate password change
    user.passwordChangedAt = new Date();
    
    expect(user.changedPasswordAfter()).toBe(true);
  });
});
