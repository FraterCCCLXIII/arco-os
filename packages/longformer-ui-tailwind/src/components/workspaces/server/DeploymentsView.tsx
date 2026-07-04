import { Icon } from "../../../icons";
import { Avatar } from "../../primitives/Avatar";
import { Badge } from "../../primitives/Badge";
import { Card } from "../../primitives/Card";
import { cx } from "../../../utils/cx";
import type { DeployStatus, ServerDeployment, ServerWorkspaceData } from "./types";
import styles from "./DeploymentsView.tailwind";

export interface DeploymentsViewProps {
  data: ServerWorkspaceData;
}

const STATUS_TONE: Record<DeployStatus, "success" | "warning" | "danger" | "neutral"> = {
  ready: "success",
  building: "warning",
  error: "danger",
  stopped: "neutral",
};

function DeploymentRow({ deployment }: { deployment: ServerDeployment }) {
  return (
    <Card padding="md" className={styles.row}>
      <div className={styles.rowMain}>
        <div className={styles.projectCol}>
          <span className={styles.projectName}>{deployment.projectName}</span>
          <Badge tone={STATUS_TONE[deployment.status]} dot>
            {deployment.status}
          </Badge>
        </div>
        <div className={styles.commitCol}>
          <span className={styles.commitHash}>{deployment.commit}</span>
          <span className={styles.commitMsg}>{deployment.commitMessage}</span>
        </div>
        <div className={styles.metaCol}>
          <span className={styles.branch}>
            <Icon name="layers" size={12} />
            {deployment.branch}
          </span>
          <span className={styles.env}>{deployment.environment}</span>
        </div>
        <div className={styles.authorCol}>
          <Avatar name={deployment.author} size="sm" />
          <span>{deployment.author}</span>
        </div>
        <div className={styles.timeCol}>
          <span>{deployment.timeAgo}</span>
          <span className={styles.duration}>{deployment.duration}</span>
        </div>
      </div>
      <div className={styles.rowActions}>
        <button type="button" className={styles.actionBtn}>
          <Icon name="external-link" size={14} />
          Visit
        </button>
        <button type="button" className={styles.actionBtn}>
          <Icon name="terminal" size={14} />
          Logs
        </button>
        <button type="button" className={cx(styles.actionBtn, styles.actionBtnDanger)}>
          <Icon name="refresh" size={14} />
          Redeploy
        </button>
      </div>
    </Card>
  );
}

/** Recent deployments across all projects — branch, commit, and environment. */
export function DeploymentsView({ data }: DeploymentsViewProps) {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Deployments</h1>
          <p className={styles.subtitle}>Build and deploy history for every app in your workspace.</p>
        </div>
        <button type="button" className={styles.filterBtn}>
          <Icon name="layers" size={14} />
          All environments
          <Icon name="chevron-down" size={14} />
        </button>
      </header>

      <div className={styles.list}>
        {data.deployments.map((deployment) => (
          <DeploymentRow key={deployment.id} deployment={deployment} />
        ))}
      </div>
    </div>
  );
}
