// Setup test environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test_secret';
process.env.JWT_EXPIRES_IN = '1h';
process.env.MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/crt_test';

// Mock jsonwebtoken
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn().mockReturnValue('mock-jwt-token'),
  verify: jest.fn().mockReturnValue({ id: 'mock-user-id', role: 'benevole' })
}));

// Mock mongoose
jest.mock('mongoose', () => ({
  connect: jest.fn().mockResolvedValue({ connection: { host: 'mock-db-connection' } }),
  disconnect: jest.fn().mockResolvedValue(true),
  Schema: jest.fn().mockImplementation(() => ({
    pre: jest.fn().mockReturnThis(),
    methods: {},
    statics: {}
  })),
  model: jest.fn().mockImplementation(() => function() {}),
  Types: {
    ObjectId: jest.fn().mockImplementation(id => id)
  }
}));

// Mock DB connection function
jest.mock('../config/db', () => jest.fn().mockResolvedValue({
  connection: { host: 'mock-db-host' }
}));

// Silence console logs during tests unless DEBUG is enabled
if (!process.env.DEBUG) {
  // Store original console methods
  global.consoleBackup = {
    log: console.log,
    error: console.error,
    warn: console.warn
  };
  
  // Replace with empty functions during tests
  console.log = jest.fn();
  console.error = jest.fn();
  console.warn = jest.fn();
}

// Prevent process.exit from killing tests
const originalExit = process.exit;
process.exit = jest.fn();

afterAll(() => {
  process.exit = originalExit;
});

// Increase timeout for tests
jest.setTimeout(10000);

// Mock User model
jest.mock('../models/User', () => {
  const mockUserModel = function(userData = {}) {
    this._id = userData._id || 'mock-user-id';
    this.firstName = userData.firstName || 'Test';
    this.lastName = userData.lastName || 'User';
    this.email = userData.email || 'test@example.com';
    this.phone = userData.phone || '+21612345678';
    this.cin = userData.cin || '12345678';
    this.password = userData.password || 'password123';
    this.role = userData.role || 'benevole';
    this.status = userData.status || 'pending';
    this.passwordChangedAt = null;
    this.passwordResetToken = null;
    this.passwordResetExpires = null;
    this.createdAt = new Date();
  };

  // Instance methods
  mockUserModel.prototype.save = jest.fn().mockImplementation(function() {
    if (this.password && !this.password.startsWith('$2')) {
      this.password = '$2b$12$mock-hashed-password';
    }
    return Promise.resolve(this);
  });

  mockUserModel.prototype.comparePassword = jest.fn().mockResolvedValue(true);
  mockUserModel.prototype.changedPasswordAfter = jest.fn().mockReturnValue(false);

  mockUserModel.prototype.createPasswordResetToken = jest.fn().mockImplementation(function() {
    this.passwordResetToken = 'mock-hashed-token';
    this.passwordResetExpires = new Date(Date.now() + 3600000);
    return 'mock-reset-token';
  });

  // Static methods
  mockUserModel.findOne = jest.fn().mockImplementation(() => {
    return {
      select: jest.fn().mockResolvedValue({
        _id: 'mock-user-id',
        email: 'test@example.com',
        password: '$2b$12$mock-hashed-password',
        role: 'benevole',
        status: 'approved',
        comparePassword: jest.fn().mockResolvedValue(true)
      })
    };
  });

  mockUserModel.findById = jest.fn().mockImplementation((id) => {
    return Promise.resolve({
      _id: id || 'mock-user-id',
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      phone: '+21612345678',
      cin: '12345678',
      role: 'benevole',
      status: 'approved',
      select: jest.fn().mockResolvedValue({
        password: '$2b$12$mock-hashed-password'
      })
    });
  });

  mockUserModel.create = jest.fn().mockImplementation((data) => {
    return Promise.resolve({
      _id: 'new-user-id',
      ...data,
      role: data.role || 'benevole',
      status: data.status || 'pending'
    });
  });

  mockUserModel.find = jest.fn().mockReturnValue({
    select: jest.fn().mockResolvedValue([
      { _id: 'user1', firstName: 'John', lastName: 'Doe', email: 'john@example.com', status: 'pending' },
      { _id: 'user2', firstName: 'Jane', lastName: 'Doe', email: 'jane@example.com', status: 'pending' }
    ]),
    sort: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis()
  });

  mockUserModel.findByIdAndUpdate = jest.fn().mockImplementation((id, data) => {
    return Promise.resolve({
      _id: id,
      ...data,
      firstName: 'Updated',
      lastName: 'User',
      email: 'updated@example.com'
    });
  });

  mockUserModel.countDocuments = jest.fn().mockResolvedValue(10);

  mockUserModel.aggregate = jest.fn().mockResolvedValue([
    { _id: 'benevole', count: 5 },
    { _id: 'donateur', count: 3 },
    { _id: 'admin', count: 2 }
  ]);

  return mockUserModel;
});

// Mock crypto
jest.mock('crypto', () => ({
  randomBytes: jest.fn().mockImplementation(() => ({
    toString: jest.fn().mockReturnValue('mock-reset-token')
  })),
  createHash: jest.fn().mockImplementation(() => ({
    update: jest.fn().mockReturnThis(),
    digest: jest.fn().mockReturnValue('mock-hashed-token')
  }))
}));

// Prevent console output during tests
const originalLog = console.log;
const originalError = console.error;
const originalWarn = console.warn;

// Silence logs unless we're in debug mode
if (process.env.JEST_HIDE_LOGS) {
  console.log = jest.fn();
  console.error = jest.fn();
  console.warn = jest.fn();
}

// Restore console after tests
afterAll(() => {
  console.log = originalLog;
  console.error = originalError;
  console.warn = originalWarn;
});

// Increase timeout for Mongoose operations
jest.setTimeout(10000);

// Cleanup before exit
afterAll(async () => {
  // Restore console functions
  if (!process.env.DEBUG && global.consoleBackup) {
    console.log = global.consoleBackup.log;
    console.error = global.consoleBackup.error;
    console.warn = global.consoleBackup.warn;
  }
});
