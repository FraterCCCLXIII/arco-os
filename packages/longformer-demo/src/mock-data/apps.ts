import type { AppListing, MarketplaceApp } from "longformer-ui";
import { resolveAppTone } from "longformer-ui";

function withCanonicalTone<T extends { id: string; tone?: AppListing["tone"] }>(app: T): T {
  return { ...app, tone: resolveAppTone(app.id, app.tone) };
}

/** Core workspace apps shown in the installed launcher grid. */
export const workspaceApps: AppListing[] = [
  withCanonicalTone({ id: "chat", label: "Chat", icon: "chat", description: "AI conversations" }),
  withCanonicalTone({ id: "messages", label: "Messages", icon: "users", description: "Direct messages" }),
  withCanonicalTone({ id: "contacts", label: "Contacts", icon: "contact", description: "Phone book & dial pad" }),
  withCanonicalTone({ id: "notes", label: "Notes", icon: "notebook", description: "Documents & pages" }),
  withCanonicalTone({ id: "email", label: "Email", icon: "mail", description: "Inbox & threads" }),
  withCanonicalTone({ id: "calendar", label: "Calendar", icon: "calendar", description: "Events & scheduling" }),
  withCanonicalTone({ id: "files", label: "Files", icon: "folder", description: "Documents & folders" }),
  withCanonicalTone({ id: "tasks", label: "Tasks", icon: "check", description: "To-dos & due dates" }),
  withCanonicalTone({ id: "notifications", label: "Notifications", icon: "bell", description: "Alerts & updates" }),
  withCanonicalTone({ id: "desktop", label: "Desktop", icon: "monitor", description: "OS shell simulation" }),
  withCanonicalTone({ id: "bento", label: "Bento", icon: "grid", description: "Drag-and-drop widget grid" }),
  withCanonicalTone({ id: "composer", label: "Composer", icon: "sparkles", description: "Generative music creation" }),
];

/** Desktop-style apps that also appear in the launcher. */
export const desktopLauncherApps: AppListing[] = [
  withCanonicalTone({ id: "finder", label: "Finder", icon: "folder", description: "Browse files" }),
  withCanonicalTone({ id: "browser", label: "Browser", icon: "external-link", description: "Web browser" }),
  withCanonicalTone({ id: "terminal", label: "Terminal", icon: "terminal", description: "Command line" }),
  withCanonicalTone({ id: "longformer", label: "Longformer", icon: "sparkles", description: "AI assistant" }),
  withCanonicalTone({ id: "settings", label: "Settings", icon: "settings", description: "System preferences" }),
];

export const initialInstalledAppIds = new Set([
  ...workspaceApps.map((app) => app.id),
  ...desktopLauncherApps.map((app) => app.id),
]);

export const marketplaceCatalog: MarketplaceApp[] = [
  withCanonicalTone({
    id: "slack",
    label: "Groups",
    icon: "hash",
    category: "communication",
    author: "Longformer",
    description: "Team messaging with channels, threads, and huddles.",
    rating: 4.8,
    badge: "Popular",
    installed: false,
  }),
  withCanonicalTone({
    id: "zoom",
    label: "Zoom",
    icon: "video",
    category: "communication",
    author: "Zoom Video",
    description: "Video meetings, webinars, and phone calls.",
    rating: 4.5,
    installed: false,
  }),
  withCanonicalTone({
    id: "linear",
    label: "Linear",
    icon: "check",
    category: "productivity",
    author: "Linear",
    description: "Issue tracking and project management for software teams.",
    rating: 4.9,
    badge: "Editor's choice",
    installed: false,
  }),
  withCanonicalTone({
    id: "notion",
    label: "Notion",
    icon: "notebook",
    category: "productivity",
    author: "Notion Labs",
    description: "All-in-one workspace for notes, docs, and wikis.",
    rating: 4.7,
    installed: false,
  }),
  withCanonicalTone({
    id: "figma",
    label: "Figma",
    icon: "layers",
    category: "creative",
    author: "Figma",
    description: "Collaborative interface design and prototyping.",
    rating: 4.9,
    badge: "New",
    installed: false,
  }),
  withCanonicalTone({
    id: "github",
    label: "GitHub",
    icon: "code",
    category: "developer",
    author: "GitHub",
    description: "Source control, pull requests, and CI workflows.",
    rating: 4.8,
    installed: false,
  }),
  withCanonicalTone({
    id: "docker",
    label: "Docker",
    icon: "app-window",
    category: "developer",
    author: "Docker Inc.",
    description: "Build, ship, and run containerized applications.",
    rating: 4.6,
    installed: false,
  }),
  withCanonicalTone({
    id: "spotify",
    label: "Spotify",
    icon: "volume",
    category: "creative",
    author: "Spotify AB",
    description: "Music streaming with playlists and podcasts.",
    rating: 4.4,
    installed: false,
  }),
  withCanonicalTone({
    id: "1password",
    label: "1Password",
    icon: "lock",
    category: "productivity",
    author: "AgileBits",
    description: "Password manager and secure vault for teams.",
    rating: 4.7,
    installed: false,
  }),
  withCanonicalTone({
    id: "analytics",
    label: "Analytics",
    icon: "grid",
    category: "featured",
    author: "Longformer",
    description: "Usage dashboards and workspace insights.",
    rating: 4.3,
    badge: "Featured",
    installed: false,
  }),
  withCanonicalTone({
    id: "phone",
    label: "Phone",
    icon: "phone",
    category: "communication",
    author: "Longformer",
    description: "VoIP calling integrated with your contacts.",
    rating: 4.2,
    installed: false,
  }),
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
