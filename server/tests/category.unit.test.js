const mongoose = require('mongoose');
const Category = require('../models/category');

describe('Category Model', () => {
  afterAll(async () => {
    await mongoose.disconnect();
  });

  it('should create a category with default values', async () => {
    const category = new Category({
      name: 'Test Category',
      description: 'Category Description',
    });

    const savedCategory = await category.save();

    expect(savedCategory.slug).toBeDefined(); 
    expect(savedCategory.isActive).toBe(true);
    expect(savedCategory.created).toBeDefined(); 
  });

  it('should allow creation with no fields if no fields are required', async () => {
    const category = new Category({});
    await expect(category.validate()).resolves.not.toThrow();
  });  
});
