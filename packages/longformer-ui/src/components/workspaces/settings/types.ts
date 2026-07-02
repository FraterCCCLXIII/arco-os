import type { IconName } from "../../../icons";

export type SettingsSectionId =
  | "account-info"
  | "password-security"
  | "account-standing"
  | "family-center"
  | "content-social"
  | "data-privacy"
  | "authorized-apps"
  | "connections"
  | "notifications"
  | "nitro"
  | "server-boost"
  | "subscriptions"
  | "gift-inventory"
  | "billing"
  | "appearance"
  | "wallpaper"
  | "accessibility"
  | "voice-video"
  | "text-images"
  | "notification-settings"
  | "keybinds"
  | "language"
  | "streamer-mode"
  | "advanced";

export interface SettingsNavItem {
  id: SettingsSectionId;
  label: string;
  icon?: IconName;
  badge?: string;
  children?: SettingsNavItem[];
}

export interface SettingsNavGroup {
  id: string;
  label?: string;
  items: SettingsNavItem[];
}

export interface SettingsAccountInfo {
  username: string;
  emailMasked: string;
  emailRevealed?: string;
  phoneMasked: string;
  phoneRevealed?: string;
}

export interface SettingsDeviceSummary {
  count: number;
  label?: string;
}

export interface SettingsStanding {
  status: "good" | "warning" | "restricted";
  title: string;
  description: string;
  linkLabels?: string[];
}

export interface SettingsRowAction {
  type: "edit" | "reveal" | "link" | "chevron";
  label?: string;
}

export interface SettingsFieldRow {
  id: string;
  label: string;
  value?: string;
  masked?: boolean;
  /** Shown in place of `value` until the field is revealed. */
  maskedDisplay?: string;
  actions?: SettingsRowAction[];
}

export interface SettingsLinkRow {
  id: string;
  label: string;
  value?: string;
  hint?: string;
}

export interface SettingsToggleRow {
  id: string;
  label: string;
  description?: string;
  enabled: boolean;
}

export interface SettingsContentSection {
  id: SettingsSectionId;
  title: string;
  intro?: string;
  fields?: SettingsFieldRow[];
  links?: SettingsLinkRow[];
  toggles?: SettingsToggleRow[];
  standing?: SettingsStanding;
}

export interface SettingsUserProfile {
  name: string;
  avatarSrc?: string;
  editProfilesLabel?: string;
}

export interface SettingsWallpaperPreset {
  id: string;
  label: string;
  url: string;
  credit?: string;
}

export interface SettingsWorkspaceData {
  user: SettingsUserProfile;
  nav: SettingsNavGroup[];
  sections: SettingsContentSection[];
  wallpaperPresets?: SettingsWallpaperPreset[];
}
