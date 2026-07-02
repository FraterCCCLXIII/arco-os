import { useMemo, useState } from "react";
import { Icon, type IconName } from "../../../icons";
import { Button } from "../../primitives/Button";
import { Card } from "../../primitives/Card";
import { cx } from "../../../utils/cx";
import type {
  Transcript,
  TranscriptMetric,
  TranscriptSourceType,
  TranscriptStatus,
  TranscribeWorkspaceData,
} from "./types";
import { filterTranscripts, formatDuration } from "./types";
import styles from "./TranscriptionsListView.module.css";

export interface TranscriptionsListViewProps {
  data: TranscribeWorkspaceData;
}

const SOURCE_ICON: Record<TranscriptSourceType, IconName> = {
  call: "phone-call",
  meeting: "users",
  podcast: "play",
  upload: "file",
  recording: "mic",
};

const STATUS_LABEL: Record<TranscriptStatus, string> = {
  queued: "Queued",
  processing: "Processing",
  ready: "Ready",
  failed: "Failed",
};

function MetricCard({ metric }: { metric: TranscriptMetric }) {
  const trendUp = metric.trend >= 0;

  return (
    <Card padding="lg" className={styles.metricCard}>
      <span className={styles.metricLabel}>{metric.label}</span>
      <div className={styles.metricRow}>
        <span className={styles.metricValue}>{metric.value}</span>
        <span className={cx(styles.metricTrend, trendUp ? styles.trendUp : styles.trendDown)}>
          <Icon name={trendUp ? "chevron-up" : "chevron-down"} size={12} />
          {Math.abs(metric.trend)}%
        </span>
      </div>
    </Card>
  );
}

function TranscriptRow({ transcript }: { transcript: Transcript }) {
  return (
    <tr>
      <td className={styles.checkboxCol}>
        <input type="checkbox" aria-label={`Select ${transcript.title}`} />
      </td>
      <td>
        <div className={styles.titleCell}>
          <span className={styles.title}>{transcript.title}</span>
          {transcript.excerpt ? <span className={styles.excerpt}>{transcript.excerpt}</span> : null}
        </div>
      </td>
      <td>
        <span className={styles.sourceCell}>
          <Icon name={SOURCE_ICON[transcript.sourceType]} size={14} />
          {transcript.sourceLabel}
        </span>
      </td>
      <td>
        <span
          className={cx(
            styles.statusBadge,
            transcript.status === "ready" && styles.statusReady,
            transcript.status === "processing" && styles.statusProcessing,
            transcript.status === "queued" && styles.statusQueued,
            transcript.status === "failed" && styles.statusFailed,
          )}
        >
          {transcript.status === "processing" ? (
            <Icon name="loader" size={12} className={styles.spinner} />
          ) : null}
          {STATUS_LABEL[transcript.status]}
        </span>
      </td>
      <td>
        <span className={styles.duration}>{formatDuration(transcript.durationMs)}</span>
      </td>
      <td>
        <span className={styles.meta}>
          {transcript.wordCount ? `${transcript.wordCount.toLocaleString()} words` : "—"}
        </span>
      </td>
      <td>
        <span className={styles.meta}>{transcript.createdAt}</span>
      </td>
      <td className={styles.actionsCol}>
        <button type="button" className={styles.actionBtn} aria-label={`Actions for ${transcript.title}`}>
          <Icon name="more-horizontal" size={16} />
        </button>
      </td>
    </tr>
  );
}

/** Transcript library — KPI summary, filters, and searchable transcript table. */
export function TranscriptionsListView({ data }: TranscriptionsListViewProps) {
  const [showProcessingBanner, setShowProcessingBanner] = useState(true);
  const [statusFilter, setStatusFilter] = useState<TranscriptStatus | "all">("all");
  const [sourceFilter, setSourceFilter] = useState<TranscriptSourceType | "all">("all");

  const visibleTranscripts = useMemo(
    () =>
      filterTranscripts(data.transcripts, {
        status: statusFilter,
        sourceType: sourceFilter,
      }),
    [data.transcripts, statusFilter, sourceFilter],
  );

  return (
    <div className={styles.libraryView}>
      <header className={styles.header}>
        <h1 className={styles.title}>Library</h1>
        <div className={styles.headerActions}>
          <Button type="button" variant="secondary" size="sm">
            Export all
          </Button>
          <Button type="button" variant="primary" size="sm" className={styles.uploadBtn}>
            <Icon name="attach" size={14} />
            Upload
          </Button>
        </div>
      </header>

      <div className={styles.metrics}>
        {data.metrics.map((metric) => (
          <MetricCard key={metric.id} metric={metric} />
        ))}
      </div>

      <div className={styles.filters}>
        <button type="button" className={styles.filterBtn}>
          Last 30 Days
          <Icon name="chevron-down" size={14} />
        </button>
        <button
          type="button"
          className={styles.filterBtn}
          onClick={() =>
            setSourceFilter((prev) =>
              prev === "all"
                ? "meeting"
                : prev === "meeting"
                  ? "call"
                  : prev === "call"
                    ? "podcast"
                    : prev === "podcast"
                      ? "upload"
                      : prev === "upload"
                        ? "recording"
                        : "all",
            )
          }
        >
          Source{sourceFilter !== "all" ? `: ${sourceFilter}` : ""}
          <Icon name="chevron-down" size={14} />
        </button>
        <button
          type="button"
          className={styles.filterBtn}
          onClick={() =>
            setStatusFilter((prev) =>
              prev === "all"
                ? "ready"
                : prev === "ready"
                  ? "processing"
                  : prev === "processing"
                    ? "queued"
                    : prev === "queued"
                      ? "failed"
                      : "all",
            )
          }
        >
          Status{statusFilter !== "all" ? `: ${statusFilter}` : ""}
          <Icon name="chevron-down" size={14} />
        </button>
        <button type="button" className={styles.filterBtn}>
          Language
          <Icon name="chevron-down" size={14} />
        </button>
      </div>

      {showProcessingBanner && data.processingCount > 0 ? (
        <div className={styles.processingBanner} role="status">
          <p className={styles.processingText}>
            {data.processingCount} transcript{data.processingCount === 1 ? "" : "s"} currently processing
          </p>
          <div className={styles.processingActions}>
            <button type="button" className={styles.processingBtn} onClick={() => setShowProcessingBanner(false)}>
              Dismiss
            </button>
            <button type="button" className={cx(styles.processingBtn, styles.processingBtnPrimary)}>
              View queue
            </button>
          </div>
        </div>
      ) : null}

      <Card padding="none" className={styles.tableCard}>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th scope="col" className={styles.checkboxCol}>
                  <input type="checkbox" aria-label="Select all transcripts" />
                </th>
                <th scope="col">Title</th>
                <th scope="col">Source</th>
                <th scope="col">Status</th>
                <th scope="col">Duration</th>
                <th scope="col">Words</th>
                <th scope="col">Created</th>
                <th scope="col" className={styles.actionsCol} aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {visibleTranscripts.length === 0 ? (
                <tr>
                  <td colSpan={8} className={styles.empty}>
                    No transcripts match the current filters.
                  </td>
                </tr>
              ) : (
                visibleTranscripts.map((transcript) => (
                  <TranscriptRow key={transcript.id} transcript={transcript} />
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
