/**
 * Middleware to fix and log login requests
 */
exports.loginRequestInspector = (req, res, next) => {
  console.log('Login request received');
  
  // Check if we have a body with email and password
  if (!req.body || !req.body.email || !req.body.password) {
    console.log('Login request missing credentials');
    
    // For development mode, allow default credentials for testing
    if (process.env.NODE_ENV === 'development') {
      console.log('Development mode: setting default test credentials');
      req.body = {
        email: 'admin@example.com',
        password: 'password123'
      };
    }
  }
  
  next();
};
