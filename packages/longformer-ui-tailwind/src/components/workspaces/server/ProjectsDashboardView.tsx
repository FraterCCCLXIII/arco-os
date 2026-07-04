import { useState } from "react";
import { Icon } from "../../../icons";
import { Avatar } from "../../primitives/Avatar";
import { Badge } from "../../primitives/Badge";
import { Card } from "../../primitives/Card";
import { cx } from "../../../utils/cx";
import type { AppKind, DeployStatus, ServerProject, ServerWorkspaceData } from "./types";
import styles from "./ProjectsDashboardView.tailwind";

export interface ProjectsDashboardViewProps {
  data: ServerWorkspaceData;
}

const KIND_LABELS: Record<AppKind, string> = {
  frontend: "Frontend",
  backend: "Backend",
  fullstack: "Full Stack",
  docker: "Docker",
  static: "Static",
  worker: "Worker",
};

function UsageRing({ percent, exceeded }: { percent: number; exceeded?: boolean }) {
  const clamped = Math.min(100, Math.max(0, percent));
  const radius = 10;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <svg width={24} height={24} viewBox="0 0 24 24" aria-hidden="true" className={styles.usageRing}>
      <circle cx={12} cy={12} r={radius} className={styles.usageRingTrack} />
      <circle
        cx={12}
        cy={12}
        r={radius}
        className={cx(styles.usageRingFill, exceeded && styles.usageRingExceeded)}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform="rotate(-90 12 12)"
      />
    </svg>
  );
}

function StatusIcon({ status }: { status: DeployStatus }) {
  if (status === "ready") return <Icon name="check" size={14} className={styles.statusReady} />;
  if (status === "building") return <Icon name="loader" size={14} className={styles.statusBuilding} />;
  if (status === "error") return <Icon name="close" size={14} className={styles.statusError} />;
  return <Icon name="minus" size={14} className={styles.statusStopped} />;
}

function ProjectCard({ project }: { project: ServerProject }) {
  return (
    <Card interactive padding="lg" className={styles.projectCard}>
      <div className={styles.projectTop}>
        <div className={styles.projectIdentity}>
          <span className={styles.projectIcon} style={{ background: project.iconBg ?? "var(--lf-surface-sunken)" }}>
            {project.icon ?? project.name.charAt(0).toUpperCase()}
          </span>
          <div>
            <div className={styles.projectName}>{project.name}</div>
            <a href="#" className={styles.projectUrl} onClick={(e) => e.preventDefault()}>
              {project.url}
            </a>
          </div>
        </div>
        <div className={styles.projectActions}>
          <StatusIcon status={project.status} />
          <button type="button" className={styles.moreBtn} aria-label="More options">
            <Icon name="more-horizontal" size={14} />
          </button>
        </div>
      </div>

      <div className={styles.projectMeta}>
        <span className={styles.repo}>
          <Icon name="code" size={12} />
          {project.repo}
        </span>
        <Badge tone="neutral">{KIND_LABELS[project.kind]}</Badge>
      </div>

      <p className={styles.commitMessage}>{project.commitMessage}</p>
      <div className={styles.projectFooter}>
        <span>{project.deployedAt}</span>
        <span className={styles.branch}>
          <Icon name="layers" size={12} />
          {project.branch}
        </span>
      </div>
    </Card>
  );
}

/** Vercel-inspired projects overview — usage sidebar, previews, and project grid. */
export function ProjectsDashboardView({ data }: ProjectsDashboardViewProps) {
  const [layout, setLayout] = useState<"grid" | "list">("grid");

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <button type="button" className={styles.breadcrumb}>
            All Projects
            <Icon name="chevron-down" size={14} />
          </button>
          <h1 className={styles.title}>Overview</h1>
        </div>
      </header>

      <div className={styles.toolbar}>
        <div className={styles.searchBar}>
          <Icon name="search" size={16} />
          <span>Search Projects…</span>
        </div>
        <div className={styles.toolbarActions}>
          <div className={styles.viewToggle} role="group" aria-label="View mode">
            <button
              type="button"
              className={cx(styles.viewBtn, layout === "grid" && styles.viewBtnActive)}
              aria-pressed={layout === "grid"}
              onClick={() => setLayout("grid")}
            >
              <Icon name="grid" size={14} />
            </button>
            <button
              type="button"
              className={cx(styles.viewBtn, layout === "list" && styles.viewBtnActive)}
              aria-pressed={layout === "list"}
              onClick={() => setLayout("list")}
            >
              <Icon name="list" size={14} />
            </button>
          </div>
          <button type="button" className={styles.addBtn}>
            Add New…
            <Icon name="chevron-down" size={14} />
          </button>
        </div>
      </div>

      <div className={styles.body}>
        <aside className={styles.widgets}>
          <Card padding="lg" className={styles.widget}>
            <div className={styles.widgetHeader}>
              <h2 className={styles.widgetTitle}>Usage</h2>
              <button type="button" className={styles.upgradeBtn}>
                Upgrade
              </button>
            </div>
            {data.usageExceeded && (
              <div className={styles.usageWarning}>
                <Icon name="zap" size={14} />
                Exceeded free resources
              </div>
            )}
            <ul className={styles.usageList}>
              {data.usageMetrics.map((metric) => {
                const percent = (metric.used / metric.limit) * 100;
                return (
                  <li key={metric.id} className={styles.usageItem}>
                    <UsageRing percent={percent} exceeded={metric.exceeded} />
                    <div className={styles.usageInfo}>
                      <span className={styles.usageLabel}>{metric.label}</span>
                      <span className={cx(styles.usageValue, metric.exceeded && styles.usageValueExceeded)}>
                        {metric.used}
                        {metric.unit} / {metric.limit}
                        {metric.unit}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </Card>

          <Card padding="lg" className={styles.widget}>
            <h2 className={styles.widgetTitle}>Alerts</h2>
            <p className={styles.widgetEmpty}>
              Upgrade to Pro to monitor project anomalies and get notified when builds fail.
            </p>
          </Card>

          <Card padding="lg" className={styles.widget}>
            <h2 className={styles.widgetTitle}>Recent Previews</h2>
            <ul className={styles.previewList}>
              {data.recentPreviews.map((preview) => (
                <li key={preview.id} className={styles.previewItem}>
                  <Avatar name={preview.author} size="sm" />
                  <div className={styles.previewBody}>
                    <div className={styles.previewBranch}>{preview.branch}</div>
                    <div className={styles.previewCommit}>{preview.commitMessage}</div>
                    <div className={styles.previewActions}>
                      <button type="button">Preview</button>
                      <button type="button">Source</button>
                      <span className={styles.previewTime}>{preview.timeAgo}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </aside>

        <section className={cx(styles.projects, layout === "list" && styles.projectsList)}>
          {data.projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </section>
      </div>
    </div>
  );
}
