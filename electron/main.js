// electron/main.js

// Import the parts of Electron we need.
// 'app' controls the application's lifecycle (startup, shutdown).
// 'BrowserWindow' is the class we use to create windows.

const { app, BrowserWindow } = require("electron");
const path = require("path");

// A function whose job is to create a window.
// We wrap it in a function so we can call it at the right moment.
function createWindow() {
    const win = new BrowserWindow({
        width: 400,
        height: 500,
    });

    // For now, load a simple local HTML file into the window.
    win.loadFile(path.join(__dirname, "index.html"));
}

// 'app.whenReady()' returns a Promise that resolves once Electron
// has finished initializing. We can't create windows before this.
app.whenReady().then(() => {
    createWindow();
});