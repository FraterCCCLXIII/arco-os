import { Icon } from "../../../icons";
import { Badge } from "../../primitives/Badge";
import { Card } from "../../primitives/Card";
import { cx } from "../../../utils/cx";
import type { GraphNode, PsycheWorkspaceData } from "./types";
import styles from "./KnowledgeGraphView.module.css";

export interface KnowledgeGraphViewProps {
  data: PsycheWorkspaceData;
}

const NODE_COLORS: Record<GraphNode["type"], string> = {
  concept: styles.nodeConcept,
  entity: styles.nodeEntity,
  event: styles.nodeEvent,
  value: styles.nodeValue,
  policy: styles.nodePolicy,
};

function GraphCanvas({ nodes, edges }: { nodes: GraphNode[]; edges: PsycheWorkspaceData["graphEdges"] }) {
  return (
    <div className={styles.canvas} aria-label="Knowledge graph visualization">
      <svg className={styles.edges} aria-hidden="true">
        {edges.map((edge) => {
          const from = nodes.find((n) => n.id === edge.from);
          const to = nodes.find((n) => n.id === edge.to);
          if (!from || !to) return null;
          return (
            <g key={edge.id}>
              <line
                x1={`${from.x}%`}
                y1={`${from.y}%`}
                x2={`${to.x}%`}
                y2={`${to.y}%`}
                className={styles.edgeLine}
                strokeWidth={Math.max(1, edge.weight * 2)}
              />
            </g>
          );
        })}
      </svg>

      {nodes.map((node) => (
        <div
          key={node.id}
          className={cx(styles.node, NODE_COLORS[node.type])}
          style={{ left: `${node.x}%`, top: `${node.y}%` }}
        >
          <span className={styles.nodeLabel}>{node.label}</span>
          <span className={styles.nodeType}>{node.type}</span>
        </div>
      ))}
    </div>
  );
}

/** Knowledge graph — entity relationships, concepts, and policy nodes. */
export function KnowledgeGraphView({ data }: KnowledgeGraphViewProps) {
  const { graphNodes, graphEdges } = data;

  return (
    <div className={styles.view}>
      <header className={styles.header}>
        <h1 className={styles.title}>Knowledge Graph</h1>
        <p className={styles.subtitle}>
          Structured relationships between concepts, entities, events, values, and policies in the model&apos;s world model.
        </p>
      </header>

      <div className={styles.layout}>
        <Card padding="none" className={styles.graphCard}>
          <GraphCanvas nodes={graphNodes} edges={graphEdges} />
        </Card>

        <aside className={styles.sidebar}>
          <h2 className={styles.sectionTitle}>Graph Stats</h2>
          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statValue}>{graphNodes.length}</span>
              <span className={styles.statLabel}>Nodes</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statValue}>{graphEdges.length}</span>
              <span className={styles.statLabel}>Edges</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statValue}>4.2</span>
              <span className={styles.statLabel}>Avg degree</span>
            </div>
          </div>

          <h2 className={styles.sectionTitle}>Node Registry</h2>
          <div className={styles.nodeList}>
            {graphNodes.map((node) => (
              <div key={node.id} className={styles.nodeRow}>
                <span className={cx(styles.nodeDot, NODE_COLORS[node.type])} />
                <div className={styles.nodeInfo}>
                  <div className={styles.nodeName}>{node.label}</div>
                  <div className={styles.nodeMeta}>
                    {node.type} · {node.connections} connections
                  </div>
                </div>
                <Badge tone="neutral">{node.type}</Badge>
              </div>
            ))}
          </div>

          <h2 className={styles.sectionTitle}>Recent Edges</h2>
          <div className={styles.edgeList}>
            {graphEdges.slice(0, 5).map((edge) => (
              <div key={edge.id} className={styles.edgeRow}>
                <Icon name="link" size={12} />
                <span>
                  {graphNodes.find((n) => n.id === edge.from)?.label ?? edge.from}
                  <span className={styles.edgeLabel}> —{edge.label}→ </span>
                  {graphNodes.find((n) => n.id === edge.to)?.label ?? edge.to}
                </span>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
