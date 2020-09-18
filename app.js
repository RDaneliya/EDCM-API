const zlib = require('zlib');
const zmq = require('zeromq');
const sock = zmq.socket('sub');
const Station = require('./models/station');

sock.connect('tcp://eddn.edcd.io:9500');
console.log('Worker connected to port 9500');

sock.subscribe('');

sock.on('message', topic => {
  const inflated = JSON.parse(zlib.inflateSync(topic));
  if(inflated.$schemaRef === 'https://eddn.edcd.io/schemas/commodity/3') {
    const message = inflated.message;

    Station.haveInfo(message.stationName)
      .then(info => {
        if(info == null) {
          Station.save(message)
            .catch(err => console.log(err))

            .finally(err => {
              if(!err)
                console.log('successfully SAVED new station');
            });
        } else {
          Station.update(message)
            .catch(err => console.log(err))

            .finally(err => {
              if(!err)
                console.log('successfully UPDATED station');
            });
        }
      })
      .catch(err => console.log(err));
  }
});
