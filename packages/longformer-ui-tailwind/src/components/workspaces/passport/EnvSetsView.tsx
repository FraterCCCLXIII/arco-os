import { Icon } from "../../../icons";
import { Badge } from "../../primitives/Badge";
import { Button } from "../../primitives/Button";
import { Card } from "../../primitives/Card";
import { EmptyState } from "../../primitives/EmptyState";
import type { PassportEnvSet, PassportWorkspaceData } from "./types";
import styles from "./PassportPage.tailwind";

export interface EnvSetsViewProps {
  data: PassportWorkspaceData;
}

function envTone(environment: PassportEnvSet["environment"]) {
  switch (environment) {
    case "production":
      return "danger" as const;
    case "staging":
      return "warning" as const;
    case "development":
      return "accent" as const;
    default:
      return "neutral" as const;
  }
}

function EnvSetCard({ envSet }: { envSet: PassportEnvSet }) {
  return (
    <Card padding="lg" className={styles.envCard}>
      <div className={styles.envCardHead}>
        <div>
          <h3 className={styles.envCardTitle}>{envSet.name}</h3>
          <p className={styles.envCardDesc}>{envSet.description}</p>
        </div>
        <Badge tone={envTone(envSet.environment)}>{envSet.environment}</Badge>
      </div>
      <div className={styles.envCardMeta}>
        <span>{envSet.variableCount} variables</span>
        <span>{envSet.grantedAgentIds.length} agents granted</span>
        <span>Updated {envSet.updatedAt}</span>
      </div>
      <Button type="button" variant="ghost" size="sm">
        <Icon name="edit" size={14} />
        Edit set
      </Button>
    </Card>
  );
}

/** Environment sets — grouped env variables for dev, staging, and production. */
export function EnvSetsView({ data }: EnvSetsViewProps) {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerBody}>
          <h1 className={styles.title}>Environment Sets</h1>
          <p className={styles.subtitle}>
            Bundle related env variables into named sets. Grant an entire set to an agent instead of managing keys one by one.
          </p>
        </div>
        <Button type="button" variant="primary" size="sm">
          <Icon name="plus" size={14} />
          New env set
        </Button>
      </header>

      {data.envSets.length === 0 ? (
        <EmptyState
          icon={<Icon name="code" size={22} />}
          title="No environment sets"
          description="Create a set to group DATABASE_URL, API keys, and other variables for a deployment target."
        />
      ) : (
        <div className={styles.cardGrid}>
          {data.envSets.map((envSet) => (
            <EnvSetCard key={envSet.id} envSet={envSet} />
          ))}
        </div>
      )}
    </div>
  );
}
