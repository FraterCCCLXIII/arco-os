import { Icon } from "../../../icons";
import { Badge } from "../../primitives/Badge";
import { Card } from "../../primitives/Card";
import { cx } from "../../../utils/cx";
import type { GoalStatus, LifeGoal, LifeModule, LifeModuleId } from "./types";
import styles from "./ModuleView.tailwind";

export interface ModuleViewProps {
  module: LifeModule;
}

function ProgressRing({ progress }: { progress: number }) {
  const size = 72;
  const r = (size - 8) / 2;
  const c = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(100, progress));
  const offset = c * (1 - clamped / 100);

  return (
    <div className={styles.progressRing}>
      <svg width={size} height={size} aria-hidden="true">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--lf-surface-sunken)"
          strokeWidth={6}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--lf-accent)"
          strokeWidth={6}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <span className={styles.progressRingLabel}>{clamped}%</span>
    </div>
  );
}

function moduleIconClass(id: LifeModuleId) {
  const map: Record<LifeModuleId, string> = {
    health: styles.moduleIconHealth,
    mind: styles.moduleIconMind,
    finances: styles.moduleIconFinances,
    housing: styles.moduleIconHousing,
    investments: styles.moduleIconInvestments,
    retirement: styles.moduleIconRetirement,
  };
  return map[id];
}

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
          <div className={styles.goalTitle}>{goal.title}</div>
          <div className={styles.goalDescription}>{goal.description}</div>
        </div>
        <div className={styles.goalMeta}>
          <Badge tone={statusTone(goal.status)}>{goal.status.replace("-", " ")}</Badge>
        </div>
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
            <div key={milestone.id} className={styles.milestone}>
              <span className={cx(styles.milestoneCheck, milestone.completed && styles.milestoneCheckDone)}>
                {milestone.completed && <Icon name="check" size={10} />}
              </span>
              <span className={milestone.completed ? styles.milestoneDone : undefined}>{milestone.title}</span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

/** Domain module view — metrics, AI insights, and tracked goals for a life area. */
export function ModuleView({ module }: ModuleViewProps) {
  return (
    <div className={styles.view}>
      <header className={styles.header}>
        <div className={styles.headerMain}>
          <span className={cx(styles.moduleIcon, moduleIconClass(module.id))}>
            <Icon name={module.icon} size={22} />
          </span>
          <h1 className={styles.title}>{module.label}</h1>
          <p className={styles.description}>{module.description}</p>
        </div>
        <div className={styles.overallProgress}>
          <ProgressRing progress={module.overallProgress} />
          <span className={styles.progressRingCaption}>Overall</span>
        </div>
      </header>

      <div className={styles.metrics}>
        {module.metrics.map((metric) => (
          <Card key={metric.id} padding="md" className={styles.metricCard}>
            <div className={styles.metricLabel}>{metric.label}</div>
            <div className={styles.metricValue}>{metric.value}</div>
            {metric.change && <div className={styles.metricChange}>{metric.change}</div>}
          </Card>
        ))}
      </div>

      {module.insights.length > 0 && (
        <div className={styles.insights}>
          <div className={styles.insightsHead}>
            <Icon name="sparkles" size={16} />
            AI Insights
          </div>
          <ul className={styles.insightsList}>
            {module.insights.map((insight, index) => (
              <li key={index}>{insight}</li>
            ))}
          </ul>
        </div>
      )}

      <section className={styles.goalsSection} aria-label="Goals">
        <h2 className={styles.title} style={{ fontSize: "var(--lf-font-size-md)" }}>
          Active Goals
        </h2>
        {module.goals.map((goal) => (
          <GoalCard key={goal.id} goal={goal} />
        ))}
      </section>
    </div>
  );
}
