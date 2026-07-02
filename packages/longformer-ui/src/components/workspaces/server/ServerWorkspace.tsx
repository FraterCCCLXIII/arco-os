import { useState } from "react";
import { ScrollArea } from "../../primitives/ScrollArea";
import { SidebarPane } from "../../shell/NavSidebar";
import { DeploymentsView } from "./DeploymentsView";
import { ProjectsDashboardView } from "./ProjectsDashboardView";
import { ServerSidebar } from "./ServerSidebar";
import { ServersView } from "./ServersView";
import { StorageWidgetsView } from "./StorageWidgetsView";
import type { ServerView, ServerWorkspaceData } from "./types";
import styles from "./ServerWorkspace.module.css";

export interface ServerWorkspaceProps {
  data: ServerWorkspaceData;
  view?: ServerView;
  defaultView?: ServerView;
  onViewChange?: (view: ServerView) => void;
}

function PlaceholderView({ title, description }: { title: string; description: string }) {
  return (
    <div className={styles.placeholder}>
      <h1 className={styles.placeholderTitle}>{title}</h1>
      <p className={styles.placeholderText}>{description}</p>
    </div>
  );
}

/** Cloud & Docker ops workspace — deploy frontends, backends, and containers (Vercel + Coolify inspired). */
export function ServerWorkspace({
  data,
  view: controlledView,
  defaultView = "dashboard",
  onViewChange,
}: ServerWorkspaceProps) {
  const [internalView, setInternalView] = useState<ServerView>(defaultView);
  const activeView = controlledView ?? internalView;

  function handleViewChange(next: ServerView) {
    if (onViewChange) onViewChange(next);
    else setInternalView(next);
  }

  function renderMain() {
    switch (activeView) {
      case "dashboard":
        return <ProjectsDashboardView data={data} />;
      case "deployments":
        return <DeploymentsView data={data} />;
      case "storage":
        return <StorageWidgetsView data={data} />;
      case "servers":
        return <ServersView data={data} />;
      case "sources":
        return (
          <PlaceholderView
            title="Sources"
            description="Connect GitHub, GitLab, or Bitbucket repositories as deployment sources."
          />
        );
      case "domains":
        return (
          <PlaceholderView
            title="Domains"
            description="Manage custom domains, SSL certificates, and DNS records for your apps."
          />
        );
      default:
        return <ProjectsDashboardView data={data} />;
    }
  }

  return (
    <div className={styles.workspace}>
      <SidebarPane handleLabel="Resize server sidebar" className={styles.sidebarResizable}>
        <ServerSidebar data={data} view={activeView} onViewChange={handleViewChange} />
      </SidebarPane>
      <ScrollArea className={styles.main}>{renderMain()}</ScrollArea>
    </div>
  );
}

export type {
  ServerView,
  ServerWorkspaceData,
  ServerProject,
  ServerDeployment,
  ServerInstance,
  StorageVolume,
  StorageBucket,
  DatabaseStorage,
  AppKind,
  DeployStatus,
} from "./types";
