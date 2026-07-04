import { useMemo, useState } from "react";
import { Icon, type IconName } from "../../../icons";
import { Avatar } from "../../primitives/Avatar";
import { Button } from "../../primitives/Button";
import { Card } from "../../primitives/Card";
import { cx } from "../../../utils/cx";
import type {
  Ticket,
  TicketMetric,
  TicketPriority,
  TicketType,
  TicketsWorkspaceData,
} from "./types";
import { filterTickets } from "./types";
import styles from "./TicketsListView.tailwind";

export interface TicketsListViewProps {
  data: TicketsWorkspaceData;
}

const PRIORITY_ICON: Record<TicketPriority, IconName> = {
  urgent: "zap",
  medium: "target",
  low: "leaf",
};

const TYPE_ICON: Record<TicketType, IconName> = {
  incident: "zap",
  problem: "package",
  question: "message-square",
  suggestion: "sparkles",
};

function MetricCard({ metric }: { metric: TicketMetric }) {
  const trendUp = metric.trend >= 0;

  return (
    <Card padding="lg" className={styles.metricCard}>
      <span className={styles.metricLabel}>{metric.label}</span>
      <div className={styles.metricRow}>
        <span className={styles.metricValue}>{metric.value}</span>
        <span className={cx(styles.metricTrend, trendUp ? styles.trendUp : styles.trendDown)}>
          <Icon name={trendUp ? "chevron-up" : "chevron-down"} size={12} />
          {Math.abs(metric.trend)}%
        </span>
      </div>
    </Card>
  );
}

function TicketRow({ ticket }: { ticket: Ticket }) {
  return (
    <tr>
      <td className={styles.checkboxCol}>
        <input type="checkbox" aria-label={`Select ticket ${ticket.displayId}`} />
      </td>
      <td>
        <div className={styles.ticketIdCell}>
          <span className={styles.ticketId}>{ticket.displayId}</span>
          <span
            className={cx(
              styles.priorityBadge,
              ticket.priority === "urgent" && styles.priorityUrgent,
              ticket.priority === "medium" && styles.priorityMedium,
              ticket.priority === "low" && styles.priorityLow,
            )}
          >
            <Icon name={PRIORITY_ICON[ticket.priority]} size={12} />
            {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
          </span>
        </div>
      </td>
      <td>
        <span className={styles.subject}>{ticket.subject}</span>
      </td>
      <td>
        <span className={styles.intent}>{ticket.intent}</span>
      </td>
      <td>
        <span className={styles.typeCell}>
          <Icon name={TYPE_ICON[ticket.type]} size={14} />
          {ticket.type.charAt(0).toUpperCase() + ticket.type.slice(1)}
        </span>
      </td>
      <td>
        <div className={styles.clientCell}>
          <Avatar name={ticket.clientName} size="sm" />
          <span className={styles.clientName}>{ticket.clientName}</span>
        </div>
      </td>
      <td>
        <span className={styles.email}>{ticket.clientEmail}</span>
      </td>
      <td className={styles.actionsCol}>
        <button type="button" className={styles.actionBtn} aria-label={`Actions for ${ticket.displayId}`}>
          <Icon name="more-horizontal" size={16} />
        </button>
      </td>
    </tr>
  );
}

/** Ticket queue — KPI summary, filters, automation banner, and searchable ticket table. */
export function TicketsListView({ data }: TicketsListViewProps) {
  const [showAutomation, setShowAutomation] = useState(true);
  const [priorityFilter, setPriorityFilter] = useState<TicketPriority | "all">("all");
  const [typeFilter, setTypeFilter] = useState<TicketType | "all">("all");

  const visibleTickets = useMemo(
    () =>
      filterTickets(data.tickets, {
        priority: priorityFilter,
        type: typeFilter,
      }),
    [data.tickets, priorityFilter, typeFilter],
  );

  return (
    <div className={styles.ticketView}>
      <header className={styles.header}>
        <h1 className={styles.title}>Ticket</h1>
        <div className={styles.headerActions}>
          <Button type="button" variant="secondary" size="sm">
            Focus Mode
          </Button>
          <Button type="button" variant="primary" size="sm" className={styles.addTicketBtn}>
            Add Ticket
          </Button>
        </div>
      </header>

      <div className={styles.metrics}>
        {data.metrics.map((metric) => (
          <MetricCard key={metric.id} metric={metric} />
        ))}
      </div>

      <div className={styles.filters}>
        <button type="button" className={styles.filterBtn}>
          Last 6 Days
          <Icon name="chevron-down" size={14} />
        </button>
        <button type="button" className={styles.filterBtn}>
          Daily
          <Icon name="chevron-down" size={14} />
        </button>
        <button
          type="button"
          className={styles.filterBtn}
          onClick={() =>
            setPriorityFilter((prev) =>
              prev === "all" ? "urgent" : prev === "urgent" ? "medium" : prev === "medium" ? "low" : "all",
            )
          }
        >
          Priority{priorityFilter !== "all" ? `: ${priorityFilter}` : ""}
          <Icon name="chevron-down" size={14} />
        </button>
        <button
          type="button"
          className={styles.filterBtn}
          onClick={() =>
            setTypeFilter((prev) =>
              prev === "all"
                ? "incident"
                : prev === "incident"
                  ? "problem"
                  : prev === "problem"
                    ? "question"
                    : prev === "question"
                      ? "suggestion"
                      : "all",
            )
          }
        >
          Type{typeFilter !== "all" ? `: ${typeFilter}` : ""}
          <Icon name="chevron-down" size={14} />
        </button>
        <button type="button" className={styles.filterBtn}>
          Raised Date
          <Icon name="chevron-down" size={14} />
        </button>
      </div>

      {showAutomation && data.automationCount > 0 && (
        <div className={styles.automationBanner} role="status">
          <p className={styles.automationText}>
            {data.automationCount} tickets are currently handled by KiriOne automatically
          </p>
          <div className={styles.automationActions}>
            <button type="button" className={styles.automationBtn} onClick={() => setShowAutomation(false)}>
              Dismiss
            </button>
            <button type="button" className={cx(styles.automationBtn, styles.automationBtnPrimary)}>
              View Ticket
            </button>
          </div>
        </div>
      )}

      <Card padding="none" className={styles.tableCard}>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th scope="col" className={styles.checkboxCol}>
                  <input type="checkbox" aria-label="Select all tickets" />
                </th>
                <th scope="col">Ticket ID</th>
                <th scope="col">Subject</th>
                <th scope="col">Intent</th>
                <th scope="col">Type</th>
                <th scope="col">Client</th>
                <th scope="col">Client Email</th>
                <th scope="col" className={styles.actionsCol} aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {visibleTickets.length === 0 ? (
                <tr>
                  <td colSpan={8} className={styles.empty}>
                    No tickets match the current filters.
                  </td>
                </tr>
              ) : (
                visibleTickets.map((ticket) => <TicketRow key={ticket.id} ticket={ticket} />)
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
