const zlib = require('zlib');
const Station = require('../models/station');

const address = 'tcp://eddn.edcd.io:9500'

module.exports.setMessageEvent = (sock) => {
  sock.on('message', topic => {
    const inflated = JSON.parse(zlib.inflateSync(topic));
    if(inflated.$schemaRef === 'https://eddn.edcd.io/schemas/commodity/3') {
      const message = inflated.message;
      Station.updateOneUpsert(message);
    }
  });
};

module.exports.setDisconnectEvent = (sock) => {
  sock.on('disconnect', () => {
    console.log('Disconnected, trying to reconnect');
    sock.connect(address);
  });
};

module.exports.setErrorEvent = (sock) => {
  sock.on('error', (error) => {
    console.log(error);
    sock.disconnect();
  });
};

module.exports.setExitEvent = (sock) => {
  sock.on('exit', () =>{
    console.log('Disconnected, trying to reconnect');
    sock.connect(address);
  })
}