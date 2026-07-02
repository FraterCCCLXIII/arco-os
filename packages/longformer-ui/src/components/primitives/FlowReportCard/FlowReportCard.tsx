import { cx } from "../../../utils/cx";
import { AnalyticsCardHeader } from "../AnalyticsCardHeader";
import { Card } from "../Card";
import styles from "./FlowReportCard.module.css";
import type { IconName } from "../../../icons";

export type FlowReportTone = "purple" | "lavender" | "cyan" | "blue";

export interface FlowReportNode {
  label: string;
  value: string;
  tone?: FlowReportTone;
}

export interface FlowReportLink {
  from: number;
  to: number;
  tone?: "purple" | "cyan";
}

export interface FlowReportCardProps {
  title?: string;
  icon?: IconName;
  sources: FlowReportNode[];
  targets: FlowReportNode[];
  links?: FlowReportLink[];
  externalLink?: boolean;
  className?: string;
}

/** Sankey-style expense flow — source categories on the left, destinations on the right. */
export function FlowReportCard({
  title = "Flow report",
  icon = "folder",
  sources,
  targets,
  links,
  externalLink = true,
  className,
}: FlowReportCardProps) {
  const resolvedLinks =
    links ??
    sources.flatMap((_, from) =>
      targets.map((__, to) => ({
        from,
        to,
        tone: (from + to) % 2 === 0 ? ("purple" as const) : ("cyan" as const),
      })),
    );

  return (
    <Card padding="lg" className={cx(styles.card, className)}>
      <AnalyticsCardHeader title={title} icon={icon} externalLink={externalLink} />
      <div className={styles.diagram}>
        <div className={styles.column}>
          {sources.map((node, index) => (
            <div key={index} className={styles.nodeRow}>
              <span className={cx(styles.bar, node.tone && styles[`bar-${node.tone}`])} />
              <span className={styles.nodeText}>
                {node.label} <strong>{node.value}</strong>
              </span>
            </div>
          ))}
        </div>
        <svg className={styles.flows} viewBox="0 0 120 160" preserveAspectRatio="none" aria-hidden="true">
          {resolvedLinks.map((link, index) => {
            const fromY = 24 + link.from * 48;
            const toY = 24 + link.to * 72;
            return (
              <path
                key={index}
                d={`M0 ${fromY} C 40 ${fromY}, 80 ${toY}, 120 ${toY}`}
                className={cx(styles.flowPath, link.tone && styles[`flow-${link.tone}`])}
              />
            );
          })}
        </svg>
        <div className={styles.column}>
          {targets.map((node, index) => (
            <div key={index} className={styles.nodeRow}>
              <span className={cx(styles.bar, node.tone && styles[`bar-${node.tone}`])} />
              <span className={styles.nodeText}>
                {node.label} <strong>{node.value}</strong>
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
