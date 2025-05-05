// Mock for MongoDB connection

// Mock the database connection
jest.mock('../../config/db', () => {
  return jest.fn().mockImplementation(() => {
    return Promise.resolve({
      connection: {
        host: 'mock-mongodb-host'
      }
    });
  });
});

// Mock mongoose
jest.mock('mongoose', () => {
  const originalModule = jest.requireActual('mongoose');
  
  return {
    ...originalModule,
    connect: jest.fn().mockResolvedValue({
      connection: { host: 'mock-mongodb-connection' }
    }),
    disconnect: jest.fn().mockResolvedValue(true),
    Schema: jest.fn().mockImplementation((schema) => ({
      ...schema,
      pre: jest.fn().mockReturnThis(),
      methods: {},
      statics: {},
    })),
    model: jest.fn().mockImplementation((modelName) => {
      if (modelName === 'User') {
        return require('../mocks/user.model.mock');
      }
      return {};
    }),
    Types: {
      ObjectId: jest.fn().mockImplementation((id) => id || 'mock-object-id'),
    }
  };
});
