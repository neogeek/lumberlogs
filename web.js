require('with-env')();

const restify = require('restify');

const server = restify.createServer({
    acceptable: 'text/plain'
});

server.use(restify.plugins.bodyParser());

server.post('/log', (req, res) => {
    const logString = `${new Date().toLocaleString()} ${req.body}\n`;
    process.stdout.write(logString);
    res.send(204);
});

server.listen(process.env.PORT || 8080);
