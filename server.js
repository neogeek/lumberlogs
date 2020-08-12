const restify = require('restify');

const WebSocket = require('ws');

const server = restify.createServer();

const wss = new WebSocket.Server({ server: server.server });

server.use(restify.plugins.bodyParser());

server.post('/log', (req, res) => {
    wss.clients.forEach(client =>
        client.send(
            `${new Date().toLocaleString()}\t${JSON.stringify(req.body)}\n`
        )
    );

    res.send(204);
});

server.get(
    '/*',
    restify.plugins.serveStatic({
        directory: `${__dirname}/static`,
        default: 'index.html'
    })
);

module.exports = server;
