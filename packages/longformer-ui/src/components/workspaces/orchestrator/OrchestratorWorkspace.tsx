import { useState } from "react";
import { ScrollArea } from "../../primitives/ScrollArea";
import { SidebarPane } from "../../shell/NavSidebar";
import { DashboardView } from "./DashboardView";
import { OrchestratorSidebar } from "./OrchestratorSidebar";
import type { OrchestratorView, OrchestratorWorkspaceData } from "./types";
import styles from "./OrchestratorWorkspace.module.css";

export interface OrchestratorWorkspaceProps {
  data: OrchestratorWorkspaceData;
  view?: OrchestratorView;
  defaultView?: OrchestratorView;
  onViewChange?: (view: OrchestratorView) => void;
}

function PlaceholderView({ title, description }: { title: string; description: string }) {
  return (
    <div className={styles.placeholder}>
      <h1 className={styles.placeholderTitle}>{title}</h1>
      <p className={styles.placeholderText}>{description}</p>
    </div>
  );
}

/** Agent orchestration portal — monitor agents, jobs, traces, and playground runs. */
export function OrchestratorWorkspace({
  data,
  view: controlledView,
  defaultView = "dashboard",
  onViewChange,
}: OrchestratorWorkspaceProps) {
  const [internalView, setInternalView] = useState<OrchestratorView>(defaultView);
  const activeView = controlledView ?? internalView;

  function handleViewChange(next: OrchestratorView) {
    if (onViewChange) onViewChange(next);
    else setInternalView(next);
  }

  function renderMain() {
    switch (activeView) {
      case "dashboard":
        return <DashboardView data={data} />;
      case "agents":
        return (
          <PlaceholderView
            title="Agents"
            description="Configure agent roles, tool access, and execution policies."
          />
        );
      case "jobs":
        return (
          <PlaceholderView
            title="Jobs"
            description="Track queued, running, and completed orchestration jobs across your fleet."
          />
        );
      case "playground":
        return (
          <PlaceholderView
            title="Playground"
            description="Run ad-hoc agent workflows and inspect responses in a sandbox environment."
          />
        );
      case "playground-history":
        return (
          <PlaceholderView
            title="Playground History"
            description="Review past playground sessions, inputs, and agent outputs."
          />
        );
      case "traces":
        return (
          <PlaceholderView
            title="Traces"
            description="Follow distributed traces across agents, tools, and model calls."
          />
        );
      case "logs":
        return (
          <PlaceholderView title="Logs" description="Stream structured logs from agents, tools, and the runtime." />
        );
      case "settings":
        return (
          <PlaceholderView
            title="Settings"
            description="Manage API keys, model providers, retention, and workspace access."
          />
        );
      default:
        return <DashboardView data={data} />;
    }
  }

  return (
    <div className={styles.workspace}>
      <SidebarPane handleLabel="Resize orchestrator sidebar" className={styles.sidebarResizable}>
        <OrchestratorSidebar data={data} view={activeView} onViewChange={handleViewChange} />
      </SidebarPane>
      <ScrollArea className={styles.main}>{renderMain()}</ScrollArea>
    </div>
  );
}

export type {
  OrchestratorView,
  OrchestratorWorkspaceData,
  OrchestratorNavItem,
  OrchestratorMetric,
  OrchestratorAgent,
} from "./types";
