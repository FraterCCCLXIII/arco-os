import { useMemo, useState } from "react";
import { Icon } from "../../../icons";
import { Button } from "../../primitives/Button";
import { Card } from "../../primitives/Card";
import { Input } from "../../primitives/Input";
import { Menu } from "../../primitives/Menu";
import { cx } from "../../../utils/cx";
import type { OrchestratorAgent, OrchestratorMetric, OrchestratorWorkspaceData } from "./types";
import styles from "./DashboardView.module.css";

export interface DashboardViewProps {
  data: OrchestratorWorkspaceData;
}

const PAGE_SIZE = 5;

const DEFAULT_COLUMNS = {
  agent: true,
  description: true,
  toolsCount: true,
  traceCount: true,
  lastExecuted: true,
} as const;

type ColumnKey = keyof typeof DEFAULT_COLUMNS;

function MetricCard({ metric }: { metric: OrchestratorMetric }) {
  const iconClass =
    metric.tone === "success"
      ? styles.metricIconSuccess
      : metric.tone === "neutral"
        ? styles.metricIconNeutral
        : styles.metricIconAccent;

  return (
    <Card padding="lg" className={styles.metricCard}>
      <div className={styles.metricHead}>
        <span className={styles.metricLabel}>{metric.label}</span>
        <span className={cx(styles.metricIcon, iconClass)}>
          <Icon name={metric.icon} size={14} />
        </span>
      </div>
      <div className={cx(styles.metricValue, metric.tone === "success" && styles.metricValueSuccess)}>
        {metric.value}
      </div>
    </Card>
  );
}

/** Orchestrator home — system vitals and searchable agent registry. */
export function DashboardView({ data }: DashboardViewProps) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [sortAsc, setSortAsc] = useState(false);
  const [columns, setColumns] = useState(DEFAULT_COLUMNS);

  const filteredAgents = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const rows = normalized
      ? data.agents.filter(
          (agent) =>
            agent.name.toLowerCase().includes(normalized) ||
            agent.description.toLowerCase().includes(normalized),
        )
      : [...data.agents];

    rows.sort((a, b) => (sortAsc ? a.lastExecutedAt - b.lastExecutedAt : b.lastExecutedAt - a.lastExecutedAt));

    return rows;
  }, [data.agents, query, sortAsc]);

  const totalPages = Math.max(1, Math.ceil(filteredAgents.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageAgents = filteredAgents.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  function toggleColumn(key: ColumnKey) {
    setColumns((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function renderPagination() {
    const pages = Array.from({ length: totalPages }, (_, index) => index + 1).slice(0, 10);

    return (
      <div className={styles.pagination}>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={currentPage <= 1}
          onClick={() => setPage((prev) => Math.max(1, prev - 1))}
        >
          Previous
        </Button>
        {pages.map((pageNumber) => (
          <Button
            key={pageNumber}
            type="button"
            variant="ghost"
            size="sm"
            className={cx(styles.pageBtn, pageNumber === currentPage && styles.pageBtnActive)}
            aria-current={pageNumber === currentPage ? "page" : undefined}
            onClick={() => setPage(pageNumber)}
          >
            {pageNumber}
          </Button>
        ))}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={currentPage >= totalPages}
          onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
        >
          Next
        </Button>
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      <button type="button" className={styles.breadcrumb}>
        Home
      </button>

      <div className={styles.metrics}>
        {data.metrics.map((metric) => (
          <MetricCard key={metric.id} metric={metric} />
        ))}
      </div>

      <section className={styles.agentsSection} aria-label="Agents">
        <div className={styles.toolbar}>
          <Input
            wrapperClassName={styles.search}
            placeholder="Find Agent"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(1);
            }}
            startSlot={<Icon name="search" size={16} />}
            aria-label="Find agent"
          />

          <Menu
            aria-label="Toggle columns"
            align="end"
            trigger={
              <Button type="button" variant="secondary" size="sm" className={styles.columnsBtn}>
                Columns
                <Icon name="chevron-down" size={14} />
              </Button>
            }
            items={[
              { id: "agent", label: "Agent", onSelect: () => toggleColumn("agent") },
              { id: "description", label: "Description", onSelect: () => toggleColumn("description") },
              { id: "tools", label: "Tools Count", onSelect: () => toggleColumn("toolsCount") },
              { id: "traces", label: "Trace Count", onSelect: () => toggleColumn("traceCount") },
              { id: "executed", label: "Last Executed", onSelect: () => toggleColumn("lastExecuted") },
            ]}
          />
        </div>

        <Card padding="none" className={styles.tableCard}>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  {columns.agent && <th scope="col">Agent</th>}
                  {columns.description && <th scope="col">Description</th>}
                  {columns.toolsCount && <th scope="col">Tools Count</th>}
                  {columns.traceCount && <th scope="col">Trace Count</th>}
                  {columns.lastExecuted && (
                    <th scope="col">
                      <button
                        type="button"
                        className={styles.sortBtn}
                        onClick={() => setSortAsc((prev) => !prev)}
                        aria-label={`Sort by last executed ${sortAsc ? "ascending" : "descending"}`}
                      >
                        Last Executed
                        <Icon name={sortAsc ? "chevron-up" : "chevron-down"} size={12} />
                      </button>
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {pageAgents.length === 0 ? (
                  <tr>
                    <td colSpan={Object.values(columns).filter(Boolean).length} className={styles.empty}>
                      No agents match your search.
                    </td>
                  </tr>
                ) : (
                  pageAgents.map((agent) => <AgentRow key={agent.id} agent={agent} columns={columns} />)
                )}
              </tbody>
            </table>
          </div>
          {renderPagination()}
        </Card>
      </section>
    </div>
  );
}

function AgentRow({
  agent,
  columns,
}: {
  agent: OrchestratorAgent;
  columns: Record<ColumnKey, boolean>;
}) {
  return (
    <tr>
      {columns.agent && (
        <td>
          <span className={styles.agentName}>{agent.name}</span>
        </td>
      )}
      {columns.description && (
        <td>
          <span className={styles.agentDescription}>{agent.description}</span>
        </td>
      )}
      {columns.toolsCount && <td>{agent.toolsCount}</td>}
      {columns.traceCount && <td>{agent.traceCount}</td>}
      {columns.lastExecuted && <td>{agent.lastExecuted}</td>}
    </tr>
  );
}
