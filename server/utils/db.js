// require('dotenv').config();
// const chalk = require('chalk');
// const mongoose = require('mongoose');

// const keys = require('../config/keys');
// const { database } = keys;

// // Function to setup and connect to MongoDB
// const setupDB = async () => {
//   try {
//     // Set mongoose options
//     mongoose.set('useCreateIndex', true);
//     // Connect to MongoDB
//     mongoose
//       .connect(process.env.MONGO_URI, {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//         useFindAndModify: false
//       })
//       .then(() =>
//         console.log(`${chalk.green('✓')} ${chalk.blue('MongoDB Connected!')}`)
//       )
//       .catch(err => console.log(err));
//   } catch (error) {
//     // return null;
//     console.log(error);
//   }
// };



// module.exports = setupDB;


require('dotenv').config();
const chalk = require('chalk');
const mongoose = require('mongoose');

const keys = require('../config/keys');
const { database } = keys;

// Function to setup and connect to MongoDB
const setupDB = async () => {
  try {
    mongoose
      .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
        // remove useFindAndModify if present, as it is not needed in Mongoose v6
      })
      .then(() => {
        console.log(`${chalk.green('✓')} ${chalk.blue('MongoDB Connected!')}`);
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (error) {
    console.log(error);
  }
};

module.exports = setupDB;
