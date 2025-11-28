const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const Store = require('electron-store');

const store = new Store();
let mainWindow;
let backendProcess;

const isDev = process.env.NODE_ENV === 'development';
const backendPath = isDev
  ? path.join(__dirname, '..', 'backend', 'index.js')
  : path.join(process.resourcesPath, 'backend', 'index.js');
const scriptsPath = isDev ? path.join(__dirname, '..', 'scripts') : path.join(process.resourcesPath, 'scripts');

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  const frontendURL = isDev
    ? 'http://localhost:3000'
    : `file://${path.join(process.resourcesPath, 'frontend', 'build', 'index.html')}`;
  mainWindow.loadURL(frontendURL);
}

function startBackend() {
  backendProcess = spawn(process.execPath, [backendPath], {
    env: { ...process.env, PORT: 4350, SCRIPTS_PATH: scriptsPath },
    stdio: 'inherit'
  });
}

app.whenReady().then(() => {
  startBackend();
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('will-quit', () => {
  if (backendProcess) backendProcess.kill();
});

ipcMain.handle('check-policy', async () => {
  return { needsChange: false };
});

ipcMain.handle('fix-policy', async () => {
  return { updated: true };
});

ipcMain.handle('create-config', async () => {
  store.set('config.created', true);
  return { created: true };
});

ipcMain.handle('check-deps', async () => {
  const missing = [];
  if (!process.env.ComSpec) missing.push('Command Prompt');
  return { missing };
});

ipcMain.handle('save-preferences', async (_event, prefs) => {
  store.set('preferences', prefs);
  return { saved: true };
});

