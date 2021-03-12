'use strict';
const mongoose = require('mongoose');
const config = require('../../config');
require('dotenv').config();

const connection = mongoose.connection;

connection.on('connecting', () => {
  console.log('Connecting to MongoDB');
});

connection.on('connected', () => {
  console.log('Connected to MongoDB');
});

connection.on('error', (err) => {
  console.log('Error: ' + err);
  mongoose.disconnect();
});

connection.on('disconnected', () => {
  console.log('MongoDB disconnected!');
});

mongoose.connect(process.env.MONGO_LINK, config.get('mongoose').options);

module.exports = mongoose;
