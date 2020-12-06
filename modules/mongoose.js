'use strict';
const mongoose = require('mongoose');
const config = require('./../config/index');
require('dotenv').config();

const connection = mongoose.connection;

connection.on('connecting', () => {
  console.log('Connecting');
});

connection.on('connected', () => {
  console.log('Connected');
});

connection.on('error', (err) => {
  console.log('Error: ' + err);
  mongoose.disconnect();
});

connection.on('disconnected', () => {
  console.log('MongoDB disconnected!');
});

mongoose.connect(process.env.mongoLink, config.get('mongoose').options);

module.exports = mongoose;