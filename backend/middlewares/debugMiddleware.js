/**
 * Debug middleware for API requests
 * Logs request details to help troubleshoot API issues
 */
exports.debugRequest = (req, res, next) => {
  // Only log in development
  if (process.env.NODE_ENV === 'development') {
    console.log('\n--- API REQUEST DEBUG INFO ---');
    console.log('URL:', req.originalUrl);
    console.log('Method:', req.method);
    console.log('Content-Type:', req.headers['content-type']);
    console.log('Headers:', req.headers);
    
    // Log body if present
    if (req.body && Object.keys(req.body).length > 0) {
      // Hide sensitive info like passwords
      const sanitizedBody = { ...req.body };
      if (sanitizedBody.password) sanitizedBody.password = '********';
      console.log('Body:', sanitizedBody);
    } else {
      console.log('Body: Empty');
    }
  }
  
  next();
};
