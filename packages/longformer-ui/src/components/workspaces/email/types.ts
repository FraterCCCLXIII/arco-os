import type { ReactNode } from "react";

export interface EmailThread {
  id: string;
  senderName: string;
  senderAvatarSrc?: string;
  subject: string;
  preview: string;
  timestamp: string;
  unread?: boolean;
  starred?: boolean;
}

export interface EmailDetailMessage {
  id: string;
  senderName: string;
  senderAvatarSrc?: string;
  timestamp: string;
  body: ReactNode;
}
