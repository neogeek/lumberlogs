const { writeFile } = require('graceful-fs');

var { ipcMain } = require('electron');

const createElectronWindow = (ipAddress, port) => {
    if (
        typeof process !== 'undefined' &&
        typeof process.versions === 'object' &&
        !process.versions.electron
    ) {
        return false;
    }

    const { app, BrowserWindow, Menu, dialog } = require('electron');

    const createAppMenuTemplate = require('./app-menu');

    const Store = require('electron-store');
    const store = new Store();

    let win;

    const createWindow = () => {
        win = new BrowserWindow({
            width: store.get('window_width', 800),
            height: store.get('window_height', 600),
            title: 'LumberLogs'
        });

        win.loadURL(`http://${ipAddress}:${port}/`);
        win.focus();

        win.on('resize', () => {
            const [width, height] = win.getSize();
            store.set('window_width', width);
            store.set('window_height', height);
        });

        win.on('closed', () => {
            win = null;
        });

        const template = createAppMenuTemplate({
            saveDialog: () => {
                win.webContents.send('request-logs');
                ipcMain.once('receive-logs', (event, args) => {
                    dialog.showSaveDialog(
                        win,
                        {
                            defaultPath: 'logs.txt',
                            filters: [{ name: 'text', extensions: ['txt'] }]
                        },
                        filename =>
                            filename
                                ? writeFile(filename, args, 'utf8', err => {
                                      if (err) {
                                          dialog.showErrorBox(
                                              'Error while saving file.',
                                              err.message
                                          );
                                      }
                                  })
                                : null
                    );
                });
            }
        });

        Menu.setApplicationMenu(Menu.buildFromTemplate(template));
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

    return win;
};

module.exports = createElectronWindow;
