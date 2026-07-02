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
  | "phone"
  | "server"
  | "orchestrator"
  | "tickets"
  | "transcribe"
  | "life-planning"
  | "psyche";

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
  { id: "wallet", label: "Wallet", icon: "wallet" },
  { id: "bank-crypto", label: "Bank / Crypto", icon: "dollar-sign" },
  { id: "music", label: "Music", icon: "play" },
  { id: "vision", label: "Vision", icon: "video" },
  { id: "reader", label: "Reader", icon: "bookmark" },
  { id: "maps", label: "Maps", icon: "globe" },
  { id: "camera", label: "Camera", icon: "image" },
  { id: "weather", label: "Weather", icon: "sun" },
  { id: "phone", label: "Phone", icon: "phone-call" },
  { id: "tasks", label: "Tasks", icon: "check" },
  { id: "notifications", label: "Notifications", icon: "bell" },
  { id: "apps", label: "Apps", icon: "app-window" },
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

export function moveWorkspaceToRail(pinnedIds: WorkspaceId[], id: WorkspaceId): WorkspaceId[] {
  if (pinnedIds.includes(id)) return pinnedIds;
  return [...pinnedIds, id];
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
