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
  }
});
module.exports = config;