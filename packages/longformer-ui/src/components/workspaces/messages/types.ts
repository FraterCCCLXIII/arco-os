export type PresenceStatus = "online" | "away" | "offline";

export const PRESENCE_LABEL: Record<PresenceStatus, string> = {
  online: "Active now",
  away: "Away",
  offline: "Offline",
};

export interface MessageContact {
  id: string;
  name: string;
  avatarSrc?: string;
  status?: PresenceStatus;
  /** Group DM (e.g. "Design Team") — avatars/status dots are hidden and sender names show above bubbles. */
  isGroup?: boolean;
  lastMessage?: string;
  timestamp?: string;
  unreadCount?: number;
  typing?: boolean;
}

export interface DirectMessage {
  id: string;
  /** Use "me" for the current user's own messages. */
  senderId: string;
  senderName?: string;
  senderAvatarSrc?: string;
  content: string;
  timestamp: string;
}
