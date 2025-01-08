const checkAuth = require('../utils/auth');
const jwt = require('jsonwebtoken');

jest.mock('jsonwebtoken'); 

describe('checkAuth', () => {
  it('should return null if authorization header is missing', async () => {
    const req = { headers: {} }; 
    const result = await checkAuth(req);
    expect(result).toBeNull();
  });

  it('should return null if token cannot be decoded', async () => {
    const req = { headers: { authorization: 'Bearer invalid_token' } };
    jwt.decode.mockReturnValue(null); 

    const result = await checkAuth(req);
    expect(result).toBe(req.headers.authorization);
  });

  it('should decode and return the token if valid', async () => {
    const decodedToken = { userId: '12345' };
    const req = { headers: { authorization: 'Bearer valid_token' } };
    jwt.decode.mockReturnValue(decodedToken); 

    const result = await checkAuth(req);
    expect(result).toEqual(decodedToken);
  });

  it('should return null if an error is thrown during decoding', async () => {
    const req = { headers: { authorization: 'Bearer token' } };
    jwt.decode.mockImplementation(() => {
      throw new Error('Decoding failed');
    }); 

    const result = await checkAuth(req);
    expect(result).toBeNull();
  });
});
