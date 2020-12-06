const zlib = require('zlib');
const zmq = require('zeromq');
const sock = zmq.socket('sub');
const Station = require('./models/station');
const schedule = require('node-schedule');

schedule.scheduleJob('0 0 * * *', () => {
  console.log(process.memoryUsage().heapUsed / 1024 / 1024);
});

const stationNames = new Set();
Station.getAllStationsNames().then(allStationsDocs => {
  allStationsDocs.map(doc => stationNames.add(doc._doc.stationName));

  sock.connect('tcp://eddn.edcd.io:9500');
  console.log('Worker connected to port 9500');
  sock.subscribe('');

  sock.on('message', topic => {
    const inflated = JSON.parse(zlib.inflateSync(topic));
    if(inflated.$schemaRef === 'https://eddn.edcd.io/schemas/commodity/3') {
      const message = inflated.message;

      if(!stationNames.has(message.stationName)) {
        Station.save(message);
        stationNames.add(message.stationName);
      } else {
        Station.update(message);
      }
    }
  });
});
