const mongoose = require('mongoose');
const User = require('../models/user');

describe('User Model', () => {
  it('should create a user with default role and provider', async () => {
    const user = new User({
      email: 'user@example.com',
      firstName: 'John',
      lastName: 'Doe',
    });

    const savedUser = await user.save();

    expect(savedUser.role).toBe('ROLE MEMBER');
    expect(savedUser.provider).toBe('Email'); 
    expect(savedUser.created).toBeDefined(); 
  });

  it('should not require email when provider is set to "Google"', async () => {
    const user = new User({
      provider: 'Google', 
    });

    const error = await user.validate(); 
    expect(error).toBeUndefined();
  });
});
