const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({
  path: path.resolve(__dirname, `../../../../${process.env.NODE_ENV}.env`),
});

module.exports = {
  NODE_ENV: process.env.NODE_ENV || 'dev',
  HOST: process.env.HOST || 'localhost',
  PORT: process.env.PORT || 3000,
  dbConnection: () =>
    mongoose
      .connect(process.env.CONNECTION_URL)
      .then(console.log(`DB connection successfull`))
      .catch((error) => console.log(`Error to connect DB: ${error.message}`)),
};
