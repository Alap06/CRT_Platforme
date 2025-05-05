/**
 * JWT Mock for testing
 */
const jwtMock = {
  sign: jest.fn().mockImplementation((payload, secret, options) => {
    return 'mock-jwt-token-' + (payload.id || 'unknown');
  }),
  
  verify: jest.fn().mockImplementation((token, secret) => {
    if (token === 'invalid-token') {
      throw new Error('invalid signature');
    }
    
    if (token === 'expired-token') {
      const err = new Error('jwt expired');
      err.name = 'TokenExpiredError';
      throw err;
    }
    
    if (token.includes('nonexistent')) {
      return { id: 'nonexistent-id', role: 'benevole' };
    }
    
    // Default case - valid token
    return { 
      id: token.split('-').pop() || 'mock-user-id', 
      role: 'benevole',
      iat: Math.floor(Date.now() / 1000) - 100 // issued 100 seconds ago
    };
  })
};

module.exports = jwtMock;
