const mongoose = require('mongoose');
const config = require('../../config');
const debug = require('debug')('ed-commodities-api:server');
require('dotenv').config();

const connection = mongoose.connection;

connection.on('connecting', () => {
  debug('Connecting to MongoDB');
});

connection.on('connected', () => {
  debug('Connected to MongoDB');
});

connection.on('error', (err) => {
  debug('Error: ' + err);
  mongoose.disconnect();
});

connection.on('disconnected', () => {
  debug('MongoDB disconnected!');
});

mongoose.connect(process.env.MONGO_LINK, config.get('mongoose').options);

module.exports = mongoose;
