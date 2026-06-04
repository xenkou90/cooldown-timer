const { contextBridge, ipcRenderer } = require("electron");

// Expose a controlled API to the renderer.
// The renderer will be able to call window.api.minimizeWindow(), etc.,
// but cannot access ipcRenderer directly.
contextBridge.exposeInMainWorld("api", {
    minimizeWindow: () => ipcRenderer.send("window-minimize"),
    closeWindow: () => ipcRenderer.send("window-close"),
});