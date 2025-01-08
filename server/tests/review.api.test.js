const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../index'); 
const Review = require('../models/review');
const Product = require('../models/product');
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

describe('Review API Integration Tests', () => {
  let userToken;
  
  beforeEach(async () => {
    userToken = 'mockUserToken';
  });

  afterEach(async () => {
    await Review.deleteMany({});
    await Product.deleteMany({});
    await User.deleteMany({});
  });

  describe('POST /add', () => {
    it('should allow a user to add a new review', async () => {
      const product = await Product.create({ name: 'Test Product', slug: 'test-product' });

      const reviewData = {
        content: 'Great product!',
        rating: 5,
        product: product._id,
      };

      const response = await request(app)
        .post('/api/review/add')
        .set('Authorization', `Bearer ${userToken}`)
        .send(reviewData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.review).toHaveProperty('_id');
    });
  });

  describe('GET /', () => {
    it('should fetch all reviews with pagination', async () => {
      await Review.create({
        content: 'Amazing product!',
        rating: 4,
        status: 'Approved',
      });

      const response = await request(app)
        .get('/api/review?page=1&limit=10')
        .expect(200);

      expect(response.body.reviews.length).toBeGreaterThan(0);
    });
  });

  describe('GET /:slug', () => {
    it('should fetch reviews for a specific product by slug', async () => {
      const product = await Product.create({ name: 'Test Product', slug: 'test-product' });

      await Review.create({
        content: 'Amazing product!',
        rating: 5,
        product: product._id,
        status: 'Approved',
      });

      const response = await request(app)
        .get(`/api/review/${product.slug}`)
        .expect(200);

      expect(response.body.reviews.length).toBeGreaterThan(0);
    });
  });

  describe('DELETE /delete/:id', () => {
    it('should delete a review successfully', async () => {
      const review = await Review.create({ content: 'Nice product!', rating: 4 });

      const response = await request(app)
        .delete(`/api/review/delete/${review._id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });
});
