const mongoose = require('mongoose');
const Cart = require('../models/cart');
const { CART_ITEM_STATUS } = require('../constants/index');

describe('Cart and CartItem Models', () => {
  beforeAll(async () => {
    const { MongoMemoryServer } = require('mongodb-memory-server');
    const mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }

    await mongoose.connect(uri); 
  });


  afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();
  });

  it('should create a cart item with default fields', async () => {
    const cartItem = {
      product: new mongoose.Types.ObjectId(),
      quantity: 2,
      purchasePrice: 50,
    };

    const cart = new Cart({
      products: [cartItem],
      user: new mongoose.Types.ObjectId(),
    });

    const savedCart = await cart.save();

    expect(savedCart.products.length).toBe(1);
    const savedCartItem = savedCart.products[0];
    expect(savedCartItem.status).toBe(CART_ITEM_STATUS.Not_processed);
    expect(savedCartItem.totalPrice).toBe(0);
    expect(savedCartItem.priceWithTax).toBe(0);
    expect(savedCartItem.totalTax).toBe(0);
  });

  it('should fail validation if a required field in CartItem is missing', async () => {
    const cartItem = {
      quantity: 1, 
    };
  
    const cart = new Cart({
      products: [cartItem],
      user: new mongoose.Types.ObjectId(),
    });
  
    await cart.validate(); 
    expect(cart.products[0].product).toBeUndefined(); 
  });
  

  it('should create a cart with default created date', async () => {
    const cart = new Cart({
      products: [],
      user: new mongoose.Types.ObjectId(),
    });

    const savedCart = await cart.save();

    expect(savedCart.created).toBeDefined();
    expect(savedCart.updated).toBeUndefined(); 
  });

  it('should support updating a cart with new products', async () => {
    const cart = new Cart({
      products: [],
      user: new mongoose.Types.ObjectId(),
    });

    const savedCart = await cart.save();

    const newCartItem = {
      product: new mongoose.Types.ObjectId(),
      quantity: 3,
      purchasePrice: 20,
    };

    savedCart.products.push(newCartItem);
    await savedCart.save();

    expect(savedCart.products.length).toBe(1);
    expect(savedCart.products[0].quantity).toBe(3);
  });

  it('should enforce status enum in CartItem', async () => {
    const invalidCartItem = {
      product: new mongoose.Types.ObjectId(),
      quantity: 1,
      status: 'Invalid_Status', // Invalid status
    };

    const cart = new Cart({
      products: [invalidCartItem],
      user: new mongoose.Types.ObjectId(),
    });

    await expect(cart.validate()).rejects.toThrow();
  });
});
