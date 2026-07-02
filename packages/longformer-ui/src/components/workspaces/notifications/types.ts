import type { IconName } from "../../../icons";

export type NotificationType = "mention" | "comment" | "assignment" | "reaction" | "system" | "invite";

export interface NotificationItem {
  id: string;
  type: NotificationType;
  /** Who triggered the notification. Omit for system notifications (falls back to a type icon). */
  actor?: { name: string; avatarSrc?: string };
  /** Full sentence, e.g. "Dana Cho mentioned you in Addressing User Feedback". */
  message: string;
  /** Optional secondary line, e.g. a quoted comment preview. */
  detail?: string;
  timestamp: string;
  read?: boolean;
  /** Bucket used to group rows, e.g. "Today" / "Yesterday" / "Earlier". Defaults to a single group. */
  group?: string;
}

export const NOTIFICATION_TYPE_ICON: Record<NotificationType, IconName> = {
  mention: "hash",
  comment: "chat",
  assignment: "check",
  reaction: "star",
  system: "bell",
  invite: "mail",
};
