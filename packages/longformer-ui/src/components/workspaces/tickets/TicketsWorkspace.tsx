import { useState } from "react";
import { ScrollArea } from "../../primitives/ScrollArea";
import { TicketsListView } from "./TicketsListView";
import { TicketsSidebar } from "./TicketsSidebar";
import type { TicketsView, TicketsWorkspaceData } from "./types";
import styles from "./TicketsWorkspace.module.css";

export interface TicketsWorkspaceProps {
  data: TicketsWorkspaceData;
  view?: TicketsView;
  defaultView?: TicketsView;
  onViewChange?: (view: TicketsView) => void;
}

function PlaceholderView({ title, description }: { title: string; description: string }) {
  return (
    <div className={styles.placeholder}>
      <h1 className={styles.placeholderTitle}>{title}</h1>
      <p className={styles.placeholderText}>{description}</p>
    </div>
  );
}

/** Helpdesk workspace — ticket queues, KPI dashboard, and customer support workflows. */
export function TicketsWorkspace({
  data,
  view: controlledView,
  defaultView = "ticket",
  onViewChange,
}: TicketsWorkspaceProps) {
  const [internalView, setInternalView] = useState<TicketsView>(defaultView);
  const activeView = controlledView ?? internalView;

  function handleViewChange(next: TicketsView) {
    if (onViewChange) onViewChange(next);
    else setInternalView(next);
  }

  function renderMain() {
    switch (activeView) {
      case "ticket":
        return <TicketsListView data={data} />;
      case "dashboard":
        return (
          <PlaceholderView
            title="Dashboard"
            description="Overview of team performance, SLA compliance, and ticket volume trends."
          />
        );
      case "inbox":
        return (
          <PlaceholderView
            title="Inbox"
            description="Unified inbox for new and unassigned tickets across all channels."
          />
        );
      case "notification":
        return (
          <PlaceholderView
            title="Notifications"
            description="Alerts for escalations, mentions, and SLA breaches."
          />
        );
      case "knowledge-base":
        return (
          <PlaceholderView
            title="Knowledge Base"
            description="Articles, macros, and canned responses for faster resolution."
          />
        );
      case "customer":
        return (
          <PlaceholderView
            title="Customers"
            description="Customer profiles, contact history, and account details."
          />
        );
      case "forum":
        return (
          <PlaceholderView title="Forum" description="Community discussions and public support threads." />
        );
      case "report":
        return (
          <PlaceholderView
            title="Reports"
            description="Analytics on resolution time, satisfaction scores, and agent workload."
          />
        );
      default:
        return <TicketsListView data={data} />;
    }
  }

  return (
    <div className={styles.workspace}>
      <TicketsSidebar data={data} view={activeView} onViewChange={handleViewChange} />
      <ScrollArea className={styles.main}>{renderMain()}</ScrollArea>
    </div>
  );
}

export type {
  TicketsView,
  TicketsWorkspaceData,
  TicketsNavItem,
  TicketMetric,
  Ticket,
  TicketStatus,
  TicketPriority,
  TicketType,
} from "./types";
