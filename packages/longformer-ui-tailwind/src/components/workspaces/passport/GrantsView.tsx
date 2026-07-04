import { useMemo, useState } from "react";
import { Icon } from "../../../icons";
import { Badge } from "../../primitives/Badge";
import { Card } from "../../primitives/Card";
import { cx } from "../../../utils/cx";
import { PASSPORT_KIND_LABELS, type PassportWorkspaceData } from "./types";
import styles from "./PassportPage.tailwind";

export interface GrantsViewProps {
  data: PassportWorkspaceData;
}

function GrantToggle({
  granted,
  label,
  onToggle,
}: {
  granted: boolean;
  label: string;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={granted}
      aria-label={label}
      className={cx(styles.toggleSwitch, granted && styles.toggleSwitchOn)}
      onClick={onToggle}
    >
      <span className={styles.toggleKnob} />
    </button>
  );
}

/** Agent grants — control which agents can read each secret at runtime. */
export function GrantsView({ data }: GrantsViewProps) {
  const [grantState, setGrantState] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    for (const grant of data.grants) {
      initial[`${grant.agentId}:${grant.secretId}`] = true;
    }
    return initial;
  });

  const secretsById = useMemo(
    () => Object.fromEntries(data.secrets.map((secret) => [secret.id, secret])),
    [data.secrets],
  );

  function isGranted(agentId: string, secretId: string) {
    return grantState[`${agentId}:${secretId}`] ?? false;
  }

  function toggleGrant(agentId: string, secretId: string) {
    const key = `${agentId}:${secretId}`;
    setGrantState((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerBody}>
          <h1 className={styles.title}>Agent Grants</h1>
          <p className={styles.subtitle}>
            Grant agents read access to specific secrets or env sets. Revoke access anytime — agents lose the ability to fetch values on their next request.
          </p>
        </div>
      </header>

      <div className={styles.cardGrid}>
        {data.agents.map((agent) => {
          const agentSecrets = data.secrets.filter((secret) => secret.grantedAgentIds.includes(agent.id));

          return (
            <Card key={agent.id} padding="lg" className={styles.grantCard}>
              <div className={styles.grantHead}>
                <span className={styles.agentAvatar}>
                  <Icon name={agent.icon} size={18} />
                </span>
                <div className={styles.agentInfo}>
                  <h3 className={styles.agentName}>{agent.name}</h3>
                  <p className={styles.agentDesc}>{agent.description}</p>
                </div>
                <Badge tone={agent.status === "active" ? "success" : "neutral"}>{agent.status}</Badge>
              </div>

              <div className={styles.grantList}>
                {agentSecrets.length === 0 ? (
                  <p className={styles.agentDesc}>No secrets granted yet.</p>
                ) : (
                  agentSecrets.map((secret) => (
                    <div key={secret.id} className={styles.grantRow}>
                      <div className={styles.grantRowLabel}>
                        <span className={styles.grantRowName}>{secret.name}</span>
                        <span className={styles.grantRowMeta}>
                          {PASSPORT_KIND_LABELS[secret.kind]}
                          {secret.lastUsed ? ` · last used ${secret.lastUsed}` : ""}
                        </span>
                      </div>
                      <GrantToggle
                        granted={isGranted(agent.id, secret.id)}
                        label={`Grant ${agent.name} access to ${secret.name}`}
                        onToggle={() => toggleGrant(agent.id, secret.id)}
                      />
                    </div>
                  ))
                )}
              </div>

              <div className={styles.envCardMeta}>
                <span>{agent.grantedSecretCount} secrets granted</span>
                {agent.lastAccess && <span>Last access {agent.lastAccess}</span>}
              </div>
            </Card>
          );
        })}
      </div>

      <Card padding="lg">
        <h3 className={styles.sectionTitle}>Grant policy</h3>
        <p className={styles.envCardDesc}>
          Agents request secrets through the Passport API using their session identity. Grants are evaluated per secret; env sets expand to their member variables at request time.
        </p>
        <div className={styles.envCardMeta}>
          <span>{data.grants.length} active grants</span>
          <span>{Object.keys(secretsById).length} total secrets</span>
        </div>
      </Card>
    </div>
  );
}
