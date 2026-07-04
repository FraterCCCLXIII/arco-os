import { Icon } from "../../../icons";
import { Badge } from "../../primitives/Badge";
import { Button } from "../../primitives/Button";
import { Card } from "../../primitives/Card";
import { StatCard } from "../../primitives/StatCard";
import { cx } from "../../../utils/cx";
import type { PsycheMetric, PsycheView, PsycheWorkspaceData } from "./types";
import styles from "./DashboardView.tailwind";

export interface DashboardViewProps {
  data: PsycheWorkspaceData;
  onNavigate?: (view: PsycheView) => void;
}

function MetricCard({ metric }: { metric: PsycheMetric }) {
  const tone = metric.tone ?? "accent";
  const iconClass =
    tone === "success"
      ? styles.metricIconSuccess
      : tone === "warning"
        ? styles.metricIconWarning
        : tone === "neutral"
          ? styles.metricIconNeutral
          : styles.metricIconAccent;

  return (
    <Card padding="lg" className={styles.metricCard}>
      <div className={styles.metricHead}>
        <span className={styles.metricLabel}>{metric.label}</span>
        {metric.icon && (
          <span className={cx(styles.metricIcon, iconClass)}>
            <Icon name={metric.icon} size={14} />
          </span>
        )}
      </div>
      <div className={cx(styles.metricValue, tone === "success" && styles.metricValueSuccess)}>{metric.value}</div>
      {metric.change && <div className={styles.metricChange}>{metric.change}</div>}
    </Card>
  );
}

/** Psyche home — knowledge vitals, store health, and recent ingestions. */
export function DashboardView({ data, onNavigate }: DashboardViewProps) {
  const totalVectors = data.vectorCollections.reduce((sum, c) => sum + c.vectors, 0);
  const activeMemories = data.memoryEntries.filter((m) => m.status === "active").length;

  return (
    <div className={styles.view}>
      <header className={styles.header}>
        <h1 className={styles.title}>Model Psyche</h1>
        <p className={styles.subtitle}>
          Memory, knowledge graphs, RAG pipelines, and identity documents for {data.modelName}.
        </p>
      </header>

      <div className={styles.metrics}>
        {data.overviewMetrics.map((metric) => (
          <MetricCard key={metric.id} metric={metric} />
        ))}
      </div>

      <div className={styles.statRow}>
        <StatCard
          icon="layers"
          label="Graph Density"
          value={`${data.graphNodes.length}`}
          caption="connected nodes"
          tone="accent"
          visualization={{ type: "ring", percent: 74 }}
        />
        <StatCard
          icon="bookmark"
          label="Memory Recall"
          value={`${activeMemories}`}
          caption="active entries"
          tone="success"
          visualization={{ type: "bars", values: [42, 58, 51, 67, 74, 69, 78] }}
        />
        <StatCard
          icon="code"
          label="Vector Index"
          value={`${(totalVectors / 1000).toFixed(1)}K`}
          caption="embedded chunks"
          tone="neutral"
          visualization={{ type: "dots", total: 28, filled: 22 }}
        />
      </div>

      <div className={styles.twoCol}>
        <div>
          <div className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>Knowledge Stores</h2>
            {onNavigate && (
              <Button type="button" variant="ghost" size="sm" onClick={() => onNavigate("vector-db")}>
                View all
              </Button>
            )}
          </div>
          <div className={styles.storeGrid}>
            {data.vectorCollections.slice(0, 4).map((collection) => (
              <Card key={collection.id} padding="lg" className={styles.storeCard}>
                <div className={styles.storeHead}>
                  <span className={styles.storeName}>{collection.name}</span>
                  <Badge tone={collection.health === "healthy" ? "success" : collection.health === "syncing" ? "warning" : "danger"}>
                    {collection.health}
                  </Badge>
                </div>
                <div className={styles.storeMeta}>
                  {collection.vectors.toLocaleString()} vectors · {collection.dimensions}d · {collection.indexType}
                </div>
                <div className={styles.storeModel}>{collection.embeddingModel}</div>
              </Card>
            ))}
          </div>

          <div className={styles.sectionHead} style={{ marginTop: "var(--lf-space-6)" }}>
            <h2 className={styles.sectionTitle}>Recent RAG Queries</h2>
            {onNavigate && (
              <Button type="button" variant="ghost" size="sm" onClick={() => onNavigate("rag")}>
                Open RAG
              </Button>
            )}
          </div>
          <div className={styles.queryList}>
            {data.ragQueries.slice(0, 3).map((query) => (
              <Card key={query.id} padding="md" className={styles.queryCard}>
                <div className={styles.queryText}>{query.query}</div>
                <div className={styles.queryMeta}>
                  {query.chunksRetrieved} chunks · {query.latencyMs}ms · {query.timestamp}
                </div>
                <p className={styles.queryPreview}>{query.answerPreview}</p>
              </Card>
            ))}
          </div>
        </div>

        <aside>
          <h2 className={styles.sectionTitle}>Recent Ingestions</h2>
          <div className={styles.activityList}>
            {data.recentIngestions.map((event) => (
              <div key={event.id} className={styles.activityItem}>
                <span
                  className={cx(
                    styles.activityIcon,
                    event.status === "success"
                      ? styles.activityIconSuccess
                      : event.status === "warning"
                        ? styles.activityIconWarning
                        : styles.activityIconInfo,
                  )}
                >
                  <Icon name={event.status === "success" ? "check" : event.status === "warning" ? "refresh" : "file"} size={14} />
                </span>
                <div className={styles.activityBody}>
                  <div className={styles.activityTitle}>{event.title}</div>
                  <div className={styles.activityMeta}>
                    {event.source} · {event.type} · {event.timestamp}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.systemNote}>
            <div className={styles.systemNoteLabel}>
              <Icon name="sparkles" size={12} />
              System Note
            </div>
            <p className={styles.systemNoteText}>{data.systemNote}</p>
          </div>

          <div className={styles.identityLinks}>
            {onNavigate && (
              <>
                <Button type="button" variant="secondary" size="sm" onClick={() => onNavigate("soul-md")}>
                  <Icon name="heart" size={14} />
                  Soul.md
                </Button>
                <Button type="button" variant="secondary" size="sm" onClick={() => onNavigate("ethics-md")}>
                  <Icon name="lock" size={14} />
                  Ethics.md
                </Button>
              </>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
