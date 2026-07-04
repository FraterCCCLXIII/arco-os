import type { IconName } from "../../../icons";

export type LifePlanningView =
  | "dashboard"
  | "health"
  | "mind"
  | "finances"
  | "housing"
  | "investments"
  | "retirement"
  | "ai-coach"
  | "goals"
  | "settings";

export type LifeModuleId = "health" | "mind" | "finances" | "housing" | "investments" | "retirement";

export type GoalStatus = "on-track" | "at-risk" | "completed" | "not-started";

export interface LifePlanningNavItem {
  id: string;
  label: string;
  icon: IconName;
  view: LifePlanningView;
  section?: "overview" | "modules" | "tools";
}

export interface LifeMetric {
  id: string;
  label: string;
  value: string;
  change?: string;
  icon?: IconName;
  tone?: "accent" | "success" | "warning" | "neutral";
}

export interface LifeMilestone {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: string;
}

export interface LifeGoal {
  id: string;
  title: string;
  description: string;
  moduleId: LifeModuleId;
  progress: number;
  targetDate?: string;
  status: GoalStatus;
  milestones: LifeMilestone[];
}

export interface LifeModule {
  id: LifeModuleId;
  label: string;
  description: string;
  icon: IconName;
  overallProgress: number;
  activeGoals: number;
  completedGoals: number;
  metrics: LifeMetric[];
  goals: LifeGoal[];
  insights: string[];
}

export interface AiCoachMessage {
  id: string;
  role: "assistant" | "user";
  content: string;
  timestamp: string;
  relatedModule?: LifeModuleId;
}

export interface AiRecommendation {
  id: string;
  title: string;
  description: string;
  moduleId: LifeModuleId;
  priority: "high" | "medium" | "low";
  actionLabel?: string;
}

export interface LifeActivity {
  id: string;
  title: string;
  moduleId: LifeModuleId;
  type: string;
  timestamp: string;
  status: "success" | "warning" | "info";
}

export interface LifePlanningWorkspaceData {
  productName: string;
  userName: string;
  tagline: string;
  navItems: LifePlanningNavItem[];
  overviewMetrics: LifeMetric[];
  modules: LifeModule[];
  aiCoach: {
    greeting: string;
    messages: AiCoachMessage[];
    recommendations: AiRecommendation[];
    weeklyFocus: string;
  };
  recentActivity: LifeActivity[];
}

export function getModuleById(data: LifePlanningWorkspaceData, id: LifeModuleId): LifeModule | undefined {
  return data.modules.find((module) => module.id === id);
}

export function getAllGoals(data: LifePlanningWorkspaceData): LifeGoal[] {
  return data.modules.flatMap((module) => module.goals);
}

export function filterGoalsByModule(data: LifePlanningWorkspaceData, moduleId?: LifeModuleId): LifeGoal[] {
  const goals = getAllGoals(data);
  if (!moduleId) return goals;
  return goals.filter((goal) => goal.moduleId === moduleId);
}
