const mongoose = require('mongoose');
const Contact = require('../models/contact');

describe('Contact Model', () => {
  afterAll(async () => {
    await mongoose.disconnect();
  });

  it('should create a contact with default values', async () => {
    const contact = new Contact({
      name: 'John Doe',
      email: 'johndoe@example.com',
      message: 'Hello!',
    });

    const savedContact = await contact.save();

    expect(savedContact.created).toBeDefined(); 
  });

  it('should allow creation with no fields if no fields are required', async () => {
    const contact = new Contact({});
    await expect(contact.validate()).resolves.not.toThrow();
  });
  
});
