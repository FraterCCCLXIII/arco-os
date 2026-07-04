import { Icon } from "../../../icons";
import { Badge } from "../../primitives/Badge";
import { Button } from "../../primitives/Button";
import { Card } from "../../primitives/Card";
import { cx } from "../../../utils/cx";
import type { LifeMetric, LifeModule, LifeModuleId, LifePlanningWorkspaceData } from "./types";
import styles from "./DashboardView.tailwind";

export interface DashboardViewProps {
  data: LifePlanningWorkspaceData;
  onNavigateModule?: (moduleId: LifeModuleId) => void;
}

function ProgressRing({ progress, size = 44 }: { progress: number; size?: number }) {
  const r = (size - 6) / 2;
  const c = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(100, progress));
  const offset = c * (1 - clamped / 100);

  return (
    <div className={styles.progressRing} style={{ width: size, height: size }}>
      <svg width={size} height={size} aria-hidden="true">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--lf-surface-sunken)"
          strokeWidth={4}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--lf-accent)"
          strokeWidth={4}
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

function MetricCard({ metric }: { metric: LifeMetric }) {
  const iconClass =
    metric.tone === "success"
      ? styles.metricIconSuccess
      : metric.tone === "warning"
        ? styles.metricIconWarning
        : metric.tone === "neutral"
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
      <div className={cx(styles.metricValue, metric.tone === "success" && styles.metricValueSuccess)}>
        {metric.value}
      </div>
      {metric.change && (
        <div className={cx(styles.metricChange, metric.tone === "success" && styles.metricChangePositive)}>
          {metric.change}
        </div>
      )}
    </Card>
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

function ModuleCard({
  module,
  onClick,
}: {
  module: LifeModule;
  onClick?: () => void;
}) {
  return (
    <Card padding="lg" className={styles.moduleCard} onClick={onClick} role={onClick ? "button" : undefined}>
      <div className={styles.moduleCardHead}>
        <span className={cx(styles.moduleIcon, moduleIconClass(module.id))}>
          <Icon name={module.icon} size={18} />
        </span>
        <ProgressRing progress={module.overallProgress} />
      </div>
      <div className={styles.moduleLabel}>{module.label}</div>
      <div className={styles.moduleDescription}>{module.description}</div>
      <div className={styles.moduleStats}>
        <span>
          <span className={styles.moduleStatValue}>{module.activeGoals}</span> active
        </span>
        <span>
          <span className={styles.moduleStatValue}>{module.completedGoals}</span> completed
        </span>
      </div>
    </Card>
  );
}

/** Life planning home — cross-module overview, activity feed, and AI recommendations. */
export function DashboardView({ data, onNavigateModule }: DashboardViewProps) {
  const { aiCoach, recentActivity } = data;

  return (
    <div className={styles.view}>
      <header className={styles.header}>
        <h1 className={styles.title}>Welcome back, {data.userName.split(" ")[0]}</h1>
        <p className={styles.subtitle}>
          Your AI life coach is tracking {data.modules.length} life areas with{" "}
          {data.modules.reduce((sum, m) => sum + m.activeGoals, 0)} active goals.
        </p>
      </header>

      <div className={styles.metrics}>
        {data.overviewMetrics.map((metric) => (
          <MetricCard key={metric.id} metric={metric} />
        ))}
      </div>

      <div className={styles.twoCol}>
        <div>
          <h2 className={styles.sectionTitle}>Life Modules</h2>
          <div className={styles.modulesGrid}>
            {data.modules.map((module) => (
              <ModuleCard
                key={module.id}
                module={module}
                onClick={onNavigateModule ? () => onNavigateModule(module.id) : undefined}
              />
            ))}
          </div>
        </div>

        <aside>
          <h2 className={styles.sectionTitle}>AI Recommendations</h2>
          <div className={styles.recommendations}>
            {aiCoach.recommendations.slice(0, 3).map((rec) => (
              <div key={rec.id} className={styles.recommendation}>
                <div className={styles.recommendationHead}>
                  <span className={styles.recommendationTitle}>{rec.title}</span>
                  <Badge
                    tone={rec.priority === "high" ? "danger" : rec.priority === "medium" ? "warning" : "neutral"}
                  >
                    {rec.priority}
                  </Badge>
                </div>
                <p className={styles.recommendationText}>{rec.description}</p>
                {rec.actionLabel && (
                  <Button type="button" variant="secondary" size="sm">
                    {rec.actionLabel}
                  </Button>
                )}
              </div>
            ))}
          </div>

          <h2 className={styles.sectionTitle} style={{ marginTop: "var(--lf-space-6)" }}>
            Recent Activity
          </h2>
          <div className={styles.activityList}>
            {recentActivity.slice(0, 5).map((activity) => (
              <div key={activity.id} className={styles.activityItem}>
                <span
                  className={cx(
                    styles.activityIcon,
                    activity.status === "success"
                      ? styles.activityIconSuccess
                      : activity.status === "warning"
                        ? styles.activityIconWarning
                        : styles.activityIconInfo,
                  )}
                >
                  <Icon name="check" size={14} />
                </span>
                <div className={styles.activityBody}>
                  <div className={styles.activityTitle}>{activity.title}</div>
                  <div className={styles.activityMeta}>
                    {activity.type} · {activity.timestamp}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
