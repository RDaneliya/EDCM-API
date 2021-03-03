const zlib = require('zlib');
const zmq = require('zeromq');
const sock = zmq.socket('sub');
const Station = require('../models/station');
const delowercase = require('../modules/delowercase');


module.exports = (address, port) => {
  delowercase.getCommoditiesMap()
      .then((commoditiesMap) => {
        sock.connect(`${address}:${port}`);
        sock.subscribe('');

        sock.on('message', topic => {
          const inflated = JSON.parse(zlib.inflateSync(topic));
          if (inflated.$schemaRef === 'https://eddn.edcd.io/schemas/commodity/3') {
            const message = inflated.message;

            message.commodities.forEach(commodity => {
              const commodityEntry = commoditiesMap.get(commodity.name);
              if (commodityEntry != null) {
                commodity.name = commodityEntry.name;
                commodity.category = commodityEntry.category;
              }
            });

            Station.updateOneUpsert(message);
          }
        });

        sock.on('disconnect', () => {
          console.log('Disconnected, trying to reconnect');
          sock.connect(address);
        });

        sock.on('error', (error) => {
          console.log(error);
          sock.disconnect();
        });

        sock.on('exit', () => {
          console.log('Disconnected, trying to reconnect');
          sock.connect(address);
        });
      });
};

