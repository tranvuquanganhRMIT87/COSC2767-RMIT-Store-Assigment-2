const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../index'); 
const Merchant = require('../models/merchant');
const User = require('../models/user');
const Brand = require('../models/brand');

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

describe('Merchant API Integration Tests', () => {
  let adminToken;

  beforeEach(async () => {
    // Setup tokens and database state if necessary.
    adminToken = 'mockAdminToken';
  });

  afterEach(async () => {
    await Merchant.deleteMany({});
    await User.deleteMany({});
    await Brand.deleteMany({});
  });

  describe('POST /add', () => {
    it('should create a new merchant successfully', async () => {
      const merchantData = {
        name: 'Test Merchant',
        email: 'testmerchant@example.com',
        business: 'A test business description',
        phoneNumber: '1234567890',
        brandName: 'Test Brand',
      };

      const response = await request(app)
        .post('/api/merchant/add')
        .send(merchantData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.merchant).toHaveProperty('_id');
      expect(response.body.message).toContain(merchantData.phoneNumber);
    });

    it('should return error if name or email is missing', async () => {
      const response = await request(app)
        .post('/api/merchant/add')
        .send({ business: 'Test Business' })
        .expect(400);

      expect(response.body.error).toBe('You must enter your name and email.');
    });

    it('should return error if a merchant with the same email already exists', async () => {
      const merchantData = {
        name: 'Test Merchant',
        email: 'testmerchant@example.com',
        business: 'A test business description',
        phoneNumber: '1234567890',
        brandName: 'Test Brand',
      };

      await Merchant.create(merchantData);

      const response = await request(app)
        .post('/api/merchant/add')
        .send(merchantData)
        .expect(400);

      expect(response.body.error).toBe('That email address is already in use.');
    });
  });

  describe('GET /search', () => {
    it('should allow an admin to search for merchants', async () => {
      const merchant = await Merchant.create({
        name: 'Searchable Merchant',
        email: 'searchmerchant@example.com',
        business: 'Business for testing search',
        phoneNumber: '9876543210',
        brandName: 'Search Brand',
      });

      const response = await request(app)
        .get('/api/merchant/search?search=Searchable')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.merchants.length).toBeGreaterThan(0);
    });
  });

  describe('GET /', () => {
    it('should fetch all merchants with pagination', async () => {
      await Merchant.create({
        name: 'Merchant 1',
        email: 'merchant1@example.com',
        business: 'Test business 1',
        phoneNumber: '1234567890',
        brandName: 'Brand 1',
      });

      const response = await request(app)
        .get('/api/merchant?page=1&limit=10')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.merchants.length).toBeGreaterThan(0);
      expect(response.body).toHaveProperty('totalPages');
      expect(response.body).toHaveProperty('currentPage');
    });
  });

  describe('PUT /:id/active', () => {
    it('should deactivate a merchant and its brand', async () => {
      const merchant = await Merchant.create({
        name: 'Active Merchant',
        email: 'activemerchant@example.com',
        business: 'Active business',
        phoneNumber: '1234567890',
        brandName: 'Active Brand',
        isActive: true,
      });

      const response = await request(app)
        .put(`/api/merchant/${merchant._id}/active`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ merchant: { isActive: false } })
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe('DELETE /delete/:id', () => {
    it('should delete a merchant and deactivate its brand', async () => {
      const merchant = await Merchant.create({
        name: 'Deletable Merchant',
        email: 'deletemerchant@example.com',
        business: 'Business to delete',
        phoneNumber: '1234567890',
        brandName: 'Delete Brand',
      });

      const response = await request(app)
        .delete(`/api/merchant/delete/${merchant._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('deleted successfully');
    });
  });
});
