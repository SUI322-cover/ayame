const { app, BrowserWindow } = require('electron');
const path = require('path');
const { exec } = require('child_process');

// 創建一個主窗口
let mainWindow;

app.on('ready', () => {
  // 啟動後端服務
  exec('node backend/app.js', (err, stdout, stderr) => {
    if (err) {
      console.error(`後端服務啟動失敗: ${stderr}`);
      return;
    }
    console.log(`後端服務啟動成功: ${stdout}`);
  });

  // 加載前端
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // 載入前端的 HTML 文件
  mainWindow.loadFile(path.join(__dirname, 'frontend/build/index.html'));

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
