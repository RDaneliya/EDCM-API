import zlib from 'zlib';
import {socket} from 'zeromq';
import * as Station from '../models/station.mjs'
import delovercase from '../modules/delowercase.mjs';
import Debug from 'debug';

const debug = Debug('ed-commodities-api:socket');
const sock = socket('sub');

export const  Sock = (address, port) => {
  delovercase()
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

