import { Icon } from "../../../icons";
import { Badge } from "../../primitives/Badge";
import { Card } from "../../primitives/Card";
import { cx } from "../../../utils/cx";
import type { ServerInstance, ServerWorkspaceData } from "./types";
import styles from "./ServersView.module.css";

export interface ServersViewProps {
  data: ServerWorkspaceData;
}

function MetricBar({ label, value }: { label: string; value: number }) {
  const tone = value >= 85 ? "danger" : value >= 70 ? "warning" : "accent";

  return (
    <div className={styles.metric}>
      <div className={styles.metricHeader}>
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className={styles.metricTrack}>
        <span className={cx(styles.metricFill, styles[`metricFill_${tone}`])} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function ServerCard({ server }: { server: ServerInstance }) {
  const statusTone =
    server.status === "online" ? "success" : server.status === "maintenance" ? "warning" : "danger";

  return (
    <Card padding="lg" className={styles.serverCard} interactive>
      <div className={styles.serverTop}>
        <div className={styles.serverIcon}>
          <Icon name="terminal" size={18} />
        </div>
        <div className={styles.serverInfo}>
          <h3 className={styles.serverName}>{server.name}</h3>
          <p className={styles.serverDesc}>{server.description}</p>
        </div>
        <Badge tone={statusTone} dot>
          {server.status}
        </Badge>
      </div>

      {(server.ip || server.region) && (
        <div className={styles.serverMeta}>
          {server.ip && (
            <span>
              <Icon name="globe" size={12} />
              {server.ip}
            </span>
          )}
          {server.region && (
            <span>
              <Icon name="satellite" size={12} />
              {server.region}
            </span>
          )}
          <span>
            <Icon name="package" size={12} />
            {server.apps} apps
          </span>
        </div>
      )}

      <div className={styles.metrics}>
        <MetricBar label="CPU" value={server.cpu} />
        <MetricBar label="Memory" value={server.memory} />
        <MetricBar label="Disk" value={server.disk} />
      </div>

      <div className={styles.serverActions}>
        <button type="button" className={styles.serverBtn}>Terminal</button>
        <button type="button" className={styles.serverBtn}>Settings</button>
      </div>
    </Card>
  );
}

/** Coolify-style server fleet — host metrics and running app counts. */
export function ServersView({ data }: ServersViewProps) {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Servers</h1>
          <p className={styles.subtitle}>Self-hosted infrastructure where your containers and apps run.</p>
        </div>
        <button type="button" className={styles.addBtn}>
          <Icon name="plus" size={14} />
          Add Server
        </button>
      </header>

      <div className={styles.grid}>
        {data.servers.map((server) => (
          <ServerCard key={server.id} server={server} />
        ))}
      </div>
    </div>
  );
}
