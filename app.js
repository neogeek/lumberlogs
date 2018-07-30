require('./web.js');

const { app, BrowserWindow, Menu, shell } = require('electron');
const defaultMenu = require('electron-default-menu');

require('electron-context-menu')();

const Store = require('electron-store');
const store = new Store();

let win;

const createWindow = () => {
    win = new BrowserWindow({
        width: store.get('window_width', 800),
        height: store.get('window_height', 600)
    });

    const menu = defaultMenu(app, shell);

    win.loadURL('http://localhost:8000/');
    win.focus();

    win.on('resize', () => {
        const [width, height] = win.getSize();
        store.set('window_width', width);
        store.set('window_height', height);
    });

    win.on('closed', () => {
        win = null;
    });

    Menu.setApplicationMenu(Menu.buildFromTemplate(menu));
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (win === null) {
        createWindow();
    }
});
