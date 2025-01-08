const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../index'); 
const Wishlist = require('../models/wishlist');
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

describe('Wishlist API Integration Tests', () => {
  let userToken;

  beforeEach(async () => {
    userToken = 'mockUserToken';
  });

  afterEach(async () => {
    await Wishlist.deleteMany({});
    await Product.deleteMany({});
  });

  describe('POST /', () => {
    it('should add a product to the wishlist successfully', async () => {
      const product = await Product.create({
        name: 'Test Product',
        slug: 'test-product',
        price: 100,
        imageUrl: 'test-image.jpg',
      });

      const response = await request(app)
        .post('/api/wishlist')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ product: product._id, isLiked: true })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.wishlist).toHaveProperty('_id');
    });

    it('should update an existing product in the wishlist', async () => {
      const product = await Product.create({
        name: 'Test Product',
        slug: 'test-product',
        price: 100,
        imageUrl: 'test-image.jpg',
      });

      const wishlist = await Wishlist.create({
        product: product._id,
        isLiked: false,
        user: mongoose.Types.ObjectId(),
      });

      const response = await request(app)
        .post('/api/wishlist')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ product: product._id, isLiked: true })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.wishlist.isLiked).toBe(true);
    });
  });

  describe('GET /', () => {
    it('should fetch the user wishlist successfully', async () => {
      const product = await Product.create({
        name: 'Test Product',
        slug: 'test-product',
        price: 100,
        imageUrl: 'test-image.jpg',
      });

      await Wishlist.create({
        product: product._id,
        isLiked: true,
        user: mongoose.Types.ObjectId(),
      });

      const response = await request(app)
        .get('/api/wishlist')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.wishlist.length).toBeGreaterThan(0);
    });
  });
});
