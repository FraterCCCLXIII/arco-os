import { useState } from "react";
import { ScrollArea } from "../../primitives/ScrollArea";
import { SidebarPane } from "../../shell/NavSidebar";
import { AuditView } from "./AuditView";
import { DashboardView } from "./DashboardView";
import { EnvSetsView } from "./EnvSetsView";
import { GrantsView } from "./GrantsView";
import { PassportSidebar } from "./PassportSidebar";
import { VaultView } from "./VaultView";
import type { PassportView, PassportWorkspaceData } from "./types";
import styles from "./PassportWorkspace.tailwind";

export interface PassportWorkspaceProps {
  data: PassportWorkspaceData;
  view?: PassportView;
  defaultView?: PassportView;
  onViewChange?: (view: PassportView) => void;
}

/** Passport — encrypted vault for passwords, API keys, secret keys, and env variables with agent grants. */
export function PassportWorkspace({
  data,
  view: controlledView,
  defaultView = "dashboard",
  onViewChange,
}: PassportWorkspaceProps) {
  const [internalView, setInternalView] = useState<PassportView>(defaultView);
  const activeView = controlledView ?? internalView;

  function handleViewChange(next: PassportView) {
    if (onViewChange) onViewChange(next);
    else setInternalView(next);
  }

  function renderMain() {
    switch (activeView) {
      case "dashboard":
        return <DashboardView data={data} onNavigate={handleViewChange} />;
      case "vault":
        return <VaultView data={data} />;
      case "env-sets":
        return <EnvSetsView data={data} />;
      case "grants":
        return <GrantsView data={data} />;
      case "audit":
        return <AuditView data={data} />;
      default:
        return <DashboardView data={data} onNavigate={handleViewChange} />;
    }
  }

  return (
    <div className={styles.workspace} aria-label="Passport">
      <SidebarPane handleLabel="Resize passport sidebar" className={styles.sidebarResizable}>
        <PassportSidebar data={data} view={activeView} onViewChange={handleViewChange} />
      </SidebarPane>
      <ScrollArea className={styles.main}>{renderMain()}</ScrollArea>
    </div>
  );
}

export type {
  PassportView,
  PassportWorkspaceData,
  PassportSecret,
  PassportSecretKind,
  PassportEnvSet,
  PassportAgent,
  PassportGrant,
  PassportAuditEntry,
} from "./types";
