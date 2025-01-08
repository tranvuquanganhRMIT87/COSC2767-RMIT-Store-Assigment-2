const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../index');
const Brand = require('../models/brand');
const Product = require('../models/product');
const Merchant = require('../models/merchant');

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

describe('Brand API Integration Tests', () => {
  let adminToken;
  let merchantToken;

  beforeEach(async () => {
    // Setup tokens and database state if necessary.
    // Mock authentication tokens for different roles (e.g., Admin and Merchant).
    adminToken = 'mockAdminToken';
    merchantToken = 'mockMerchantToken';
  });

  afterEach(async () => {
    await Brand.deleteMany({});
    await Product.deleteMany({});
    await Merchant.deleteMany({});
  });

  describe('POST /add', () => {
    it('should allow an admin to add a new brand', async () => {
      const brandData = {
        name: 'Test Brand',
        description: 'A description of the test brand',
        isActive: true,
      };

      const response = await request(app)
        .post('/api/brand/add')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(brandData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.brand).toHaveProperty('_id');
    });

    it('should return error if name or description is missing', async () => {
      const response = await request(app)
        .post('/api/brand/add')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({})
        .expect(400);

      expect(response.body.error).toBe('You must enter description & name.');
    });
  });

  describe('GET /list', () => {
    it('should fetch all active brands', async () => {
      await Brand.create({
        name: 'Brand 1',
        description: 'Active Brand',
        isActive: true,
      });

      const response = await request(app)
        .get('/api/brand/list')
        .expect(200);

      expect(response.body.brands.length).toBeGreaterThan(0);
    });
  });

  describe('GET /:id', () => {
    it('should fetch a brand by ID', async () => {
      const brand = await Brand.create({
        name: 'Brand 1',
        description: 'Brand description',
        isActive: true,
      });

      const response = await request(app)
        .get(`/api/brand/${brand._id}`)
        .expect(200);

      expect(response.body.brand).toHaveProperty('_id', brand._id.toString());
    });

    it('should return 404 for a non-existent brand', async () => {
      const nonExistentId = mongoose.Types.ObjectId();

      const response = await request(app)
        .get(`/api/brand/${nonExistentId}`)
        .expect(404);

      expect(response.body.message).toContain('Cannot find brand');
    });
  });

  describe('PUT /:id', () => {
    it('should update a brand successfully', async () => {
      const brand = await Brand.create({
        name: 'Brand 1',
        description: 'Brand description',
        isActive: true,
      });

      const updateData = {
        brand: { name: 'Updated Brand', description: 'Updated description' },
      };

      const response = await request(app)
        .put(`/api/brand/${brand._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe('DELETE /delete/:id', () => {
    it('should delete a brand successfully', async () => {
      const brand = await Brand.create({
        name: 'Brand 1',
        description: 'Brand description',
        isActive: true,
      });

      const response = await request(app)
        .delete(`/api/brand/delete/${brand._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });
});
