require('with-env')();

const { createWriteStream } = require('fs');
const { spawn } = require('child_process');

spawn('mkdir', '-p logs'.split(' '));

const wstream = createWriteStream('logs/log.log');

const restify = require('restify');

const server = restify.createServer({
    acceptable: 'text/plain'
});

server.use(restify.plugins.bodyParser());

server.post('/log', (req, res) => {
    const logString = `${new Date().toLocaleString()} ${req.body}\n`;
    process.stdout.write(logString);
    wstream.write(logString);
    res.send(204);
});

server.listen(process.env.PORT || 8080);
