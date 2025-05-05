const bcrypt = require('bcryptjs');

// Mock User model for testing

// Private store of mock users for testing
const mockUsers = {
  'mock-user-id': {
    _id: 'mock-user-id',
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com',
    phone: '+21612345678',
    cin: '12345678',
    role: 'benevole',
    status: 'approved'
  },
  'admin-id': {
    _id: 'admin-id',
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@example.com',
    phone: '+21612345679',
    cin: '87654321',
    role: 'admin',
    status: 'approved'
  }
};

// User model constructor
function UserModel(data) {
  Object.assign(this, {
    _id: data._id || 'mock-user-id',
    firstName: data.firstName || 'Test',
    lastName: data.lastName || 'User',
    email: data.email || 'test@example.com',
    phone: data.phone || '+21612345678',
    cin: data.cin || '12345678',
    password: data.password || '$2a$12$mock-hashed-password',
    role: data.role || 'benevole',
    status: data.status || 'pending',
    passwordChangedAt: null,
    passwordResetToken: null,
    passwordResetExpires: null,
    createdAt: new Date(),
    __v: 0
  });
}

// Instance methods
UserModel.prototype.save = function() {
  // Store user in mock database
  mockUsers[this._id] = {...this};
  return Promise.resolve(this);
};

UserModel.prototype.comparePassword = function(candidatePassword) {
  return Promise.resolve(candidatePassword === 'password123');
};

UserModel.prototype.changedPasswordAfter = function(timestamp) {
  return false; // Default: password not changed
};

UserModel.prototype.createPasswordResetToken = function() {
  this.passwordResetToken = 'mock-hashed-token';
  this.passwordResetExpires = new Date(Date.now() + 3600000); // +1 hour
  return 'mock-reset-token';
};

// Static methods
UserModel.findOne = jest.fn().mockImplementation((query = {}) => {
  // Handle email query
  if (query.email) {
    const user = Object.values(mockUsers).find(u => u.email === query.email);
    
    if (user) {
      const userInstance = new UserModel({...user});
      // Add comparePassword to the returned object if needed
      userInstance.comparePassword = UserModel.prototype.comparePassword;
      return Promise.resolve(userInstance);
    }
    return Promise.resolve(null);
  }
  
  // Handle passwordResetToken query
  if (query.passwordResetToken) {
    const user = Object.values(mockUsers).find(u => 
      u.passwordResetToken === query.passwordResetToken);
    
    if (user && query.passwordResetExpires && user.passwordResetExpires > Date.now()) {
      return Promise.resolve(new UserModel({...user}));
    }
    return Promise.resolve(null);
  }
  
  // Default response
  return Promise.resolve(new UserModel(mockUsers['mock-user-id']));
});

UserModel.findById = jest.fn().mockImplementation((id) => {
  if (id === 'nonexistent-id') {
    return Promise.resolve(null);
  }
  
  const user = mockUsers[id] || mockUsers['mock-user-id'];
  return Promise.resolve(new UserModel({...user}));
});

UserModel.create = jest.fn().mockImplementation((data) => {
  const id = `user-${Date.now()}`;
  const newUser = new UserModel({
    _id: id,
    ...data
  });
  mockUsers[id] = {...newUser};
  return Promise.resolve(newUser);
});

UserModel.find = jest.fn().mockReturnValue({
  select: jest.fn().mockResolvedValue([
    new UserModel({_id: 'user1', status: 'pending'}),
    new UserModel({_id: 'user2', status: 'pending'})
  ]),
  sort: jest.fn().mockReturnThis(),
  limit: jest.fn().mockReturnThis(),
  skip: jest.fn().mockReturnThis()
});

UserModel.findByIdAndUpdate = jest.fn().mockImplementation((id, data, options) => {
  if (id === 'nonexistent-id') {
    return Promise.resolve(null);
  }
  
  const user = mockUsers[id] || mockUsers['mock-user-id'];
  const updatedUser = {...user, ...data};
  mockUsers[id] = updatedUser;
  
  return Promise.resolve(new UserModel(updatedUser));
});

UserModel.findByIdAndDelete = jest.fn().mockImplementation((id) => {
  if (mockUsers[id]) {
    const deletedUser = {...mockUsers[id]};
    delete mockUsers[id];
    return Promise.resolve(new UserModel(deletedUser));
  }
  return Promise.resolve(null);
});

UserModel.countDocuments = jest.fn().mockImplementation((query = {}) => {
  if (query.status) {
    return Promise.resolve(Object.values(mockUsers).filter(u => u.status === query.status).length);
  }
  return Promise.resolve(Object.keys(mockUsers).length);
});

UserModel.aggregate = jest.fn().mockResolvedValue([
  { _id: 'benevole', count: 5 },
  { _id: 'donateur', count: 3 },
  { _id: 'admin', count: 2 }
]);

module.exports = UserModel;
