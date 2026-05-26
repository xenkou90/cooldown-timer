const { app, BrowserWindow } = require("electron");
const path = require("path");

// Detect whether we are in development mode
// I'm setting this envitonment variable myself when running in dev
const isDev = process.env.NODE_ENV === "development";

function createWindow() {
    const win = new BrowserWindow({
        width: 400,
        height: 500,
    });

    if (isDev) {
        // In development: load the live Vite dev server
        win.loadURL("http://localhost:5173");
        // Open DevTools automatically so we can debug
        win.webContents.openDevTools();
    } else {
        // In production: load the built file from disk
        win.loadFile(path.join(__dirname, "../dist/index.html"));
    }
}

app.whenReady().then(() => {
    createWindow();
});