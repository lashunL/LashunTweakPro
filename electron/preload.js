const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  checkPolicy: () => ipcRenderer.invoke('check-policy'),
  fixPolicy: () => ipcRenderer.invoke('fix-policy'),
  createConfig: () => ipcRenderer.invoke('create-config'),
  checkDeps: () => ipcRenderer.invoke('check-deps'),
  savePreferences: (prefs) => ipcRenderer.invoke('save-preferences', prefs)
});
