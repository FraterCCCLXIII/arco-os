import type { AppListing, MarketplaceApp } from "longformer-ui";

/** Core workspace apps shown in the installed launcher grid. */
export const workspaceApps: AppListing[] = [
  { id: "chat", label: "Chat", icon: "chat", tone: "accent", description: "AI conversations" },
  { id: "messages", label: "Messages", icon: "users", tone: "accent", description: "Direct messages" },
  { id: "contacts", label: "Contacts", icon: "contact", tone: "success", description: "Phone book & dial pad" },
  { id: "notes", label: "Notes", icon: "notebook", tone: "success", description: "Documents & pages" },
  { id: "email", label: "Email", icon: "mail", tone: "warning", description: "Inbox & threads" },
  { id: "calendar", label: "Calendar", icon: "calendar", tone: "accent", description: "Events & scheduling" },
  { id: "files", label: "Files", icon: "folder", tone: "accent", description: "Documents & folders" },
  { id: "tasks", label: "Tasks", icon: "check", tone: "success", description: "To-dos & due dates" },
  { id: "notifications", label: "Notifications", icon: "bell", tone: "warning", description: "Alerts & updates" },
  { id: "desktop", label: "Desktop", icon: "monitor", tone: "neutral", description: "OS shell simulation" },
];

/** Desktop-style apps that also appear in the launcher. */
export const desktopLauncherApps: AppListing[] = [
  { id: "finder", label: "Finder", icon: "folder", tone: "accent", description: "Browse files" },
  { id: "browser", label: "Browser", icon: "external-link", tone: "accent", description: "Web browser" },
  { id: "terminal", label: "Terminal", icon: "terminal", tone: "neutral", description: "Command line" },
  { id: "longformer", label: "Longformer", icon: "sparkles", tone: "accent", description: "AI assistant" },
  { id: "settings", label: "Settings", icon: "settings", tone: "neutral", description: "System preferences" },
];

export const initialInstalledAppIds = new Set([
  ...workspaceApps.map((app) => app.id),
  ...desktopLauncherApps.map((app) => app.id),
]);

export const marketplaceCatalog: MarketplaceApp[] = [
  {
    id: "slack",
    label: "Groups",
    icon: "hash",
    tone: "accent",
    category: "communication",
    author: "Longformer",
    description: "Team messaging with channels, threads, and huddles.",
    rating: 4.8,
    badge: "Popular",
    installed: false,
  },
  {
    id: "zoom",
    label: "Zoom",
    icon: "video",
    tone: "accent",
    category: "communication",
    author: "Zoom Video",
    description: "Video meetings, webinars, and phone calls.",
    rating: 4.5,
    installed: false,
  },
  {
    id: "linear",
    label: "Linear",
    icon: "check",
    tone: "accent",
    category: "productivity",
    author: "Linear",
    description: "Issue tracking and project management for software teams.",
    rating: 4.9,
    badge: "Editor's choice",
    installed: false,
  },
  {
    id: "notion",
    label: "Notion",
    icon: "notebook",
    tone: "neutral",
    category: "productivity",
    author: "Notion Labs",
    description: "All-in-one workspace for notes, docs, and wikis.",
    rating: 4.7,
    installed: false,
  },
  {
    id: "figma",
    label: "Figma",
    icon: "layers",
    tone: "accent",
    category: "creative",
    author: "Figma",
    description: "Collaborative interface design and prototyping.",
    rating: 4.9,
    badge: "New",
    installed: false,
  },
  {
    id: "github",
    label: "GitHub",
    icon: "code",
    tone: "neutral",
    category: "developer",
    author: "GitHub",
    description: "Source control, pull requests, and CI workflows.",
    rating: 4.8,
    installed: false,
  },
  {
    id: "docker",
    label: "Docker",
    icon: "app-window",
    tone: "accent",
    category: "developer",
    author: "Docker Inc.",
    description: "Build, ship, and run containerized applications.",
    rating: 4.6,
    installed: false,
  },
  {
    id: "spotify",
    label: "Spotify",
    icon: "volume",
    tone: "success",
    category: "creative",
    author: "Spotify AB",
    description: "Music streaming with playlists and podcasts.",
    rating: 4.4,
    installed: false,
  },
  {
    id: "1password",
    label: "1Password",
    icon: "lock",
    tone: "warning",
    category: "productivity",
    author: "AgileBits",
    description: "Password manager and secure vault for teams.",
    rating: 4.7,
    installed: false,
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: "grid",
    tone: "accent",
    category: "featured",
    author: "Longformer",
    description: "Usage dashboards and workspace insights.",
    rating: 4.3,
    badge: "Featured",
    installed: false,
  },
  {
    id: "phone",
    label: "Phone",
    icon: "phone",
    tone: "success",
    category: "communication",
    author: "Longformer",
    description: "VoIP calling integrated with your contacts.",
    rating: 4.2,
    installed: false,
  },
];

export function buildInstalledApps(installedIds: Set<string>, customApps: AppListing[] = []): AppListing[] {
  const catalog = [...workspaceApps, ...desktopLauncherApps, ...marketplaceCatalog, ...customApps];
  return catalog.filter((app) => installedIds.has(app.id));
}

export function buildMarketplaceApps(installedIds: Set<string>): MarketplaceApp[] {
  return marketplaceCatalog.map((app) => ({
    ...app,
    installed: installedIds.has(app.id),
  }));
}
