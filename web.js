const WebSocketServer = require('ws').Server;

const restify = require('restify');
const corsMiddleware = require('restify-cors-middleware');

const createRestifyServer = (ipAddress, port) => {
    const server = restify.createServer({});

    const wss = new WebSocketServer({ server: server.server });

    server.use(restify.plugins.bodyParser());

    const cors = corsMiddleware({
        origins: ['*']
    });

    server.pre(cors.preflight);
    server.use(cors.actual);

    server.post('/log', (req, res) => {
        let body = req.body;

        if (
            ['application/json', 'application/x-www-form-urlencoded'].indexOf(
                req.getContentType()
            ) !== -1
        ) {
            body = JSON.stringify(body);
        }

        const logString = `${new Date().toLocaleString()}\t${body}\n`;
        process.stdout.write(logString);
        wss.clients.forEach(client => client.send(logString));
        res.send(204);
    });

    server.get(
        '/*',
        restify.plugins.serveStatic({
            directory: `${__dirname}/static`,
            default: 'index.html'
        })
    );

    server.get('/ip', (req, res) =>
        res.send(`http://${ipAddress}:${port}/log`)
    );

    server.listen(port);

    return server;
};

module.exports = createRestifyServer;
