/**
 * Longformer desktop shell — Electron wrapper with hidden native title bar on
 * macOS and a custom in-app title bar rendered by the React shell.
 */
const path = require("node:path");
const { app, BrowserWindow, ipcMain, shell } = require("electron");
const { DESKTOP_IPC } = require("./ipc.cjs");

const DEV_URL = process.env.LONGFORMER_URL || "http://127.0.0.1:5175/chat";
const preloadPath = path.join(__dirname, "preload.cjs");

/** Matches ElectronTitleBar.module.css height and preload token. */
const TITLE_BAR_THEME = {
  dark: { color: "#12141a", symbolColor: "#a8b0bf" },
};

function titleBarWindowOptions() {
  const colors = TITLE_BAR_THEME.dark;

  if (process.platform === "darwin") {
    return {
      autoHideMenuBar: true,
      titleBarStyle: "hidden",
      backgroundColor: colors.color,
      trafficLightPosition: { x: 14, y: 12 },
    };
  }

  return {
    autoHideMenuBar: true,
    frame: false,
    backgroundColor: colors.color,
  };
}

function registerWindowControlsIpc() {
  ipcMain.handle(DESKTOP_IPC.minimizeWindow, (event) => {
    BrowserWindow.fromWebContents(event.sender)?.minimize();
  });

  ipcMain.handle(DESKTOP_IPC.maximizeWindow, (event) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    if (!win) return;
    if (win.isMaximized()) win.unmaximize();
    else win.maximize();
  });

  ipcMain.handle(DESKTOP_IPC.closeWindow, (event) => {
    BrowserWindow.fromWebContents(event.sender)?.close();
  });
}

function createWindow() {
  const window = new BrowserWindow({
    width: 1440,
    height: 920,
    minWidth: 960,
    minHeight: 640,
    title: "Longformer",
    ...titleBarWindowOptions(),
    webPreferences: {
      preload: preloadPath,
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  window.loadURL(DEV_URL);

  window.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("http://") || url.startsWith("https://")) {
      void shell.openExternal(url);
    }
    return { action: "deny" };
  });

  window.webContents.on("will-navigate", (event, url) => {
    const allowedOrigin = new URL(DEV_URL).origin;
    if (url.startsWith("http") && !url.startsWith(allowedOrigin) && !url.startsWith("file://")) {
      event.preventDefault();
      void shell.openExternal(url);
    }
  });
}

app.whenReady().then(() => {
  registerWindowControlsIpc();
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
