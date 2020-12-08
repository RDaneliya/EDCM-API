const zmq = require('zeromq');
const sock = zmq.socket('sub');
const schedule = require('node-schedule');
const Station = require('./models/station');
const socketEvents = require('./events/socketEvents');

const address = 'tcp://eddn.edcd.io:9500';

schedule.scheduleJob('0 0 * * *', () => {
  console.log(process.memoryUsage().heapUsed / 1024 / 1024);
});

const stationNames = new Set();
Station.getAllStationsNames().then(allStationsDocs => {
  allStationsDocs.map(doc => stationNames.add(doc._doc.stationName));

  sock.connect(address);
  console.log(`Worker connected to ${address}`);
  sock.subscribe('');

  socketEvents.setDisconnectEvent(sock);
  socketEvents.setMessageEvent(sock, stationNames);
});
