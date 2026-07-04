import { useMemo } from "react";
import { Icon } from "../../../icons";
import { Badge } from "../../primitives/Badge";
import { Card } from "../../primitives/Card";
import { cx } from "../../../utils/cx";
import { useForceLayout } from "./useForceLayout";
import type { NotesGraphEdge, NotesGraphNode } from "./types";
import styles from "./NotesGraphView.tailwind";

export interface NotesGraphViewProps {
  nodes: NotesGraphNode[];
  edges: NotesGraphEdge[];
  activeNoteId?: string;
  activeNoteTitle?: string;
  onNodeClick?: (noteId: string) => void;
  compact?: boolean;
}

function GraphCanvas({
  nodes,
  edges,
  activeNoteId,
  onNodeClick,
  compact,
}: {
  nodes: NotesGraphNode[];
  edges: NotesGraphEdge[];
  activeNoteId?: string;
  onNodeClick?: (noteId: string) => void;
  compact?: boolean;
}) {
  const layoutNodes = useForceLayout(nodes, edges, activeNoteId);

  const linkedIds = useMemo(() => {
    if (!activeNoteId) return new Set<string>();
    const ids = new Set<string>([activeNoteId]);
    for (const edge of edges) {
      if (edge.from === activeNoteId) ids.add(edge.to);
      if (edge.to === activeNoteId) ids.add(edge.from);
    }
    return ids;
  }, [edges, activeNoteId]);

  const maxConnections = Math.max(1, ...layoutNodes.map((node) => node.connections));

  return (
    <div className={cx(styles.canvas, compact && styles.canvasCompact)} aria-label="Notes graph visualization">
      <svg className={styles.edges} aria-hidden="true">
        {edges.map((edge) => {
          const from = layoutNodes.find((node) => node.id === edge.from);
          const to = layoutNodes.find((node) => node.id === edge.to);
          if (!from || !to) return null;
          const isActiveEdge =
            activeNoteId &&
            (edge.from === activeNoteId || edge.to === activeNoteId);
          return (
            <line
              key={edge.id}
              x1={`${from.x}%`}
              y1={`${from.y}%`}
              x2={`${to.x}%`}
              y2={`${to.y}%`}
              className={cx(styles.edgeLine, isActiveEdge && styles.edgeLineActive)}
            />
          );
        })}
      </svg>

      {layoutNodes.map((node) => {
        const isActive = node.id === activeNoteId;
        const isLinked = linkedIds.has(node.id);
        const isEvergreen = node.tags?.includes("evergreen");
        const size = 6 + (node.connections / maxConnections) * 10;

        return (
          <button
            key={node.id}
            type="button"
            className={cx(
              styles.node,
              isActive && styles.nodeActive,
              isLinked && !isActive && styles.nodeLinked,
              isEvergreen && styles.nodeEvergreen,
            )}
            style={{
              left: `${node.x}%`,
              top: `${node.y}%`,
              width: size,
              height: size,
            }}
            title={node.label}
            aria-label={`${node.label}, ${node.connections} connections`}
            aria-current={isActive ? "true" : undefined}
            onClick={() => onNodeClick?.(node.id)}
          />
        );
      })}
    </div>
  );
}

/** Obsidian-style force-directed graph of note links and backlinks. */
export function NotesGraphView({
  nodes,
  edges,
  activeNoteId,
  activeNoteTitle,
  onNodeClick,
  compact = false,
}: NotesGraphViewProps) {
  const avgDegree =
    nodes.length > 0
      ? (edges.length * 2 / nodes.length).toFixed(1)
      : "0";

  if (compact) {
    return (
      <div className={styles.compactView}>
        <header className={styles.compactHeader}>
          <span className={styles.compactTitle}>
            Graph of {activeNoteTitle ?? "vault"}
          </span>
          <Badge tone="neutral">{nodes.length} notes</Badge>
        </header>
        <GraphCanvas
          nodes={nodes}
          edges={edges}
          activeNoteId={activeNoteId}
          onNodeClick={onNodeClick}
          compact
        />
        <p className={styles.compactHint}>
          Click a node to open that note. Green highlights show links from the active page.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.view}>
      <header className={styles.header}>
        <h1 className={styles.title}>Graph view</h1>
        <p className={styles.subtitle}>
          Explore connections between notes — derived from wikilinks, backlinks, and shared tags in your vault.
        </p>
      </header>

      <div className={styles.layout}>
        <Card padding="none" className={styles.graphCard}>
          <GraphCanvas
            nodes={nodes}
            edges={edges}
            activeNoteId={activeNoteId}
            onNodeClick={onNodeClick}
          />
        </Card>

        <aside className={styles.sidebar}>
          <h2 className={styles.sectionTitle}>Vault stats</h2>
          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statValue}>{nodes.length}</span>
              <span className={styles.statLabel}>Notes</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statValue}>{edges.length}</span>
              <span className={styles.statLabel}>Links</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statValue}>{avgDegree}</span>
              <span className={styles.statLabel}>Avg degree</span>
            </div>
          </div>

          <h2 className={styles.sectionTitle}>Notes</h2>
          <div className={styles.nodeList}>
            {nodes.map((node) => (
              <button
                key={node.id}
                type="button"
                className={cx(styles.nodeRow, node.id === activeNoteId && styles.nodeRowActive)}
                onClick={() => onNodeClick?.(node.id)}
              >
                <span
                  className={cx(
                    styles.nodeDot,
                    node.tags?.includes("evergreen") && styles.nodeDotEvergreen,
                    node.id === activeNoteId && styles.nodeDotActive,
                  )}
                />
                <div className={styles.nodeInfo}>
                  <div className={styles.nodeName}>{node.label}</div>
                  <div className={styles.nodeMeta}>{node.connections} connections</div>
                </div>
                {node.tags?.[0] && <Badge tone="neutral">{node.tags[0]}</Badge>}
              </button>
            ))}
          </div>

          <h2 className={styles.sectionTitle}>Recent links</h2>
          <div className={styles.edgeList}>
            {edges.slice(0, 6).map((edge) => (
              <div key={edge.id} className={styles.edgeRow}>
                <Icon name="link" size={12} />
                <span>
                  {nodes.find((node) => node.id === edge.from)?.label ?? edge.from}
                  <span className={styles.edgeArrow}> → </span>
                  {nodes.find((node) => node.id === edge.to)?.label ?? edge.to}
                </span>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
