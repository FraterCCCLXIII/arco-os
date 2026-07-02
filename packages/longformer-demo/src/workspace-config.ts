import type { DesktopApp, IconName } from "longformer-ui";
import { resolveAppTone } from "longformer-ui";

export type WorkspaceId =
  | "chat"
  | "messages"
  | "slack"
  | "social"
  | "contacts"
  | "notes"
  | "email"
  | "calendar"
  | "schedule"
  | "files"
  | "generated"
  | "tasks"
  | "notifications"
  | "desktop"
  | "apps"
  | "settings"
  | "wallet"
  | "bank-crypto"
  | "music"
  | "vision"
  | "reader"
  | "maps"
  | "camera"
  | "weather"
  | "calculator"
  | "browser"
  | "phone"
  | "server"
  | "orchestrator"
  | "tickets"
  | "transcribe"
  | "life-planning"
  | "psyche"
  | "sheets"
  | "extensions"
  | "passport";

export interface WorkspaceNavItem {
  id: WorkspaceId;
  label: string;
  icon: IconName;
}

export const WORKSPACES: WorkspaceNavItem[] = [
  { id: "chat", label: "Chat", icon: "chat" },
  { id: "messages", label: "Messages", icon: "users" },
  { id: "slack", label: "Groups", icon: "hash" },
  { id: "social", label: "Social", icon: "globe" },
  { id: "contacts", label: "Contacts", icon: "contact" },
  { id: "notes", label: "Notes", icon: "notebook" },
  { id: "email", label: "Email", icon: "mail" },
  { id: "calendar", label: "Calendar", icon: "calendar" },
  { id: "schedule", label: "Schedule", icon: "layers" },
  { id: "files", label: "Files", icon: "folder" },
  { id: "sheets", label: "Sheets", icon: "grid" },
  { id: "wallet", label: "Wallet", icon: "wallet" },
  { id: "bank-crypto", label: "Bank / Crypto", icon: "dollar-sign" },
  { id: "music", label: "Music", icon: "play" },
  { id: "vision", label: "Vision", icon: "video" },
  { id: "reader", label: "Reader", icon: "bookmark" },
  { id: "maps", label: "Maps", icon: "globe" },
  { id: "camera", label: "Camera", icon: "image" },
  { id: "weather", label: "Weather", icon: "sun" },
  { id: "calculator", label: "Calculator", icon: "grid" },
  { id: "browser", label: "Browser", icon: "external-link" },
  { id: "phone", label: "Phone", icon: "phone-call" },
  { id: "tasks", label: "Tasks", icon: "check" },
  { id: "notifications", label: "Notifications", icon: "bell" },
  { id: "apps", label: "Apps", icon: "app-window" },
  { id: "extensions", label: "Extensions", icon: "package" },
  { id: "passport", label: "Passport", icon: "lock" },
  { id: "settings", label: "Settings", icon: "settings" },
  { id: "desktop", label: "Desktop", icon: "monitor" },
  { id: "server", label: "Server", icon: "terminal" },
  { id: "orchestrator", label: "Orchestrator", icon: "sparkles" },
  { id: "tickets", label: "Tickets", icon: "inbox" },
  { id: "transcribe", label: "Transcribe", icon: "mic" },
  { id: "life-planning", label: "Life Planning", icon: "target" },
  { id: "psyche", label: "Psyche", icon: "sparkles" },
  { id: "generated", label: "Design System", icon: "layers" },
];

const WORKSPACE_TONES: Partial<Record<WorkspaceId, DesktopApp["tone"]>> = Object.fromEntries(
  WORKSPACES.map((workspace) => [workspace.id, resolveAppTone(workspace.id)]),
) as Partial<Record<WorkspaceId, DesktopApp["tone"]>>;

export function isWorkspaceId(value: string): value is WorkspaceId {
  return WORKSPACES.some((workspace) => workspace.id === value);
}

/** Same apps as the left nav rail, for the desktop tray and phone home screen. */
export function workspacesToDesktopApps(workspaces: WorkspaceNavItem[] = WORKSPACES): DesktopApp[] {
  return workspaces.map((workspace) => ({
    id: workspace.id,
    label: workspace.label,
    icon: workspace.icon,
    pinned: true,
    tone: WORKSPACE_TONES[workspace.id] ?? "neutral",
  }));
}

export function workspaceNavItem(id: WorkspaceId): WorkspaceNavItem | undefined {
  return WORKSPACES.find((workspace) => workspace.id === id);
}

/** Default apps shown directly on the left nav rail; the rest live in overflow. */
export const DEFAULT_PINNED_WORKSPACE_IDS: WorkspaceId[] = [
  "chat",
  "messages",
  "notes",
  "email",
  "calendar",
  "files",
  "tasks",
  "desktop",
  "settings",
];

const PINNED_STORAGE_KEY = "longformer-nav-pinned";

export function loadPinnedWorkspaceIds(): WorkspaceId[] {
  if (typeof window === "undefined") return DEFAULT_PINNED_WORKSPACE_IDS;

  try {
    const raw = window.localStorage.getItem(PINNED_STORAGE_KEY);
    if (!raw) return DEFAULT_PINNED_WORKSPACE_IDS;

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed) || !parsed.every(isWorkspaceId)) {
      return DEFAULT_PINNED_WORKSPACE_IDS;
    }

    return parsed;
  } catch {
    return DEFAULT_PINNED_WORKSPACE_IDS;
  }
}

export function savePinnedWorkspaceIds(ids: WorkspaceId[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PINNED_STORAGE_KEY, JSON.stringify(ids));
}

export function splitWorkspacesByPinned(
  pinnedIds: WorkspaceId[],
  all: WorkspaceNavItem[] = WORKSPACES,
): { pinned: WorkspaceNavItem[]; overflow: WorkspaceNavItem[]; pinnedIds: WorkspaceId[] } {
  const knownIds = new Set(all.map((workspace) => workspace.id));
  const normalizedPinned = pinnedIds.filter((id) => knownIds.has(id));
  const pinnedSet = new Set(normalizedPinned);

  const pinned = normalizedPinned
    .map((id) => all.find((workspace) => workspace.id === id))
    .filter((workspace): workspace is WorkspaceNavItem => Boolean(workspace));
  const overflow = all.filter((workspace) => !pinnedSet.has(workspace.id));

  return { pinned, overflow, pinnedIds: normalizedPinned };
}

export function moveWorkspaceToRail(
  pinnedIds: WorkspaceId[],
  id: WorkspaceId,
  index?: number,
): WorkspaceId[] {
  if (pinnedIds.includes(id)) return pinnedIds;

  const next = [...pinnedIds];
  const insertAt =
    index === undefined ? next.length : Math.max(0, Math.min(index, next.length));
  next.splice(insertAt, 0, id);
  return next;
}

export function moveWorkspaceToOverflow(pinnedIds: WorkspaceId[], id: WorkspaceId): WorkspaceId[] {
  if (pinnedIds.length <= 1 || !pinnedIds.includes(id)) return pinnedIds;
  return pinnedIds.filter((pinnedId) => pinnedId !== id);
}

export function reorderPinnedWorkspaces(
  pinnedIds: WorkspaceId[],
  fromIndex: number,
  toIndex: number,
): WorkspaceId[] {
  if (
    fromIndex === toIndex ||
    fromIndex < 0 ||
    toIndex < 0 ||
    fromIndex >= pinnedIds.length ||
    toIndex >= pinnedIds.length
  ) {
    return pinnedIds;
  }

  const next = [...pinnedIds];
  const [moved] = next.splice(fromIndex, 1);
  const insertAt = fromIndex < toIndex ? toIndex - 1 : toIndex;
  next.splice(insertAt, 0, moved);
  return next;
}

/** Default apps shown in the bottom tray dock; all known apps start pinned. */
export const DEFAULT_TRAY_PINNED_IDS: string[] = WORKSPACES.map((workspace) => workspace.id);

const TRAY_PINNED_STORAGE_KEY = "longformer-tray-pinned";

export function loadTrayPinnedIds(allKnownIds: string[] = DEFAULT_TRAY_PINNED_IDS): string[] {
  if (typeof window === "undefined") return normalizeTrayPinnedIds(DEFAULT_TRAY_PINNED_IDS, allKnownIds);

  try {
    const raw = window.localStorage.getItem(TRAY_PINNED_STORAGE_KEY);
    if (!raw) return normalizeTrayPinnedIds(DEFAULT_TRAY_PINNED_IDS, allKnownIds);

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed) || !parsed.every((id) => typeof id === "string")) {
      return normalizeTrayPinnedIds(DEFAULT_TRAY_PINNED_IDS, allKnownIds);
    }

    return normalizeTrayPinnedIds(parsed, allKnownIds);
  } catch {
    return normalizeTrayPinnedIds(DEFAULT_TRAY_PINNED_IDS, allKnownIds);
  }
}

export function saveTrayPinnedIds(ids: string[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(TRAY_PINNED_STORAGE_KEY, JSON.stringify(ids));
}

/** Keep stored order while appending any newly installed apps. */
export function normalizeTrayPinnedIds(stored: string[], allKnownIds: string[]): string[] {
  const known = new Set(allKnownIds);
  const normalized = stored.filter((id) => known.has(id));
  for (const id of allKnownIds) {
    if (!normalized.includes(id)) normalized.push(id);
  }
  return normalized;
}

export function splitAppsByTrayPinned(
  trayPinnedIds: string[],
  apps: DesktopApp[],
): { pinned: DesktopApp[]; overflow: DesktopApp[] } {
  const pinnedSet = new Set(trayPinnedIds);
  const orderMap = new Map(trayPinnedIds.map((id, index) => [id, index]));

  const pinned = apps
    .filter((app) => pinnedSet.has(app.id))
    .sort((left, right) => (orderMap.get(left.id) ?? 0) - (orderMap.get(right.id) ?? 0));
  const overflow = apps.filter((app) => !pinnedSet.has(app.id));

  return { pinned, overflow };
}

export function moveAppToTray(trayPinnedIds: string[], id: string, index?: number): string[] {
  if (trayPinnedIds.includes(id)) return trayPinnedIds;

  const next = [...trayPinnedIds];
  const insertAt = index === undefined ? next.length : Math.max(0, Math.min(index, next.length));
  next.splice(insertAt, 0, id);
  return next;
}

export function removeAppFromTray(trayPinnedIds: string[], id: string): string[] {
  if (trayPinnedIds.length <= 1 || !trayPinnedIds.includes(id)) return trayPinnedIds;
  return trayPinnedIds.filter((pinnedId) => pinnedId !== id);
}

export function reorderTrayPinnedIds(trayPinnedIds: string[], fromIndex: number, toIndex: number): string[] {
  if (
    fromIndex === toIndex ||
    fromIndex < 0 ||
    toIndex < 0 ||
    fromIndex >= trayPinnedIds.length ||
    toIndex >= trayPinnedIds.length
  ) {
    return trayPinnedIds;
  }

  const next = [...trayPinnedIds];
  const [moved] = next.splice(fromIndex, 1);
  const insertAt = fromIndex < toIndex ? toIndex - 1 : toIndex;
  next.splice(insertAt, 0, moved);
  return next;
}
