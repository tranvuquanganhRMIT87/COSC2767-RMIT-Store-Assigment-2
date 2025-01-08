const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../index'); 
const Category = require('../models/category');
const Product = require('../models/product');

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

describe('Category API Integration Tests', () => {
  let adminToken;

  beforeEach(async () => {
    // Setup tokens and database state if necessary.
    adminToken = 'mockAdminToken';
  });

  afterEach(async () => {
    await Category.deleteMany({});
    await Product.deleteMany({});
  });

  describe('POST /add', () => {
    it('should allow an admin to add a new category', async () => {
      const categoryData = {
        name: 'Test Category',
        description: 'A description of the test category',
        isActive: true,
      };

      const response = await request(app)
        .post('/api/category/add')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(categoryData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.category).toHaveProperty('_id');
    });

    it('should return error if name or description is missing', async () => {
      const response = await request(app)
        .post('/api/category/add')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({})
        .expect(400);

      expect(response.body.error).toBe('You must enter description & name.');
    });
  });

  describe('GET /list', () => {
    it('should fetch all active categories', async () => {
      await Category.create({
        name: 'Category 1',
        description: 'Active Category',
        isActive: true,
      });

      const response = await request(app)
        .get('/api/category/list')
        .expect(200);

      expect(response.body.categories.length).toBeGreaterThan(0);
    });
  });

  describe('GET /:id', () => {
    it('should fetch a category by ID', async () => {
      const category = await Category.create({
        name: 'Category 1',
        description: 'Category description',
        isActive: true,
      });

      const response = await request(app)
        .get(`/api/category/${category._id}`)
        .expect(200);

      expect(response.body.category).toHaveProperty('_id', category._id.toString());
    });

    it('should return 404 for a non-existent category', async () => {
      const nonExistentId = mongoose.Types.ObjectId();

      const response = await request(app)
        .get(`/api/category/${nonExistentId}`)
        .expect(404);

      expect(response.body.message).toContain('No Category found.');
    });
  });

  describe('PUT /:id', () => {
    it('should update a category successfully', async () => {
      const category = await Category.create({
        name: 'Category 1',
        description: 'Category description',
        isActive: true,
      });

      const updateData = {
        category: { name: 'Updated Category', description: 'Updated description' },
      };

      const response = await request(app)
        .put(`/api/category/${category._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe('DELETE /delete/:id', () => {
    it('should delete a category successfully', async () => {
      const category = await Category.create({
        name: 'Category 1',
        description: 'Category description',
        isActive: true,
      });

      const response = await request(app)
        .delete(`/api/category/delete/${category._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });
});
