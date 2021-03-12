'use strict';
const Conf = require('conf');
const config = new Conf();

config.set({
  'mongoose': {
    'options': {
      'useNewUrlParser': true,
      'useUnifiedTopology': true,
      'useCreateIndex': true
    }
  },
  'commodity-names': {
    'url': 'https://raw.githubusercontent.com/EDCD/FDevIDs/master/commodity.csv'
  }
});
module.exports = config;
