const mongoose = require('mongoose');
const setupDB = require('../utils/db');

describe('setupDB Integration Test', () => {
  afterAll(async () => {
    await mongoose.disconnect();
  });

  // it('should successfully connect to MongoDB', async () => {
  //   const result = await setupDB();
  //   expect(result).toBeUndefined(); 
  //   expect(mongoose.connection.readyState).toBe(1); 
  // });

  it('should handle connection errors gracefully', async () => {
    jest.spyOn(mongoose, 'connect').mockImplementationOnce(() => {
      throw new Error('Connection failed');
    });

    const result = await setupDB();
    expect(result).toBeNull(); 
  });
});
