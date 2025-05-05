const mongoose = require('mongoose');

// Enable mongoose debugging in debug mode
if (process.env.DEBUG) {
  mongoose.set('debug', true);
}

/**
 * Connect to the test database
 */
exports.connectTestDB = async () => {
  const mongoURI = process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/crt_test';
  
  try {
    // If we're already connected, return
    if (mongoose.connection.readyState === 1) {
      return;
    }
    
    // Connect to test database
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected to test database');
  } catch (error) {
    console.error('Error connecting to test database:', error);
    throw error;
  }
};

/**
 * Disconnect from test database
 */
exports.disconnectTestDB = async () => {
  try {
    await mongoose.disconnect();
    console.log('Disconnected from test database');
  } catch (error) {
    console.error('Error disconnecting from test database:', error);
  }
};

/**
 * Clear all collections in the test database
 */
exports.clearDatabase = async () => {
  if (mongoose.connection.readyState !== 1) {
    await exports.connectTestDB();
  }
  
  const collections = mongoose.connection.collections;
  
  for (const key in collections) {
    const collection = collections[key];
    try {
      // Use deleteMany directly on the collection
      await collection.deleteMany({});
    } catch (error) {
      console.error(`Error clearing collection ${key}:`, error);
    }
  }
};

/**
 * Setup and teardown helpers for Jest
 */
exports.setupTestDB = () => {
  // Setup before all tests
  beforeAll(async () => {
    await exports.connectTestDB();
  });
  
  // Clean database before each test
  beforeEach(async () => {
    await exports.clearDatabase();
  });
  
  // Disconnect after all tests
  afterAll(async () => {
    await exports.disconnectTestDB();
  });
};
