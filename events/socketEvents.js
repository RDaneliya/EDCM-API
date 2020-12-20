const zlib = require('zlib')
const Station = require('../models/station');

module.exports.setMessageEvent = (sock) => {
    sock.on('message', topic => {
        const inflated = JSON.parse(zlib.inflateSync(topic));
        if (inflated.$schemaRef === 'https://eddn.edcd.io/schemas/commodity/3') {
            const message = inflated.message;
                Station.update({stationName: message.stationName}, message, {upsert: true});
        }
    });
}

module.exports.setDisconnectEvent = (sock) => {
    sock.on('disconnect', () => {
        sock.connect('tcp://eddn.edcd.io:9500');
        console.log('Disconnected, trying to reconnect');
    });
}