const config = require('../../config');
import Debug from 'debug';
import "dotenv/config"
import mongoose from "mongoose";

const debug = Debug('ed-commodities-api:server');
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

// @ts-ignore
mongoose.connect(process.env.MONGO_LINK, config.get('mongoose').options);

module.exports = mongoose;
