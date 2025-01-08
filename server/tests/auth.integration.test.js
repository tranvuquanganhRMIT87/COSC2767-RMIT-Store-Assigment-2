const request = require('supertest');
const express = require('express');
const passport = require('passport');
const auth = require('../middleware/auth');

// Mock Passport for JWT authentication
jest.mock('passport', () => ({
  authenticate: jest.fn(() => (req, res, next) => {
    if (req.headers.authorization === 'Bearer valid-token') {
      req.user = { id: '123', role: 'User' }; // Mock authenticated user
      return next();
    }
    return res.status(401).send('Unauthorized');
  }),
}));

const app = express();

// Protected route for testing
app.get('/protected', auth, (req, res) => {
  res.status(200).send('Access granted');
});

describe('Auth Middleware Integration Test', () => {
  it('should grant access with a valid JWT', async () => {
    const response = await request(app)
      .get('/protected')
      .set('Authorization', 'Bearer valid-token');

    expect(response.status).toBe(200);
    expect(response.text).toBe('Access granted');
  });

  it('should deny access with an invalid JWT', async () => {
    const response = await request(app)
      .get('/protected')
      .set('Authorization', 'Bearer invalid-token');

    expect(response.status).toBe(401);
    expect(response.text).toBe('Unauthorized');
  });

  it('should deny access without a JWT', async () => {
    const response = await request(app).get('/protected');

    expect(response.status).toBe(401);
    expect(response.text).toBe('Unauthorized');
  });
});
