import { app, BrowserWindow } from 'electron';
import * as fs from 'fs';
import * as path from 'path';
import * as url from 'url';

import * as remote from '@electron/remote/main';

// Initialize remote module
remote.initialize();

let win: BrowserWindow = null;
const args = process.argv.slice(1),
  serve = args.some((val) => val === '--serve'),
  dev = args.some((val) => val === '--dev');

function createWindow(): BrowserWindow {
  const size = { x: 800, y: 600 };

  win = new BrowserWindow({
    width: size.x,
    height: size.y,
    resizable: serve || dev,
    webPreferences: {
      nodeIntegration: true,
      allowRunningInsecureContent: serve ? true : false,
      contextIsolation: false,
      webSecurity: !serve,
    },
  });

  remote.enable(win.webContents);

  if (serve) {
    require('electron-reload')(__dirname, {
      electron: require(path.join(__dirname, '../node_modules/electron')),
    });
    win.loadURL('http://localhost:4200');
  } else {
    let pathIndex = './index.html';

    if (fs.existsSync(path.join(__dirname, '../dist/index.html'))) {
      // Path when running electron in local folder
      pathIndex = '../dist/index.html';
    }

    win.loadURL(
      url.format({
        pathname: path.join(__dirname, pathIndex),
        protocol: 'file:',
        slashes: true,
      })
    );

    win.setMenuBarVisibility(false);
  }

  if (dev || serve) {
    win.setMenuBarVisibility(true);
  }

  win.on('closed', function () {
    win = null;
  });

  return win;
}

try {
  app.on('ready', createWindow);

  app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
  });

  app.on('activate', function () {
    if (win === null) {
      createWindow();
    }
  });
} catch (e) {}
