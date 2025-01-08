const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../index');
const Product = require('../models/product');
const Brand = require('../models/brand');
const Category = require('../models/category');

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

describe('Product API Integration Tests', () => {
  let adminToken;

  beforeEach(async () => {
    adminToken = 'mockAdminToken';
  });

  afterEach(async () => {
    await Product.deleteMany({});
    await Brand.deleteMany({});
    await Category.deleteMany({});
  });

  describe('POST /add', () => {
    it('should allow an admin to add a new product', async () => {
      const productData = {
        sku: 'TESTSKU123',
        name: 'Test Product',
        description: 'A test product description',
        quantity: 10,
        price: 100,
        taxable: true,
        isActive: true,
        brand: mongoose.Types.ObjectId(),
      };

      const response = await request(app)
        .post('/api/product/add')
        .set('Authorization', `Bearer ${adminToken}`)
        .field('sku', productData.sku)
        .field('name', productData.name)
        .field('description', productData.description)
        .field('quantity', productData.quantity)
        .field('price', productData.price)
        .field('taxable', productData.taxable)
        .field('isActive', productData.isActive)
        .field('brand', productData.brand.toString())
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.product).toHaveProperty('_id');
    });

    it('should return error if SKU is missing', async () => {
      const response = await request(app)
        .post('/api/product/add')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'Test Product' })
        .expect(400);

      expect(response.body.error).toBe('You must enter sku.');
    });
  });

  describe('GET /list', () => {
    it('should fetch all products with pagination and filters', async () => {
      await Product.create({
        sku: 'TESTSKU123',
        name: 'Test Product',
        description: 'A test product description',
        quantity: 10,
        price: 100,
        isActive: true,
      });

      const response = await request(app)
        .get('/api/product/list?page=1&limit=10')
        .expect(200);

      expect(response.body.products.length).toBeGreaterThan(0);
    });
  });

  describe('GET /item/:slug', () => {
    it('should fetch a product by slug', async () => {
      const product = await Product.create({
        sku: 'TESTSKU123',
        name: 'Test Product',
        description: 'A test product description',
        slug: 'test-product',
        isActive: true,
      });

      const response = await request(app)
        .get(`/api/product/item/${product.slug}`)
        .expect(200);

      expect(response.body.product).toHaveProperty('_id', product._id.toString());
    });
  });

  describe('DELETE /delete/:id', () => {
    it('should delete a product successfully', async () => {
      const product = await Product.create({
        sku: 'TESTSKU123',
        name: 'Test Product',
        description: 'A test product description',
        quantity: 10,
        price: 100,
        isActive: true,
      });

      const response = await request(app)
        .delete(`/api/product/delete/${product._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });
});
