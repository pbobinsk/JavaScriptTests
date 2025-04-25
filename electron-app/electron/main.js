const { app, BrowserWindow, Tray, Menu } = require('electron');
const path = require('path');

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    icon: path.join(__dirname, 'icon.png'),  // <-- Dodajemy ikonę tutaj
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  win.loadFile(path.join(__dirname, '../dist/index.html'));

  let progress = 0;
  let direction = 1;
  
  const interval = setInterval(() => {
    if (!win || win.isDestroyed()) {
      clearInterval(interval); // zatrzymaj animację, jeśli okno zniknęło
      return;
    }
  
    progress += direction * 0.01;
  
    if (progress >= 1) {
      progress = 1;
      direction = -1;
    } else if (progress <= 0) {
      progress = 0;
      direction = 1;
    }
  
    win.setProgressBar(progress, { mode: 'normal' });
  }, 50);
  
  
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});



app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
