import type { IconName } from "../../../icons";
import type { BadgeTone } from "../../primitives/Badge";

export type AppsSubpage = "installed" | "marketplace";

export type MarketplaceCategoryId = "featured" | "productivity" | "communication" | "developer" | "creative";

export interface MarketplaceCategory {
  id: MarketplaceCategoryId;
  label: string;
}

export const MARKETPLACE_CATEGORIES: MarketplaceCategory[] = [
  { id: "featured", label: "Featured" },
  { id: "productivity", label: "Productivity" },
  { id: "communication", label: "Communication" },
  { id: "developer", label: "Developer" },
  { id: "creative", label: "Creative" },
];

export interface AppListing {
  id: string;
  label: string;
  icon: IconName;
  tone?: BadgeTone;
  description?: string;
  category?: MarketplaceCategoryId;
}

export interface MarketplaceApp extends AppListing {
  author?: string;
  rating?: number;
  badge?: string;
  installed: boolean;
}

/** Starter layouts for the create-app flow in the bottom tray. */
export type AppTemplateId = "dashboard" | "chat" | "forms" | "kanban" | "notes" | "blank";

export interface AppTemplate {
  id: AppTemplateId;
  label: string;
  description: string;
  icon: IconName;
  tone?: BadgeTone;
}

export const APP_TEMPLATES: AppTemplate[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    description: "Charts, metrics, and KPI panels",
    icon: "grid",
    tone: "accent",
  },
  {
    id: "chat",
    label: "Chat App",
    description: "Conversations with an AI assistant",
    icon: "chat",
    tone: "accent",
  },
  {
    id: "forms",
    label: "Form Builder",
    description: "Collect input with configurable fields",
    icon: "edit",
    tone: "success",
  },
  {
    id: "kanban",
    label: "Kanban Board",
    description: "Tasks organized in columns",
    icon: "check",
    tone: "warning",
  },
  {
    id: "notes",
    label: "Notes App",
    description: "Pages and rich text documents",
    icon: "notebook",
    tone: "success",
  },
  {
    id: "blank",
    label: "Blank Canvas",
    description: "Start from scratch with an empty shell",
    icon: "app-window",
    tone: "neutral",
  },
];

export interface CreateAppPayload {
  name: string;
  templateId: AppTemplateId;
}
