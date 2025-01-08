const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../index'); 
const Cart = require('../models/cart');
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

describe('Cart API Integration Tests', () => {
  let userToken;

  beforeEach(async () => {
    // Setup tokens and database state if necessary.
    userToken = 'mockUserToken';
  });

  afterEach(async () => {
    await Cart.deleteMany({});
    await Product.deleteMany({});
  });

  describe('POST /add', () => {
    it('should create a new cart for a user', async () => {
      const product = await Product.create({
        name: 'Test Product',
        price: 100,
        quantity: 50,
      });

      const cartData = {
        products: [
          {
            product: product._id,
            quantity: 2,
          },
        ],
      };

      const response = await request(app)
        .post('/api/cart/add')
        .set('Authorization', `Bearer ${userToken}`)
        .send(cartData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body).toHaveProperty('cartId');
    });

    it('should return error if no products are provided', async () => {
      const response = await request(app)
        .post('/api/cart/add')
        .set('Authorization', `Bearer ${userToken}`)
        .send({})
        .expect(400);

      expect(response.body.error).toBe('Your request could not be processed. Please try again.');
    });
  });

  describe('DELETE /delete/:cartId', () => {
    it('should delete a cart by ID', async () => {
      const cart = await Cart.create({
        user: mongoose.Types.ObjectId(),
        products: [],
      });

      const response = await request(app)
        .delete(`/api/cart/delete/${cart._id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe('POST /add/:cartId', () => {
    it('should add a product to an existing cart', async () => {
      const cart = await Cart.create({
        user: mongoose.Types.ObjectId(),
        products: [],
      });

      const product = await Product.create({
        name: 'Test Product',
        price: 100,
        quantity: 50,
      });

      const response = await request(app)
        .post(`/api/cart/add/${cart._id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ product: { product: product._id, quantity: 1 } })
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe('DELETE /delete/:cartId/:productId', () => {
    it('should remove a product from a cart', async () => {
      const product = await Product.create({
        name: 'Test Product',
        price: 100,
        quantity: 50,
      });

      const cart = await Cart.create({
        user: mongoose.Types.ObjectId(),
        products: [
          {
            product: product._id,
            quantity: 1,
          },
        ],
      });

      const response = await request(app)
        .delete(`/api/cart/delete/${cart._id}/${product._id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });
});
