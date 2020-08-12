const { app, BrowserWindow } = require('electron');

const ip = require('ip');

const portfinder = require('portfinder');

const server = require('./server');

function createWindow() {
    const win = new BrowserWindow({
        width: 1024,
        height: 600
    });

    portfinder.getPortPromise().then(port => {
        server.listen(port, ip.address());

        win.loadURL(`http://${ip.address()}:${port}/`);
    });
}

app.whenReady().then(createWindow);
