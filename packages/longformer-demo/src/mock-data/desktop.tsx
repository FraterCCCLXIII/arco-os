import type { DesktopIconItem, DesktopWindow } from "longformer-ui";
import { toSurfaceWindow, type OpenWindowInput, type SurfaceWindow } from "longformer-ui";
import { WORKSPACES, workspaceNavItem, type WorkspaceId } from "../workspace-config";

export const desktopIcons: DesktopIconItem[] = [
  { id: "icon-chat", label: "Chat", icon: "chat", appId: "chat" },
  { id: "icon-notes", label: "Notes", icon: "notebook", appId: "notes" },
  { id: "icon-email", label: "Email", icon: "mail", appId: "email" },
  { id: "icon-files", label: "Files", icon: "folder", appId: "files" },
];

/** Legacy flat layout for components that still expect `DesktopWindow`. */
export const initialDesktopWindows: DesktopWindow[] = [
  {
    id: "win-chat",
    appId: "chat",
    title: "Chat",
    icon: "chat",
    x: 6,
    y: 8,
    width: 48,
    height: 58,
  },
  {
    id: "win-notes",
    appId: "notes",
    title: "Notes",
    icon: "notebook",
    x: 34,
    y: 12,
    width: 46,
    height: 54,
  },
  {
    id: "win-email",
    appId: "email",
    title: "Email",
    icon: "mail",
    x: 18,
    y: 36,
    width: 50,
    height: 52,
  },
];

export const initialSurfaceWindows: SurfaceWindow[] = initialDesktopWindows.map((window, index) =>
  toSurfaceWindow(window, index + 1),
);

export function createWindowForApp(app: { id: string; label: string; icon: OpenWindowInput["icon"] }, _index: number): OpenWindowInput {
  return {
    id: `win-${app.id}-${Date.now()}`,
    appId: app.id,
    title: app.label,
    icon: app.icon,
  };
}

export function isDesktopLaunchableWorkspace(appId: string): appId is WorkspaceId {
  return appId !== "desktop" && Boolean(workspaceNavItem(appId as WorkspaceId));
}

export { WORKSPACES };
