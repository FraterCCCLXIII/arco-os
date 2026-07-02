import { Icon } from "../../../icons";
import { Badge } from "../../primitives/Badge";
import { Button } from "../../primitives/Button";
import { Card } from "../../primitives/Card";
import { StatCard } from "../../primitives/StatCard";
import { cx } from "../../../utils/cx";
import type { PsycheWorkspaceData, VectorCollection } from "./types";
import styles from "./VectorDbView.module.css";

export interface VectorDbViewProps {
  data: PsycheWorkspaceData;
}

function healthTone(health: VectorCollection["health"]) {
  switch (health) {
    case "healthy":
      return "success" as const;
    case "syncing":
      return "warning" as const;
    default:
      return "danger" as const;
  }
}

function CollectionCard({ collection }: { collection: VectorCollection }) {
  const fillPercent = collection.health === "healthy" ? 92 : collection.health === "syncing" ? 64 : 38;

  return (
    <Card padding="lg" className={styles.collectionCard}>
      <div className={styles.collectionHead}>
        <div>
          <div className={styles.collectionName}>{collection.name}</div>
          <div className={styles.collectionModel}>{collection.embeddingModel}</div>
        </div>
        <Badge tone={healthTone(collection.health)}>{collection.health}</Badge>
      </div>

      <div className={styles.collectionStats}>
        <div className={styles.collectionStat}>
          <span className={styles.statLabel}>Vectors</span>
          <span className={styles.statValue}>{collection.vectors.toLocaleString()}</span>
        </div>
        <div className={styles.collectionStat}>
          <span className={styles.statLabel}>Dimensions</span>
          <span className={styles.statValue}>{collection.dimensions}</span>
        </div>
        <div className={styles.collectionStat}>
          <span className={styles.statLabel}>Index</span>
          <span className={styles.statValue}>{collection.indexType}</span>
        </div>
      </div>

      <div className={styles.indexBar} aria-hidden="true">
        <div
          className={cx(
            styles.indexFill,
            collection.health === "healthy" && styles.indexFillHealthy,
            collection.health === "syncing" && styles.indexFillSyncing,
            collection.health === "degraded" && styles.indexFillDegraded,
          )}
          style={{ width: `${fillPercent}%` }}
        />
      </div>

      <div className={styles.collectionFooter}>
        <span>Last indexed {collection.lastIndexed}</span>
        <Button type="button" variant="ghost" size="sm">
          Reindex
        </Button>
      </div>
    </Card>
  );
}

/** Vector database — embedding collections, index health, and sync status. */
export function VectorDbView({ data }: VectorDbViewProps) {
  const totalVectors = data.vectorCollections.reduce((sum, c) => sum + c.vectors, 0);
  const healthyCount = data.vectorCollections.filter((c) => c.health === "healthy").length;

  return (
    <div className={styles.view}>
      <header className={styles.header}>
        <h1 className={styles.title}>Vector Database</h1>
        <p className={styles.subtitle}>
          Embedding collections powering semantic search, RAG retrieval, and long-term memory recall.
        </p>
      </header>

      <div className={styles.statRow}>
        <StatCard
          icon="layers"
          label="Total Vectors"
          value={totalVectors.toLocaleString()}
          caption="across all collections"
          tone="accent"
          visualization={{ type: "bars", values: [12, 18, 22, 28, 34, 38, 42] }}
        />
        <StatCard
          icon="check"
          label="Healthy Indexes"
          value={`${healthyCount}/${data.vectorCollections.length}`}
          caption="collections online"
          tone="success"
          visualization={{ type: "ring", percent: (healthyCount / data.vectorCollections.length) * 100 }}
        />
        <StatCard
          icon="code"
          label="Embedding Dim"
          value="1536"
          caption="text-embedding-3-large"
          tone="neutral"
          visualization={{ type: "dots", total: 24, filled: 18 }}
        />
      </div>

      <div className={styles.grid}>
        {data.vectorCollections.map((collection) => (
          <CollectionCard key={collection.id} collection={collection} />
        ))}
      </div>

      <Card padding="lg" className={styles.configCard}>
        <div className={styles.configHead}>
          <Icon name="settings" size={16} />
          <span>Index Configuration</span>
        </div>
        <div className={styles.configGrid}>
          <div className={styles.configItem}>
            <span className={styles.configLabel}>Distance Metric</span>
            <span className={styles.configValue}>cosine</span>
          </div>
          <div className={styles.configItem}>
            <span className={styles.configLabel}>HNSW M</span>
            <span className={styles.configValue}>16</span>
          </div>
          <div className={styles.configItem}>
            <span className={styles.configLabel}>ef_construction</span>
            <span className={styles.configValue}>200</span>
          </div>
          <div className={styles.configItem}>
            <span className={styles.configLabel}>Quantization</span>
            <span className={styles.configValue}>scalar int8</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
