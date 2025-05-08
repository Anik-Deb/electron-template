import { electronApp, is, optimizer } from '@electron-toolkit/utils';
import dotenv from 'dotenv'; // Import dotenv
import { BrowserWindow, app, screen, shell } from 'electron';
import { join } from 'path';
import registerAllHandlers from './ipcHandlers';
import dbConnect from './db/dbConnect';

// Load environment variables from .env file
dotenv.config();
/* Create client for the databse*/

function createWindow() {
  // Get the primary display's dimensions
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width,
    height,
    show: false,
    autoHideMenuBar: true,
    // ...(process.platform === 'linux' ? { icon } : {}),
    icon: join(__dirname, '../../resources/icon.png'),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  });

  // mainWindow.setAlwaysOnTop(true, 'screen')

  mainWindow.on('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: 'deny' };
  });
  // Determine the URL to load based on the environment
  const startUrl =
    is.dev && process.env['NODE_ENV'] === 'development'
      ? 'http://localhost:5173' // Development server
      : `file://${join(__dirname, '../renderer/index.html')}`; // Production file path

  // Load the determined URL
  mainWindow.loadURL(startUrl).catch((err) => {
    console.error('Failed to load URL:', err);
  });
  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron');

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });
  await dbConnect();
  createWindow();
  registerAllHandlers();

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
}); 