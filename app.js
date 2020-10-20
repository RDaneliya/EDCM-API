const zlib = require('zlib');
const zmq = require('zeromq');
const sock = zmq.socket('sub');
const Station = require('./models/station');

const stationNames = new Set();
Station.getAllStationsNames().then(allStaionDocs => {
  allStaionDocs.map(doc => stationNames.add(doc._doc.stationName));

  sock.connect('tcp://eddn.edcd.io:9500');
  console.log('Worker connected to port 9500');
  sock.subscribe('');
  sock.on('message', topic => {
    const inflated = JSON.parse(zlib.inflateSync(topic));
    if(inflated.$schemaRef === 'https://eddn.edcd.io/schemas/commodity/3') {
      const message = inflated.message;

      if(!stationNames.has(message.stationName)) {
        Station.save(message)
          .catch(err => console.log(err));
      } else {
        Station.update(message)
          .catch(err => console.log(err));
      }
    }
  });
});
