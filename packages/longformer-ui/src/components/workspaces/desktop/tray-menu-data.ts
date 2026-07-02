export interface TrayAppProfile {
  id: string;
  label: string;
}

export interface TrayAppMenuActionHandlers {
  onNewWindow?: () => void;
  onNewPrivateWindow?: () => void;
  onShowAllWindows?: () => void;
  onHide?: () => void;
  onQuit?: () => void;
  onSelectProfile?: (profileId: string) => void;
}

export function defaultProfilesForApp(appId: string): TrayAppProfile[] {
  if (appId === "chat" || appId === "longformer") {
    return [
      { id: "all-hands", label: "all-hands.dev" },
      { id: "doctransit", label: "DocTransit" },
      { id: "moon", label: "Moon" },
      { id: "paul", label: "Paul" },
      { id: "paul-dev", label: "paul-dev" },
      { id: "paul-test", label: "paul-test" },
      { id: "paul-test2", label: "paul-test2" },
      { id: "paul-test3", label: "paul-test3" },
    ];
  }

  if (appId === "slack") {
    return [
      { id: "longformer", label: "Longformer" },
      { id: "all-hands", label: "All Hands" },
      { id: "design", label: "Design Team" },
    ];
  }

  return [
    { id: "default", label: "Default" },
    { id: "work", label: "Work" },
    { id: "personal", label: "Personal" },
  ];
}

export const TRAY_OPTIONS_ITEMS = [
  { id: "preferences", label: "Preferences…" },
  { id: "updates", label: "Check for Updates" },
  { id: "keep-dock", label: "Keep in Dock" },
  { id: "open-login", label: "Open at Login" },
] as const;
