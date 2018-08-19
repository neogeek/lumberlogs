const ip = require('ip');
const getPort = require('get-port');

const createElectronWindow = require('./app');
const createRestifyServer = require('./web');

const DEFAULT_PORT = process.env.PORT || 1234;

getPort({ port: DEFAULT_PORT }).then(port => {
    const ipAddress = ip.address();
    createRestifyServer(ipAddress, port);
    createElectronWindow(ipAddress, port);
});
