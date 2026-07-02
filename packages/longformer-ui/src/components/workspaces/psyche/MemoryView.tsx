import { useMemo, useState } from "react";
import { Icon } from "../../../icons";
import { Badge } from "../../primitives/Badge";
import { Card } from "../../primitives/Card";
import { Input } from "../../primitives/Input";
import { cx } from "../../../utils/cx";
import type { MemoryEntry, MemoryKind, PsycheWorkspaceData } from "./types";
import styles from "./MemoryView.module.css";

export interface MemoryViewProps {
  data: PsycheWorkspaceData;
}

const KIND_LABELS: Record<MemoryKind, string> = {
  episodic: "Episodic",
  semantic: "Semantic",
  working: "Working",
  procedural: "Procedural",
};

function kindIconClass(kind: MemoryKind) {
  const map: Record<MemoryKind, string> = {
    episodic: styles.kindEpisodic,
    semantic: styles.kindSemantic,
    working: styles.kindWorking,
    procedural: styles.kindProcedural,
  };
  return map[kind];
}

function statusTone(status: MemoryEntry["status"]) {
  switch (status) {
    case "active":
      return "success" as const;
    case "pending":
      return "warning" as const;
    case "conflicted":
      return "danger" as const;
    default:
      return "neutral" as const;
  }
}

function MemoryCard({ entry }: { entry: MemoryEntry }) {
  return (
    <Card padding="lg" className={styles.memoryCard}>
      <div className={styles.memoryHead}>
        <div className={styles.memoryTitleRow}>
          <span className={cx(styles.kindIcon, kindIconClass(entry.kind))}>
            <Icon name="bookmark" size={14} />
          </span>
          <div>
            <div className={styles.memoryTitle}>{entry.title}</div>
            <div className={styles.memorySource}>{entry.source}</div>
          </div>
        </div>
        <Badge tone={statusTone(entry.status)}>{entry.status}</Badge>
      </div>

      <p className={styles.memorySummary}>{entry.summary}</p>

      <div className={styles.memoryMeta}>
        <span className={styles.kindPill}>{KIND_LABELS[entry.kind]}</span>
        <span>{entry.confidence}% confidence</span>
        <span>Last accessed {entry.lastAccessed}</span>
      </div>

      <div className={styles.confidenceBar} aria-hidden="true">
        <div className={styles.confidenceFill} style={{ width: `${entry.confidence}%` }} />
      </div>

      <div className={styles.tags}>
        {entry.tags.map((tag) => (
          <span key={tag} className={styles.tag}>
            {tag}
          </span>
        ))}
      </div>
    </Card>
  );
}

/** Memory store — episodic, semantic, working, and procedural entries. */
export function MemoryView({ data }: MemoryViewProps) {
  const [query, setQuery] = useState("");
  const [kindFilter, setKindFilter] = useState<MemoryKind | "all">("all");

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return data.memoryEntries.filter((entry) => {
      if (kindFilter !== "all" && entry.kind !== kindFilter) return false;
      if (!normalized) return true;
      return (
        entry.title.toLowerCase().includes(normalized) ||
        entry.summary.toLowerCase().includes(normalized) ||
        entry.tags.some((tag) => tag.toLowerCase().includes(normalized))
      );
    });
  }, [data.memoryEntries, query, kindFilter]);

  const counts = useMemo(() => {
    const map: Record<MemoryKind, number> = { episodic: 0, semantic: 0, working: 0, procedural: 0 };
    for (const entry of data.memoryEntries) map[entry.kind] += 1;
    return map;
  }, [data.memoryEntries]);

  return (
    <div className={styles.view}>
      <header className={styles.header}>
        <h1 className={styles.title}>Memory</h1>
        <p className={styles.subtitle}>
          Long-term and working memory for {data.modelName} — episodic traces, semantic facts, and procedural patterns.
        </p>
      </header>

      <div className={styles.filters}>
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search memories, tags, sources…"
          startSlot={<Icon name="search" size={14} />}
          className={styles.search}
        />
        <div className={styles.kindFilters}>
          <button
            type="button"
            className={cx(styles.kindBtn, kindFilter === "all" && styles.kindBtnActive)}
            onClick={() => setKindFilter("all")}
          >
            All ({data.memoryEntries.length})
          </button>
          {(Object.keys(KIND_LABELS) as MemoryKind[]).map((kind) => (
            <button
              key={kind}
              type="button"
              className={cx(styles.kindBtn, kindFilter === kind && styles.kindBtnActive)}
              onClick={() => setKindFilter(kind)}
            >
              {KIND_LABELS[kind]} ({counts[kind]})
            </button>
          ))}
        </div>
      </div>

      <div className={styles.grid}>
        {filtered.map((entry) => (
          <MemoryCard key={entry.id} entry={entry} />
        ))}
      </div>
    </div>
  );
}
