import { useState } from "react";
import { ScrollArea } from "../../primitives/ScrollArea";
import { SidebarPane } from "../../shell/NavSidebar";
import { AiCoachView } from "./AiCoachView";
import { DashboardView } from "./DashboardView";
import { GoalsView } from "./GoalsView";
import { LifePlanningSidebar } from "./LifePlanningSidebar";
import { ModuleView } from "./ModuleView";
import type { LifeModuleId, LifePlanningView, LifePlanningWorkspaceData } from "./types";
import { getModuleById } from "./types";
import styles from "./LifePlanningWorkspace.module.css";

export interface LifePlanningWorkspaceProps {
  data: LifePlanningWorkspaceData;
  view?: LifePlanningView;
  defaultView?: LifePlanningView;
  onViewChange?: (view: LifePlanningView) => void;
}

function PlaceholderView({ title, description }: { title: string; description: string }) {
  return (
    <div className={styles.placeholder}>
      <h1 className={styles.placeholderTitle}>{title}</h1>
      <p className={styles.placeholderText}>{description}</p>
    </div>
  );
}

const MODULE_VIEWS: LifePlanningView[] = ["health", "mind", "finances", "housing", "investments", "retirement"];

function isModuleView(view: LifePlanningView): view is LifeModuleId {
  return MODULE_VIEWS.includes(view);
}

/** AI-assisted life planning — track goals across health, mind, finances, housing, investments, and retirement. */
export function LifePlanningWorkspace({
  data,
  view: controlledView,
  defaultView = "dashboard",
  onViewChange,
}: LifePlanningWorkspaceProps) {
  const [internalView, setInternalView] = useState<LifePlanningView>(defaultView);
  const activeView = controlledView ?? internalView;

  function handleViewChange(next: LifePlanningView) {
    if (onViewChange) onViewChange(next);
    else setInternalView(next);
  }

  function handleNavigateModule(moduleId: LifeModuleId) {
    handleViewChange(moduleId);
  }

  function renderMain() {
    if (isModuleView(activeView)) {
      const module = getModuleById(data, activeView);
      if (module) return <ModuleView module={module} />;
    }

    switch (activeView) {
      case "dashboard":
        return <DashboardView data={data} onNavigateModule={handleNavigateModule} />;
      case "ai-coach":
        return <AiCoachView data={data} onNavigateModule={handleNavigateModule} />;
      case "goals":
        return <GoalsView data={data} />;
      case "settings":
        return (
          <PlaceholderView
            title="Settings"
            description="Configure notification preferences, data connections, and AI coaching style."
          />
        );
      default:
        return <DashboardView data={data} onNavigateModule={handleNavigateModule} />;
    }
  }

  return (
    <div className={styles.workspace}>
      <SidebarPane handleLabel="Resize life planning sidebar" className={styles.sidebarResizable} defaultWidth={220} maxWidth={280}>
        <LifePlanningSidebar data={data} view={activeView} onViewChange={handleViewChange} />
      </SidebarPane>
      <ScrollArea className={styles.main}>{renderMain()}</ScrollArea>
    </div>
  );
}

export type {
  LifePlanningView,
  LifePlanningWorkspaceData,
  LifePlanningNavItem,
  LifeModule,
  LifeModuleId,
  LifeGoal,
  LifeMetric,
  LifeMilestone,
  GoalStatus,
  AiCoachMessage,
  AiRecommendation,
  LifeActivity,
} from "./types";
