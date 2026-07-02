import { Icon } from "../../../icons";
import { EmptyState } from "../../primitives/EmptyState";
import { cx } from "../../../utils/cx";
import type { PassportAuditEntry, PassportWorkspaceData } from "./types";
import styles from "./PassportPage.module.css";

export interface AuditViewProps {
  data: PassportWorkspaceData;
}

function actionClass(action: PassportAuditEntry["action"]) {
  switch (action) {
    case "read":
      return styles.auditRead;
    case "grant":
      return styles.auditGrant;
    case "revoke":
      return styles.auditRevoke;
    case "create":
    case "update":
      return styles.auditCreate;
    default:
      return styles.auditAction;
  }
}

/** Audit log — who accessed which secrets and when. */
export function AuditView({ data }: AuditViewProps) {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerBody}>
          <h1 className={styles.title}>Audit Log</h1>
          <p className={styles.subtitle}>
            Immutable record of secret reads, grants, revocations, and vault changes across all agents.
          </p>
        </div>
      </header>

      {data.auditLog.length === 0 ? (
        <EmptyState
          icon={<Icon name="clock" size={22} />}
          title="No audit events yet"
          description="Secret access and grant changes will appear here."
        />
      ) : (
        <div className={styles.table}>
          <div className={cx(styles.tableHead, styles.auditTableHead)}>
            <span>Action</span>
            <span>Agent</span>
            <span>Secret</span>
            <span>Time</span>
            <span>Context</span>
          </div>
          {data.auditLog.map((entry) => (
            <div key={entry.id} className={cx(styles.auditRow, styles.auditTableRow)}>
              <span className={cx(styles.auditAction, actionClass(entry.action))}>{entry.action}</span>
              <span>{entry.agentName}</span>
              <span>{entry.secretName}</span>
              <span className={styles.grantRowMeta}>{entry.timestamp}</span>
              <span className={styles.grantRowMeta}>{entry.context ?? "—"}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
