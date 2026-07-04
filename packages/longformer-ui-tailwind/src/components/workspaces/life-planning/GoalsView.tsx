import { useMemo, useState } from "react";
import { Icon } from "../../../icons";
import { Badge } from "../../primitives/Badge";
import { Card } from "../../primitives/Card";
import { cx } from "../../../utils/cx";
import type { GoalStatus, LifeGoal, LifeModuleId, LifePlanningWorkspaceData } from "./types";
import { getAllGoals } from "./types";
import styles from "./GoalsView.tailwind";

export interface GoalsViewProps {
  data: LifePlanningWorkspaceData;
}

const MODULE_LABELS: Record<LifeModuleId, string> = {
  health: "Health",
  mind: "Mind",
  finances: "Finances",
  housing: "Housing",
  investments: "Investments",
  retirement: "Retirement",
};

function statusTone(status: GoalStatus) {
  switch (status) {
    case "completed":
      return "success" as const;
    case "at-risk":
      return "warning" as const;
    case "on-track":
      return "accent" as const;
    default:
      return "neutral" as const;
  }
}

function progressFillClass(status: GoalStatus) {
  switch (status) {
    case "completed":
    case "on-track":
      return styles.progressFillSuccess;
    case "at-risk":
      return styles.progressFillWarning;
    default:
      return "";
  }
}

function GoalCard({ goal }: { goal: LifeGoal }) {
  return (
    <Card padding="lg" className={styles.goalCard}>
      <div className={styles.goalHead}>
        <div>
          <div className={styles.goalModule}>
            <Icon name="target" size={10} />
            {MODULE_LABELS[goal.moduleId]}
          </div>
          <div className={styles.goalTitle}>{goal.title}</div>
          <div className={styles.goalDescription}>{goal.description}</div>
        </div>
        <Badge tone={statusTone(goal.status)}>{goal.status.replace("-", " ")}</Badge>
      </div>

      <div className={styles.goalProgress}>
        <div className={styles.progressBar}>
          <div
            className={cx(styles.progressFill, progressFillClass(goal.status))}
            style={{ width: `${goal.progress}%` }}
          />
        </div>
        <div className={styles.progressLabel}>
          <span>{goal.progress}% complete</span>
          {goal.targetDate && <span>Target: {goal.targetDate}</span>}
        </div>
      </div>

      {goal.milestones.length > 0 && (
        <div className={styles.milestones}>
          {goal.milestones.map((milestone) => (
            <span
              key={milestone.id}
              className={cx(styles.milestone, milestone.completed && styles.milestoneDone)}
            >
              {milestone.completed ? "✓" : "○"} {milestone.title}
            </span>
          ))}
        </div>
      )}
    </Card>
  );
}

/** Cross-module goal tracker — filter and monitor all life goals in one place. */
export function GoalsView({ data }: GoalsViewProps) {
  const [filter, setFilter] = useState<LifeModuleId | "all">("all");
  const allGoals = useMemo(() => getAllGoals(data), [data]);

  const filteredGoals = useMemo(() => {
    if (filter === "all") return allGoals;
    return allGoals.filter((goal) => goal.moduleId === filter);
  }, [allGoals, filter]);

  const modules: { id: LifeModuleId | "all"; label: string }[] = [
    { id: "all", label: "All Goals" },
    ...data.modules.map((m) => ({ id: m.id, label: m.label })),
  ];

  return (
    <div className={styles.view}>
      <header className={styles.header}>
        <h1 className={styles.title}>Goals</h1>
        <p className={styles.subtitle}>
          Track progress across all life areas. AI monitors milestones and flags goals at risk.
        </p>
      </header>

      <div className={styles.filters} role="tablist" aria-label="Filter by module">
        {modules.map((module) => (
          <button
            key={module.id}
            type="button"
            role="tab"
            aria-selected={filter === module.id}
            className={cx(styles.filterChip, filter === module.id && styles.filterChipActive)}
            onClick={() => setFilter(module.id)}
          >
            {module.label}
          </button>
        ))}
      </div>

      <div className={styles.goalsList}>
        {filteredGoals.length === 0 ? (
          <div className={styles.empty}>No goals match this filter.</div>
        ) : (
          filteredGoals.map((goal) => <GoalCard key={goal.id} goal={goal} />)
        )}
      </div>
    </div>
  );
}
