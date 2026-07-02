import type { DesktopApp, IconName } from "longformer-ui";

export type WorkspaceId =
  | "chat"
  | "messages"
  | "slack"
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
  | "bank-crypto";

export interface WorkspaceNavItem {
  id: WorkspaceId;
  label: string;
  icon: IconName;
}

export const WORKSPACES: WorkspaceNavItem[] = [
  { id: "chat", label: "Chat", icon: "chat" },
  { id: "messages", label: "Messages", icon: "users" },
  { id: "slack", label: "Groups", icon: "hash" },
  { id: "contacts", label: "Contacts", icon: "contact" },
  { id: "notes", label: "Notes", icon: "notebook" },
  { id: "email", label: "Email", icon: "mail" },
  { id: "calendar", label: "Calendar", icon: "calendar" },
  { id: "schedule", label: "Schedule", icon: "layers" },
  { id: "files", label: "Files", icon: "folder" },
  { id: "wallet", label: "Wallet", icon: "wallet" },
  { id: "bank-crypto", label: "Bank / Crypto", icon: "dollar-sign" },
  { id: "tasks", label: "Tasks", icon: "check" },
  { id: "notifications", label: "Notifications", icon: "bell" },
  { id: "apps", label: "Apps", icon: "app-window" },
  { id: "settings", label: "Settings", icon: "settings" },
  { id: "desktop", label: "Desktop", icon: "monitor" },
  { id: "generated", label: "Generated UI", icon: "sparkles" },
];

const WORKSPACE_TONES: Partial<Record<WorkspaceId, DesktopApp["tone"]>> = {
  chat: "accent",
  messages: "accent",
  slack: "accent",
  contacts: "success",
  notes: "success",
  email: "warning",
  calendar: "accent",
  schedule: "accent",
  files: "accent",
  wallet: "warning",
  "bank-crypto": "success",
  tasks: "success",
  notifications: "warning",
  apps: "neutral",
  settings: "neutral",
  desktop: "neutral",
  generated: "accent",
};

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
