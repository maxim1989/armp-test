const { app, BrowserWindow } = require('electron')
const { session } = require('electron')
var rq = require('request-promise');

function createWindow({ subpy }) {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })

  win.on('read', function () {
    session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
      callback({
        responseHeaders: {
          ...details.responseHeaders,
          'Content-Security-Policy': ['default-src \'http://localhost:8888\'']
        }
      })
    })
  })

  win.on('closed', function () {
    mainWindow = null;
    subpy.kill('SIGINT');
  });
  win.webContents.openDevTools();
  win.loadFile('./templates/index.html')
}

function startUp({ subpy }) {
  rq('http://localhost:8888')
    .then(function () {
      createWindow({ subpy });
    })
    .catch(function (err) {
      console.log('waiting for the server start...');
      startUp({ subpy });
    });
}

app.whenReady().then(function () {
  const subpy = require('child_process').spawn('python3', ['./main.py']);

  console.log('@@@ subpy', subpy)

  if (subpy) {
    startUp({ subpy });
  }
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})