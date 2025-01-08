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

describe('Auth API Integration Tests', () => {
  let testUser;

  beforeEach(async () => {
    testUser = await User.create({
      email: 'testuser@example.com',
      firstName: 'Test',
      lastName: 'User',
      password: await bcrypt.hash('password123', 10),
    });
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  describe('POST /login', () => {
    it('should login successfully with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'testuser@example.com', password: 'password123' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body).toHaveProperty('token');
      expect(response.body.user.email).toBe('testuser@example.com');
    });

    it('should return error for invalid email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'invaliduser@example.com', password: 'password123' })
        .expect(400);

      expect(response.body.error).toBe('No user found for this email address.');
    });

    it('should return error for incorrect password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'testuser@example.com', password: 'wrongpassword' })
        .expect(400);

      expect(response.body.error).toBe('Password Incorrect');
    });
  });

  describe('POST /register', () => {
    it('should register a new user successfully', async () => {
      const newUser = {
        email: 'newuser@example.com',
        firstName: 'New',
        lastName: 'User',
        password: 'password123',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(newUser)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.user.email).toBe('newuser@example.com');

      const userInDb = await User.findOne({ email: 'newuser@example.com' });
      expect(userInDb).not.toBeNull();
    });

    it('should return error for existing email', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'testuser@example.com',
          firstName: 'Duplicate',
          lastName: 'User',
          password: 'password123',
        })
        .expect(400);

      expect(response.body.error).toBe('That email address is already in use.');
    });

    it('should return error for missing fields', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({ email: 'missingfields@example.com' })
        .expect(400);

      expect(response.body.error).toContain('You must enter');
    });
  });
});
