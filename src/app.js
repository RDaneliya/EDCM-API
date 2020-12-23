const zmq = require('zeromq');
const sock = zmq.socket('sub');
const schedule = require('node-schedule');
const socketEvents = require('./events/socketEvents');
require('console-stamp')(console, '[HH:MM:ss.l]');

const address = 'tcp://eddn.edcd.io:9500';

schedule.scheduleJob('0 0 * * *', () => {
  console.log(process.memoryUsage().heapUsed / 1024 / 1024);
});

sock.connect(address);
console.log(`Worker connected to ${address}`);
sock.subscribe('');

socketEvents.setDisconnectEvent(sock);
socketEvents.setMessageEvent(sock);

