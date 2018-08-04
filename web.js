const { app } = require('electron');

const { createWriteStream } = require('graceful-fs');

const wstream = createWriteStream(`${app.getPath('desktop')}/logs.txt`);

const PORT = process.env.PORT || 8000;

const restify = require('restify');
const corsMiddleware = require('restify-cors-middleware');

const server = restify.createServer({
    acceptable: ['text/plain', 'application/x-www-form-urlencoded']
});

const WebSocketServer = require('ws').Server;

const wss = new WebSocketServer({ server: server.server });

server.use(restify.plugins.bodyParser());

const cors = corsMiddleware({
    origins: ['*']
});

server.use(cors.preflight);
server.use(cors.actual);

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
