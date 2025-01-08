const mongoose = require('mongoose');
const Wishlist = require('../models/wishlist');

describe('Wishlist Model', () => {
  afterAll(async () => {
    await mongoose.disconnect();
  });

  it('should create a wishlist with default values', async () => {
    const wishlist = new Wishlist({
      user: new mongoose.Types.ObjectId(),
      product: new mongoose.Types.ObjectId(),
    });

    const savedWishlist = await wishlist.save();

    expect(savedWishlist.isLiked).toBe(false);
    expect(savedWishlist.created).toBeDefined(); 
  });

  it('should fail validation if required fields are missing', async () => {
    const wishlist = new Wishlist({});
    await expect(wishlist.validate()).resolves.not.toThrow();
  });
});
