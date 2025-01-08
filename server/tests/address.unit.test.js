const mongoose = require('mongoose');
const Address = require('../models/address');

describe('Address Model', () => {
  afterAll(async () => {
    await mongoose.disconnect();
  });

  it('should create an address with default values', async () => {
    const address = new Address({
      address: '123 Main St',
      city: 'Springfield',
      state: 'IL',
      country: 'USA',
      zipCode: '62701',
    });

    const savedAddress = await address.save();

    expect(savedAddress.isDefault).toBe(false); 
    expect(savedAddress.created).toBeDefined(); 
  });

  it('should allow creation with no fields if no fields are required', async () => {
    const address = new Address({});
    await expect(address.validate()).resolves.not.toThrow();
  });  
});
