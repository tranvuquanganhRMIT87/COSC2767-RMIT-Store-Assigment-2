const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../index'); 
const Address = require('../models/address');
const authMiddleware = require('../middleware/auth');

jest.mock('../middleware/auth', () => jest.fn());

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

describe('Address API Endpoints', () => {
  let authToken;

  beforeEach(() => {
    authMiddleware.mockImplementation((req, res, next) => {
      req.user = { _id: mongoose.Types.ObjectId() };
      next();
    });
  });

  afterEach(async () => {
    await Address.deleteMany({});
  });

  describe('POST /add', () => {
    it('should add a new address and return success', async () => {
      const addressData = {
        street: '123 Main St',
        city: 'Testville',
        state: 'TS',
        postalCode: '12345',
      };

      const response = await request(app)
        .post('/api/address/add')
        .send(addressData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.address).toHaveProperty('_id');
    });

    it('should handle validation errors', async () => {
      const response = await request(app)
        .post('/api/address/add')
        .send({})
        .expect(400);

      expect(response.body.error).toBe('Your request could not be processed. Please try again.');
    });
  });

  describe('GET /', () => {
    it('should fetch all addresses for the user', async () => {
      const userId = mongoose.Types.ObjectId();

      await Address.create({
        street: '123 Main St',
        city: 'Testville',
        state: 'TS',
        postalCode: '12345',
        user: userId,
      });

      const response = await request(app)
        .get('/api/address/')
        .expect(200);

      expect(response.body.addresses.length).toBeGreaterThan(0);
    });
  });

  describe('GET /:id', () => {
    it('should fetch a single address by ID', async () => {
      const address = await Address.create({
        street: '123 Main St',
        city: 'Testville',
        state: 'TS',
        postalCode: '12345',
      });

      const response = await request(app)
        .get(`/api/address/${address._id}`)
        .expect(200);

      expect(response.body.address).toHaveProperty('_id', address._id.toString());
    });

    it('should return 404 for a non-existent address', async () => {
      const nonExistentId = mongoose.Types.ObjectId();

      const response = await request(app)
        .get(`/api/address/${nonExistentId}`)
        .expect(404);

      expect(response.body.message).toContain('Cannot find Address');
    });
  });

  describe('PUT /:id', () => {
    it('should update an address and return success', async () => {
      const address = await Address.create({
        street: '123 Main St',
        city: 'Testville',
        state: 'TS',
        postalCode: '12345',
      });

      const updatedData = {
        city: 'UpdatedCity',
      };

      const response = await request(app)
        .put(`/api/address/${address._id}`)
        .send(updatedData)
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe('DELETE /delete/:id', () => {
    it('should delete an address and return success', async () => {
      const address = await Address.create({
        street: '123 Main St',
        city: 'Testville',
        state: 'TS',
        postalCode: '12345',
      });

      const response = await request(app)
        .delete(`/api/address/delete/${address._id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });
});
