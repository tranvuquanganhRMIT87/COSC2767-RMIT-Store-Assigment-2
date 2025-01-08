const Product = require('../models/product.js');

describe('Product Model', () => {
  it('should create a product with default fields', async () => {
    const product = new Product({
      name: 'Sample Product',
      price: 100,
    });

    const savedProduct = await product.save();

    expect(savedProduct.slug).toBeDefined(); 
    expect(savedProduct.isActive).toBe(true); 
    expect(savedProduct.created).toBeDefined(); 
  });

  it('should allow saving a product without optional fields', async () => {
    const product = new Product({
      name: 'Another Product',
    });

    const savedProduct = await product.save();

    expect(savedProduct.name).toBe('Another Product');
    expect(savedProduct.slug).toBeDefined(); 
    expect(savedProduct.price).toBeUndefined(); 
    expect(savedProduct.isActive).toBe(true); 
  });

  it('should fail validation for invalid field types', async () => {
    const product = new Product({
      name: 'Invalid Product',
      price: 'Not a Number',
    });

    try {
      await product.validate();
      throw new Error('Validation should have failed but passed.');
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error.errors.price).toBeDefined(); 
    }
  });
});
