const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../index'); 
const Contact = require('../models/contact');

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

describe('Contact API Integration Tests', () => {
  afterEach(async () => {
    await Contact.deleteMany({});
  });

  describe('POST /add', () => {
    it('should create a new contact request successfully', async () => {
      const contactData = {
        name: 'Test User',
        email: 'testuser@example.com',
        message: 'This is a test message.',
      };

      const response = await request(app)
        .post('/api/contact/add')
        .send(contactData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.contact).toHaveProperty('_id');
      expect(response.body.message).toContain(contactData.email);
    });

    it('should return an error if email is missing', async () => {
      const contactData = {
        name: 'Test User',
        message: 'This is a test message.',
      };

      const response = await request(app)
        .post('/api/contact/add')
        .send(contactData)
        .expect(400);

      expect(response.body.error).toBe('You must enter an email address.');
    });

    it('should return an error if name is missing', async () => {
      const contactData = {
        email: 'testuser@example.com',
        message: 'This is a test message.',
      };

      const response = await request(app)
        .post('/api/contact/add')
        .send(contactData)
        .expect(400);

      expect(response.body.error).toBe('You must enter description & name.');
    });

    it('should return an error if message is missing', async () => {
      const contactData = {
        name: 'Test User',
        email: 'testuser@example.com',
      };

      const response = await request(app)
        .post('/api/contact/add')
        .send(contactData)
        .expect(400);

      expect(response.body.error).toBe('You must enter a message.');
    });

    it('should return an error if a contact already exists for the same email', async () => {
      const contactData = {
        name: 'Test User',
        email: 'testuser@example.com',
        message: 'This is a test message.',
      };

      await Contact.create(contactData);

      const response = await request(app)
        .post('/api/contact/add')
        .send(contactData)
        .expect(400);

      expect(response.body.error).toBe('A request already existed for same email address');
    });
  });
});
