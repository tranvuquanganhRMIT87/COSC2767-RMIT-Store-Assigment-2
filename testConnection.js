const mongoose = require('mongoose');
require('dotenv').config();

(async () => {
  try {
    const mongoUri = 'mongodb://localhost:27017/testdb';
    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoUri); 
    console.log('Successfully connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
})();
