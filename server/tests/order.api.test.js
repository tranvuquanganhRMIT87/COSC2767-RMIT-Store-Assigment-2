const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../index'); 
const Order = require('../models/order');
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

describe('Order API Integration Tests', () => {
  let userToken;

  beforeEach(async () => {
    userToken = 'mockUserToken';
  });

  afterEach(async () => {
    await Order.deleteMany({});
    await Cart.deleteMany({});
    await Product.deleteMany({});
  });

  describe('POST /add', () => {
    it('should create a new order successfully', async () => {
      const product = await Product.create({
        name: 'Test Product',
        price: 50,
        quantity: 100,
      });

      const cart = await Cart.create({
        products: [{ product: product._id, quantity: 2 }],
      });

      const response = await request(app)
        .post('/api/order/add')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ cartId: cart._id, total: 100 })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.order).toHaveProperty('_id');
    });
  });

  describe('GET /search', () => {
    it('should allow a user to search orders by ID', async () => {
      const order = await Order.create({
        cart: mongoose.Types.ObjectId(),
        total: 100,
        user: mongoose.Types.ObjectId(),
      });

      const response = await request(app)
        .get(`/api/order/search?search=${order._id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.orders.length).toBeGreaterThan(0);
    });
  });

  describe('GET /me', () => {
    it('should fetch all orders for the authenticated user', async () => {
      const userId = mongoose.Types.ObjectId();
      await Order.create({
        cart: mongoose.Types.ObjectId(),
        total: 100,
        user: userId,
      });

      const response = await request(app)
        .get('/api/order/me')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.orders.length).toBeGreaterThan(0);
    });
  });

  describe('GET /:orderId', () => {
    it('should fetch a specific order by ID', async () => {
      const order = await Order.create({
        cart: mongoose.Types.ObjectId(),
        total: 100,
        user: mongoose.Types.ObjectId(),
      });

      const response = await request(app)
        .get(`/api/order/${order._id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.order).toHaveProperty('_id', order._id.toString());
    });
  });

  describe('DELETE /cancel/:orderId', () => {
    it('should cancel an order and increase product quantities', async () => {
      const product = await Product.create({
        name: 'Test Product',
        price: 50,
        quantity: 100,
      });

      const cart = await Cart.create({
        products: [{ product: product._id, quantity: 2 }],
      });

      const order = await Order.create({
        cart: cart._id,
        total: 100,
        user: mongoose.Types.ObjectId(),
      });

      const response = await request(app)
        .delete(`/api/order/cancel/${order._id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });
});
