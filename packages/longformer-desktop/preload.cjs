const { contextBridge, ipcRenderer } = require("electron");
const { DESKTOP_IPC } = require("./ipc.cjs");

const TITLE_BAR_HEIGHT = "38px";

document.documentElement.dataset.electron = "true";
document.documentElement.dataset.platform = process.platform;
document.documentElement.style.setProperty("--lf-electron-titlebar-height", TITLE_BAR_HEIGHT);

contextBridge.exposeInMainWorld("longformerDesktop", {
  isDesktop: true,
  platform: process.platform,
  minimizeWindow: () => ipcRenderer.invoke(DESKTOP_IPC.minimizeWindow),
  maximizeWindow: () => ipcRenderer.invoke(DESKTOP_IPC.maximizeWindow),
  closeWindow: () => ipcRenderer.invoke(DESKTOP_IPC.closeWindow),
});
