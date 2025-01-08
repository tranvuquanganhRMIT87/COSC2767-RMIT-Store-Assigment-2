const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../index'); 
const User = require('../models/user');

beforeAll(async () => {
  await mongoose.connect('mongodb://localhost:27017/testdb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe('User API Integration Tests', () => {
  let adminToken;
  let userToken;

  beforeEach(async () => {
    adminToken = 'mockAdminToken';
    userToken = 'mockUserToken';
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  describe('GET /search', () => {
    it('should allow an admin to search for users', async () => {
      await User.create({
        firstName: 'Searchable',
        lastName: 'User',
        email: 'searchuser@example.com',
      });

      const response = await request(app)
        .get('/api/user/search?search=Searchable')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.users.length).toBeGreaterThan(0);
    });
  });

  describe('GET /', () => {
    it('should fetch all users with pagination', async () => {
      await User.create({
        firstName: 'Test',
        lastName: 'User',
        email: 'testuser@example.com',
      });

      const response = await request(app)
        .get('/api/user?page=1&limit=10')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.users.length).toBeGreaterThan(0);
      expect(response.body).toHaveProperty('totalPages');
      expect(response.body).toHaveProperty('currentPage');
    });
  });

  describe('GET /me', () => {
    it('should fetch the authenticated user profile', async () => {
      const user = await User.create({
        firstName: 'Auth',
        lastName: 'User',
        email: 'authuser@example.com',
      });

      const response = await request(app)
        .get('/api/user/me')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.user).toHaveProperty('email', 'authuser@example.com');
    });
  });

  describe('PUT /', () => {
    it('should update the authenticated user profile', async () => {
      const user = await User.create({
        firstName: 'Updatable',
        lastName: 'User',
        email: 'updatableuser@example.com',
      });

      const response = await request(app)
        .put('/api/user')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ profile: { firstName: 'Updated', lastName: 'User' } })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.user).toHaveProperty('firstName', 'Updated');
    });
  });
});
