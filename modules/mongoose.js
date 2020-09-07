'use strict';
const mongoose = require('mongoose');
const config = require('./../config/index');
require('dotenv').config();

mongoose.connect(process.env.mongoLink, config.get('mongoose').options);

module.exports = mongoose;