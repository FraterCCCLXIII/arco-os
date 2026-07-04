import type { AppIconHue } from "../../../app-tones/app-tones";
import type { AvatarStatus } from "../../primitives/Avatar";

export interface SlackChannelIconConfig {
  /** Emoji or short glyph shown inside the channel tile. */
  emoji?: string;
  /** Tile background hue; defaults from the channel id when omitted. */
  hue?: AppIconHue;
  /** Optional image URL; takes precedence over `emoji`. */
  image?: string;
}

export interface SlackWorkspaceItem {
  id: string;
  label: string;
  /** Short label for the workspace rail avatar. */
  initials: string;
  accent?: string;
  unreadCount?: number;
}

export interface SlackNavItem {
  id: string;
  label: string;
  icon: "home" | "chat" | "bell" | "folder" | "bookmark";
  badgeCount?: number;
  active?: boolean;
}

export interface SlackChannel {
  id: string;
  name: string;
  icon?: SlackChannelIconConfig;
  unread?: boolean;
  mentionCount?: number;
}

export interface SlackDirectMessage {
  id: string;
  name: string;
  avatarSrc?: string;
  status?: AvatarStatus;
  unreadCount?: number;
  isGroup?: boolean;
}

export interface SlackMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatarSrc?: string;
  content: string;
  timestamp: string;
}

export interface SlackMember {
  id: string;
  name: string;
  title?: string;
  email?: string;
  avatarSrc?: string;
  status?: AvatarStatus;
  deactivated?: boolean;
}

export type SlackConversation =
  | { kind: "channel"; channel: SlackChannel }
  | { kind: "dm"; dm: SlackDirectMessage };
