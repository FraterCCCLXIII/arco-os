import type { IconName } from "../../../icons";

export type OrchestratorView =
  | "dashboard"
  | "agents"
  | "jobs"
  | "playground"
  | "playground-history"
  | "traces"
  | "logs"
  | "settings";

export interface OrchestratorNavItem {
  id: string;
  label: string;
  icon: IconName;
  view: OrchestratorView;
}

export interface OrchestratorMetric {
  id: string;
  label: string;
  value: string;
  icon: IconName;
  tone?: "accent" | "success" | "neutral";
}

export interface OrchestratorAgent {
  id: string;
  name: string;
  description: string;
  toolsCount: number;
  traceCount: number;
  lastExecuted: string;
  lastExecutedAt: number;
}

export interface OrchestratorWorkspaceData {
  productName: string;
  userName: string;
  userEmail: string;
  navItems: OrchestratorNavItem[];
  metrics: OrchestratorMetric[];
  agents: OrchestratorAgent[];
}
