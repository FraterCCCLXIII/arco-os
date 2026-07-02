import { Icon } from "../../../icons";
import { Badge } from "../../primitives/Badge";
import { Card } from "../../primitives/Card";
import { StatisticsProgressCard } from "../../primitives/StatisticsProgressCard";
import { cx } from "../../../utils/cx";
import type {
  DatabaseStorage,
  ServerWorkspaceData,
  StorageBucket,
  StorageVolume,
} from "./types";
import styles from "./StorageWidgetsView.module.css";

export interface StorageWidgetsViewProps {
  data: ServerWorkspaceData;
}

function formatGb(gb: number): string {
  return gb >= 1000 ? `${(gb / 1000).toFixed(1)} TB` : `${gb.toFixed(1)} GB`;
}

function StorageGauge({ used, total, label }: { used: number; total: number; label: string }) {
  const percent = total > 0 ? (used / total) * 100 : 0;
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(100, percent) / 100) * circumference;
  const tone = percent >= 90 ? "danger" : percent >= 75 ? "warning" : "accent";

  return (
    <div className={styles.gauge}>
      <svg width={88} height={88} viewBox="0 0 88 88" aria-hidden="true">
        <circle cx={44} cy={44} r={radius} className={styles.gaugeTrack} />
        <circle
          cx={44}
          cy={44}
          r={radius}
          className={cx(styles.gaugeFill, styles[`gaugeFill_${tone}`])}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 44 44)"
        />
      </svg>
      <div className={styles.gaugeCenter}>
        <span className={styles.gaugePercent}>{Math.round(percent)}%</span>
        <span className={styles.gaugeLabel}>{label}</span>
      </div>
    </div>
  );
}

function VolumeWidget({ volume }: { volume: StorageVolume }) {
  const percent = (volume.usedGb / volume.totalGb) * 100;

  return (
    <Card padding="lg" className={styles.storageWidget}>
      <div className={styles.widgetTop}>
        <div>
          <h3 className={styles.widgetName}>{volume.name}</h3>
          <p className={styles.widgetSub}>{volume.projectName}</p>
        </div>
        <Badge tone="neutral">{volume.type}</Badge>
      </div>
      <StorageGauge used={volume.usedGb} total={volume.totalGb} label="used" />
      <div className={styles.widgetStats}>
        <div>
          <span className={styles.statLabel}>Used</span>
          <span className={styles.statValue}>{formatGb(volume.usedGb)}</span>
        </div>
        <div>
          <span className={styles.statLabel}>Capacity</span>
          <span className={styles.statValue}>{formatGb(volume.totalGb)}</span>
        </div>
      </div>
      <div className={styles.mountPath}>
        <Icon name="folder" size={12} />
        <code>{volume.mountPath}</code>
      </div>
      <div className={styles.progressTrack}>
        <span className={styles.progressFill} style={{ width: `${Math.min(100, percent)}%` }} />
      </div>
    </Card>
  );
}

function BucketWidget({ bucket }: { bucket: StorageBucket }) {
  const statusTone =
    bucket.status === "connected" ? "success" : bucket.status === "error" ? "danger" : "warning";

  return (
    <Card padding="lg" className={styles.storageWidget}>
      <div className={styles.widgetTop}>
        <div>
          <h3 className={styles.widgetName}>{bucket.name}</h3>
          <p className={styles.widgetSub}>{bucket.endpoint}</p>
        </div>
        <Badge tone={statusTone} dot>
          {bucket.status}
        </Badge>
      </div>
      <StorageGauge used={bucket.usedGb} total={bucket.totalGb} label="used" />
      <div className={styles.widgetStats}>
        <div>
          <span className={styles.statLabel}>Objects</span>
          <span className={styles.statValue}>{bucket.objects.toLocaleString()}</span>
        </div>
        <div>
          <span className={styles.statLabel}>Provider</span>
          <span className={styles.statValue}>{bucket.provider.toUpperCase()}</span>
        </div>
      </div>
      <div className={styles.widgetStats}>
        <div>
          <span className={styles.statLabel}>Used</span>
          <span className={styles.statValue}>{formatGb(bucket.usedGb)}</span>
        </div>
        <div>
          <span className={styles.statLabel}>Quota</span>
          <span className={styles.statValue}>{formatGb(bucket.totalGb)}</span>
        </div>
      </div>
    </Card>
  );
}

function DatabaseWidget({ database }: { database: DatabaseStorage }) {
  const engineIcons: Record<DatabaseStorage["engine"], string> = {
    postgres: "🐘",
    mysql: "🐬",
    redis: "⚡",
    mongodb: "🍃",
  };

  return (
    <Card padding="lg" className={styles.storageWidget}>
      <div className={styles.widgetTop}>
        <div className={styles.dbIdentity}>
          <span className={styles.dbIcon}>{engineIcons[database.engine]}</span>
          <div>
            <h3 className={styles.widgetName}>{database.name}</h3>
            <p className={styles.widgetSub}>{database.projectName}</p>
          </div>
        </div>
        <Badge tone="accent">{database.engine}</Badge>
      </div>
      <StorageGauge used={database.usedGb} total={database.totalGb} label="used" />
      <div className={styles.widgetStats}>
        <div>
          <span className={styles.statLabel}>Storage</span>
          <span className={styles.statValue}>
            {formatGb(database.usedGb)} / {formatGb(database.totalGb)}
          </span>
        </div>
        <div>
          <span className={styles.statLabel}>Connections</span>
          <span className={styles.statValue}>{database.connections}</span>
        </div>
      </div>
    </Card>
  );
}

/** Storage overview — S3 buckets, persistent volumes, and database storage widgets. */
export function StorageWidgetsView({ data }: StorageWidgetsViewProps) {
  const serverRows = data.servers.map((server) => ({
    label: server.name,
    subLabel: server.region ?? server.description,
    value: `${Math.round(server.disk)}%`,
    progress: server.disk,
    change: server.status === "online" ? "Online" : undefined,
  }));

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Storage</h1>
          <p className={styles.subtitle}>Persistent volumes, object storage, and database capacity across your fleet.</p>
        </div>
        <button type="button" className={styles.addBtn}>
          <Icon name="plus" size={14} />
          Add Storage
        </button>
      </header>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>S3 & Object Storage</h2>
        <div className={styles.widgetGrid}>
          {data.buckets.map((bucket) => (
            <BucketWidget key={bucket.id} bucket={bucket} />
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Persistent Volumes</h2>
        <div className={styles.widgetGrid}>
          {data.volumes.map((volume) => (
            <VolumeWidget key={volume.id} volume={volume} />
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Databases</h2>
        <div className={styles.widgetGrid}>
          {data.databases.map((database) => (
            <DatabaseWidget key={database.id} database={database} />
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <StatisticsProgressCard
          title="Server Disk Usage"
          rows={serverRows}
          className={styles.serverDiskCard}
        />
      </section>
    </div>
  );
}
