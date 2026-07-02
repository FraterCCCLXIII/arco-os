import type { IconName } from "../../../icons";

export type ExtensionView = "agent-skills" | "plugins" | "prompts" | "app-templates";

export interface ExtensionNavItem {
  id: string;
  label: string;
  icon: IconName;
  view: ExtensionView;
  badge?: string;
}

export interface AgentSkill {
  id: string;
  name: string;
  description: string;
  author: string;
  enabled: boolean;
  tags: string[];
  triggerCount: number;
  updatedAt: string;
}

export interface Plugin {
  id: string;
  name: string;
  description: string;
  author: string;
  version: string;
  installed: boolean;
  icon: IconName;
  category: string;
  rating?: number;
}

export interface Prompt {
  id: string;
  title: string;
  body: string;
  category: string;
  usageCount: number;
  starred?: boolean;
  updatedAt: string;
}

export interface ExtensionAppTemplate {
  id: string;
  name: string;
  description: string;
  author: string;
  icon: IconName;
  stack: string[];
  installs: number;
  featured?: boolean;
}

export interface ExtensionsWorkspaceData {
  workspaceName: string;
  userName: string;
  navItems: ExtensionNavItem[];
  agentSkills: AgentSkill[];
  plugins: Plugin[];
  prompts: Prompt[];
  appTemplates: ExtensionAppTemplate[];
}

export function filterByQuery<T extends { name?: string; title?: string; description?: string; author?: string }>(
  items: T[],
  query: string,
): T[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return items;

  return items.filter((item) => {
    const name = item.name ?? item.title ?? "";
    return (
      name.toLowerCase().includes(normalized) ||
      item.description?.toLowerCase().includes(normalized) ||
      item.author?.toLowerCase().includes(normalized)
    );
  });
}
