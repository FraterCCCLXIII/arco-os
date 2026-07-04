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
      { id: "alex", label: "Alex" },
      { id: "alex-dev", label: "alex-dev" },
      { id: "alex-test", label: "alex-test" },
      { id: "alex-test2", label: "alex-test2" },
      { id: "alex-test3", label: "alex-test3" },
    ];
  }

  if (appId === "slack") {
    return [
      { id: "longformer", label: "Longformer" },
      { id: "meridian", label: "Meridian" },
      { id: "design", label: "Product Team" },
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
