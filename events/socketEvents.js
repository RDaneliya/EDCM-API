const zlib = require('zlib')
const Station = require('../models/station');

module.exports.setMessageEvent = (sock, stationNames) => {
    sock.on('message', topic => {
        const inflated = JSON.parse(zlib.inflateSync(topic));
        if (inflated.$schemaRef === 'https://eddn.edcd.io/schemas/commodity/3') {
            const message = inflated.message;

            if (!stationNames.has(message.stationName)) {
                Station.save(message);
                stationNames.add(message.stationName);
            } else {
                Station.update(message);
            }
        }
    });
}

module.exports.setDisconnectEvent = (sock) => {
    sock.on('disconnect', () => {
        sock.connect('tcp://eddn.edcd.io:9500');
        console.log('Disconnected, trying to reconnect');
    });
}