const { createWriteStream } = require('fs');
const { spawnSync } = require('child_process');

const PORT = process.env.PORT || 8000;

spawnSync('mkdir', '-p logs'.split(' '));

const wstream = createWriteStream('logs/log.log');

const restify = require('restify');

const server = restify.createServer({
    acceptable: ['text/plain', 'application/x-www-form-urlencoded']
});

const WebSocketServer = require('ws').Server;

const wss = new WebSocketServer({ server: server.server });

server.use(restify.plugins.bodyParser());

server.post('/log', (req, res) => {
    let body = req.body;

    if (req.getContentType() === 'application/x-www-form-urlencoded') {
        body = JSON.stringify(body);
    }

    const logString = `${new Date().toLocaleString()}\t${body}\n`;
    process.stdout.write(logString);
    wstream.write(logString);
    wss.clients.forEach(client => client.send(logString));
    res.send(204);
});

const ip = require('ip');

server.get('/ip', (req, res) => res.send(`http://${ip.address()}:${PORT}/log`));

server.get(
    '/*',
    restify.plugins.serveStatic({
        directory: `${__dirname}/static`,
        default: 'index.html'
    })
);

server.listen(PORT);
