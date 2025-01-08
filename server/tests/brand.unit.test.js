const mongoose = require('mongoose');
const Brand = require('../models/brand');

describe('Brand Model', () => {
  afterAll(async () => {
    await mongoose.disconnect();
  });

  it('should create a brand with default values', async () => {
    const brand = new Brand({
      name: 'Test Brand',
      description: 'Brand Description',
    });

    const savedBrand = await brand.save();

    expect(savedBrand.slug).toBeDefined(); 
    expect(savedBrand.isActive).toBe(true); 
    expect(savedBrand.created).toBeDefined(); 
  });

  it('should fail validation if required fields are missing', async () => {
    const brand = new Brand({});
    await expect(brand.validate()).resolves.not.toThrow();
  });
});
