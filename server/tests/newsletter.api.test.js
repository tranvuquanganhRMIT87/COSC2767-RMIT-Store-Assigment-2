const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../index'); 

// Mock the mailchimp and mailgun services
jest.mock('../services/mailchimp.js', () => ({
  subscribeToNewsletter: jest.fn(),
}));

jest.mock('../services/mailgun.js', () => ({
  sendEmail: jest.fn(),
}));

const mailchimp = require('../../services/mailchimp');
const mailgun = require('../../services/mailgun');

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

describe('Newsletter API Integration Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /subscribe', () => {
    it('should subscribe a user successfully', async () => {
      mailchimp.subscribeToNewsletter.mockResolvedValue({ status: 200 });
      mailgun.sendEmail.mockResolvedValue(true);

      const response = await request(app)
        .post('/api/newsletter/subscribe')
        .send({ email: 'testuser@example.com' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('You have successfully subscribed to the newsletter');
      expect(mailchimp.subscribeToNewsletter).toHaveBeenCalledWith('testuser@example.com');
      expect(mailgun.sendEmail).toHaveBeenCalledWith('testuser@example.com', 'newsletter-subscription');
    });

    it('should return error if email is missing', async () => {
      const response = await request(app)
        .post('/api/newsletter/subscribe')
        .send({})
        .expect(400);

      expect(response.body.error).toBe('You must enter an email address.');
      expect(mailchimp.subscribeToNewsletter).not.toHaveBeenCalled();
      expect(mailgun.sendEmail).not.toHaveBeenCalled();
    });

    it('should return error if mailchimp subscription fails', async () => {
      mailchimp.subscribeToNewsletter.mockResolvedValue({ status: 400, title: 'Invalid email' });

      const response = await request(app)
        .post('/api/newsletter/subscribe')
        .send({ email: 'invalid-email' })
        .expect(400);

      expect(response.body.error).toBe('Invalid email');
      expect(mailchimp.subscribeToNewsletter).toHaveBeenCalledWith('invalid-email');
      expect(mailgun.sendEmail).not.toHaveBeenCalled();
    });
  });
});
