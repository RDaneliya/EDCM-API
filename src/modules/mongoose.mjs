import mongoose from 'mongoose';
import config from '../../config/index.mjs';
import Debug from 'debug';
import dotenv from 'dotenv';

const debug = Debug('ed-commodities-api:mongoose');
dotenv.config();

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

export default mongoose;
