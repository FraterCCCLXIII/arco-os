import { Icon } from "../../../icons";
import { Badge } from "../../primitives/Badge";
import { Button } from "../../primitives/Button";
import { Card } from "../../primitives/Card";
import { cx } from "../../../utils/cx";
import type { PassportMetric, PassportView, PassportWorkspaceData } from "./types";
import { countSecretsByKind } from "./types";
import styles from "./PassportPage.module.css";

export interface DashboardViewProps {
  data: PassportWorkspaceData;
  onNavigate?: (view: PassportView) => void;
}

function MetricCard({ metric }: { metric: PassportMetric }) {
  return (
    <Card padding="lg" className={styles.metricCard}>
      <div className={styles.metricHead}>
        <span className={styles.metricLabel}>{metric.label}</span>
        {metric.icon && (
          <span className={styles.metricIcon}>
            <Icon name={metric.icon} size={14} />
          </span>
        )}
      </div>
      <div className={styles.metricValue}>{metric.value}</div>
      {metric.change && <div className={styles.metricChange}>{metric.change}</div>}
    </Card>
  );
}

/** Passport home — vault health, secret counts, and recent agent access. */
export function DashboardView({ data, onNavigate }: DashboardViewProps) {
  const kindCounts = countSecretsByKind(data.secrets);
  const activeAgents = data.agents.filter((agent) => agent.status === "active").length;
  const recentAudit = data.auditLog.slice(0, 5);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerBody}>
          <h1 className={styles.title}>Passport</h1>
          <p className={styles.subtitle}>
            Your confidential vault for passwords, API keys, secret keys, and environment variables — shared with agents only when you grant access.
          </p>
        </div>
        <Button type="button" variant="primary" size="sm">
          <Icon name="plus" size={14} />
          Add secret
        </Button>
      </header>

      <div className={styles.metrics}>
        {data.overviewMetrics.map((metric) => (
          <MetricCard key={metric.id} metric={metric} />
        ))}
      </div>

      <div className={styles.twoCol}>
        <div>
          <div className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>Vault breakdown</h2>
            {onNavigate && (
              <Button type="button" variant="ghost" size="sm" onClick={() => onNavigate("vault")}>
                Open vault
              </Button>
            )}
          </div>
          <Card padding="lg">
            <div className={styles.envCardMeta}>
              <span>{kindCounts.password} passwords</span>
              <span>{kindCounts["api-key"]} API keys</span>
              <span>{kindCounts["secret-key"]} secret keys</span>
              <span>{kindCounts["env-variable"]} env variables</span>
            </div>
            <p className={styles.envCardDesc}>
              {data.envSets.length} environment sets bundle variables for local, staging, and production workflows.
            </p>
          </Card>
        </div>

        <div>
          <div className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>Agent access</h2>
            {onNavigate && (
              <Button type="button" variant="ghost" size="sm" onClick={() => onNavigate("grants")}>
                Manage grants
              </Button>
            )}
          </div>
          <Card padding="lg">
            <p className={styles.envCardDesc}>
              {activeAgents} active agents can read {data.grants.length} granted secrets across your workspace.
            </p>
            <div className={styles.envCardMeta}>
              {data.agents.slice(0, 3).map((agent) => (
                <Badge key={agent.id} tone={agent.status === "active" ? "success" : "neutral"}>
                  {agent.name}
                </Badge>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <div>
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitle}>Recent activity</h2>
          {onNavigate && (
            <Button type="button" variant="ghost" size="sm" onClick={() => onNavigate("audit")}>
              View audit log
            </Button>
          )}
        </div>
        <div className={styles.table}>
          {recentAudit.map((entry) => (
            <div key={entry.id} className={styles.auditRow}>
              <span
                className={cx(
                  styles.auditAction,
                  entry.action === "read" && styles.auditRead,
                  entry.action === "grant" && styles.auditGrant,
                  entry.action === "revoke" && styles.auditRevoke,
                  (entry.action === "create" || entry.action === "update") && styles.auditCreate,
                )}
              >
                {entry.action}
              </span>
              <span>{entry.agentName}</span>
              <span>{entry.secretName}</span>
              <span className={styles.grantRowMeta}>{entry.timestamp}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
