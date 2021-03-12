const zlib = require('zlib');
const zmq = require('zeromq');
const sock = zmq.socket('sub');
const Station = require('../models/station');
const delowercase = require('../modules/delowercase');
const debug = require('debug')('ed-commodities-api:server');

module.exports = (address, port) => {
  delowercase.getCommoditiesMap()
      .then((commoditiesMap) => {
        sock.connect(`${address}:${port}`);
        sock.subscribe('');
        sock.on('message', topic => {
          const inflated = JSON.parse(zlib.inflateSync(topic));
          if (inflated.$schemaRef === 'https://eddn.edcd.io/schemas/commodity/3') {
            const message = inflated.message;

            message.commodities.forEach((commodity, index) => {
              const commodityEntry = commoditiesMap.get(commodity.name.toLowerCase());
              if (commodityEntry != null) {
                commodity.name = commodityEntry.name;
                commodity.category = commodityEntry.category;
              }
              else{
                message.commodities.splice(index,1);
              }
            });
            Station.updateOneUpsert(message);
          }
        });

        sock.on('disconnect', () => {
          debug('Disconnected, trying to reconnect');
          sock.connect(address);
        });

        sock.on('error', (error) => {
          debug(error);
          sock.disconnect();
        });

        sock.on('exit', () => {
          debug('Disconnected, trying to reconnect');
          sock.connect(address);
        });
      });
};

