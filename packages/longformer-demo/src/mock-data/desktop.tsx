import { SettingsWorkspace, type DesktopApp, type DesktopIconItem, type DesktopWindow } from "longformer-ui";
import { toSurfaceWindow, type OpenWindowInput, type SurfaceWindow } from "longformer-ui";
import { createAppWindowContent } from "./app-window-content";
import { settingsData } from "./settings";

export const desktopApps: DesktopApp[] = [
  { id: "finder", label: "Finder", icon: "folder", tone: "accent", pinned: true },
  { id: "browser", label: "Browser", icon: "external-link", tone: "accent", pinned: true },
  { id: "mail", label: "Mail", icon: "mail", tone: "warning", pinned: true },
  { id: "terminal", label: "Terminal", icon: "terminal", tone: "neutral", pinned: true },
  { id: "notes", label: "Notes", icon: "notebook", tone: "success", pinned: true },
  { id: "longformer", label: "Longformer", icon: "sparkles", tone: "accent", pinned: true },
  { id: "settings", label: "Settings", icon: "settings", tone: "neutral", pinned: true },
];

export const desktopIcons: DesktopIconItem[] = [
  { id: "icon-docs", label: "Documents", icon: "folder", appId: "finder" },
  { id: "icon-readme", label: "README.md", icon: "file", appId: "notes" },
  { id: "icon-screenshots", label: "Screenshots", icon: "image", appId: "finder" },
];

function contentForApp(appId: string): DesktopWindow["content"] {
  if (appId === "settings") {
    return <SettingsWorkspace data={settingsData} />;
  }
  return createAppWindowContent();
}

/** Legacy flat layout for components that still expect `DesktopWindow`. */
export const initialDesktopWindows: DesktopWindow[] = [
  {
    id: "win-finder",
    appId: "finder",
    title: "Documents",
    icon: "folder",
    x: 6,
    y: 8,
    width: 46,
    height: 56,
    content: contentForApp("finder"),
  },
  {
    id: "win-browser",
    appId: "browser",
    title: "Browser",
    icon: "external-link",
    x: 40,
    y: 16,
    width: 48,
    height: 58,
    content: contentForApp("browser"),
  },
  {
    id: "win-terminal",
    appId: "terminal",
    title: "Terminal — zsh",
    icon: "terminal",
    x: 20,
    y: 40,
    width: 38,
    height: 30,
    content: contentForApp("terminal"),
  },
];

export const initialSurfaceWindows: SurfaceWindow[] = initialDesktopWindows.map((window, index) =>
  toSurfaceWindow(window, index + 1),
);

export function createWindowForApp(app: DesktopApp, _index: number): OpenWindowInput {
  return {
    id: `win-${app.id}-${Date.now()}`,
    appId: app.id,
    title: app.label,
    icon: app.icon,
    content: contentForApp(app.id),
  };
}
