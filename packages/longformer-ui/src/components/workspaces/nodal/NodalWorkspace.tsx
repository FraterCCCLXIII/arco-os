import { useCallback, useMemo, useRef, useState } from "react";
import { Icon } from "../../../icons";
import { cx } from "../../../utils/cx";
import { Avatar } from "../../primitives/Avatar";
import { Button } from "../../primitives/Button";
import { IconButton } from "../../primitives/IconButton";
import { Tabs } from "../../primitives/Tabs";
import { ToolDock, designShellStyles as shell } from "../design-shell";
import { NODAL_SAMPLE_DATA } from "./sample-data";
import type { NodalNode, NodalToolId, NodalWorkspaceData } from "./types";
import styles from "./NodalWorkspace.module.css";

export interface NodalWorkspaceProps {
  data?: NodalWorkspaceData;
  className?: string;
}

const TOOL_DOCK: { id: NodalToolId; label: string; icon: import("../../../icons").IconName; swatch?: string }[] = [
  { id: "select", label: "Select", icon: "arrow-up-right" },
  { id: "hand", label: "Hand", icon: "globe" },
  { id: "pen", label: "Marker", icon: "edit", swatch: "var(--lf-app-hue-rose-solid)" },
  { id: "sticky", label: "Sticky note", icon: "square", swatch: "var(--lf-warning-muted)" },
  { id: "rectangle", label: "Rectangle", icon: "square" },
  { id: "circle", label: "Circle", icon: "target" },
  { id: "connector", label: "Connector", icon: "link" },
  { id: "text", label: "Text", icon: "paragraph" },
  { id: "table", label: "Table", icon: "grid" },
  { id: "stamp", label: "Stamp", icon: "star" },
];

function connectorPath(from: NodalNode, to: NodalNode) {
  const start = { x: from.x + from.width, y: from.y + from.height / 2 };
  const end = { x: to.x, y: to.y + to.height / 2 };
  const midX = (start.x + end.x) / 2;
  return `M ${start.x} ${start.y} C ${midX} ${start.y}, ${midX} ${end.y}, ${end.x} ${end.y}`;
}

/** FigJam-style whiteboard workspace with dot grid, shapes, and connectors. */
export function NodalWorkspace({ data = NODAL_SAMPLE_DATA, className }: NodalWorkspaceProps) {
  const [activeTabId, setActiveTabId] = useState(data.tabs[data.tabs.length - 1]?.id ?? "tab-1");
  const [nodes, setNodes] = useState<NodalNode[]>(() => data.nodes.map((node) => ({ ...node })));
  const [selectedId, setSelectedId] = useState<string | null>("node-circle");
  const [activeTool, setActiveTool] = useState<NodalToolId>("select");
  const [zoom, setZoom] = useState(100);
  const dragRef = useRef<{ id: string; offsetX: number; offsetY: number } | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const documentTabs = useMemo(
    () => data.tabs.map((tab) => ({ id: tab.id, label: tab.label })),
    [data.tabs],
  );

  const selectedNode = nodes.find((node) => node.id === selectedId) ?? null;

  const connectors = useMemo(
    () =>
      data.connectors
        .map((connector) => {
          const from = nodes.find((node) => node.id === connector.fromId);
          const to = nodes.find((node) => node.id === connector.toId);
          if (!from || !to) return null;
          return { id: connector.id, d: connectorPath(from, to) };
        })
        .filter((entry): entry is { id: string; d: string } => Boolean(entry)),
    [data.connectors, nodes],
  );

  const handlePointerDown = useCallback(
    (event: React.PointerEvent, node: NodalNode) => {
      if (activeTool !== "select") return;
      event.stopPropagation();
      setSelectedId(node.id);
      dragRef.current = {
        id: node.id,
        offsetX: event.clientX - node.x,
        offsetY: event.clientY - node.y,
      };
      (event.target as HTMLElement).setPointerCapture(event.pointerId);
    },
    [activeTool],
  );

  const handlePointerMove = useCallback((event: React.PointerEvent) => {
    const drag = dragRef.current;
    if (!drag || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    setNodes((current) =>
      current.map((node) =>
        node.id === drag.id
          ? { ...node, x: event.clientX - rect.left - drag.offsetX, y: event.clientY - rect.top - drag.offsetY }
          : node,
      ),
    );
  }, []);

  const handlePointerUp = useCallback(() => {
    dragRef.current = null;
  }, []);

  const addShape = useCallback(
    (kind: NodalNode["kind"]) => {
      const id = `node-${Date.now()}`;
      const next: NodalNode = {
        id,
        kind,
        x: 180 + nodes.length * 24,
        y: 140 + nodes.length * 16,
        width: kind === "circle" ? 140 : 240,
        height: kind === "circle" ? 140 : 160,
        label: kind === "circle" || kind === "text" ? "New idea" : undefined,
      };
      setNodes((current) => [...current, next]);
      setSelectedId(id);
      setActiveTool("select");
    },
    [nodes.length],
  );

  function handleToolSelect(toolId: NodalToolId) {
    setActiveTool(toolId);
    if (toolId === "rectangle" || toolId === "circle" || toolId === "sticky") {
      addShape(toolId === "sticky" ? "sticky" : toolId);
    }
  }

  const toolbarStyle = selectedNode
    ? { left: selectedNode.x + selectedNode.width / 2, top: selectedNode.y - 12 }
    : undefined;

  return (
    <div className={cx(shell.workspace, styles.workspace, className)} data-lf-theme="light" aria-label="Nodal">
      <header className={shell.topBar}>
        <IconButton icon="more-horizontal" label="Menu" size="sm" />
        <div className={styles.fileMeta}>
          <h1 className={styles.fileName}>{data.fileName}</h1>
          <Icon name="layers" size={14} />
        </div>
        <Tabs
          className={shell.topBarTabs}
          variant="pill"
          items={documentTabs}
          value={activeTabId}
          onChange={setActiveTabId}
          aria-label="Open boards"
        />
        <div className={shell.topBarGroup}>
          <Avatar name="Alex Morgan" size="sm" />
          <IconButton icon="panel-right" label="Toggle sidebar" size="sm" />
          <span className={styles.timer}>03:00</span>
          <Button variant="primary" size="sm">
            Share
          </Button>
        </div>
      </header>

      <div className={styles.canvasWrap}>
        <div
          ref={canvasRef}
          className={styles.canvas}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          onClick={() => setSelectedId(null)}
        >
          <svg className={styles.connectorLayer} aria-hidden>
            <defs>
              <marker id="nodal-arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
                <path d="M0,0 L8,4 L0,8 Z" fill="var(--lf-text-primary)" />
              </marker>
            </defs>
            {connectors.map((connector) => (
              <path key={connector.id} className={styles.connector} d={connector.d} />
            ))}
          </svg>

          {nodes.map((node) => (
            <div
              key={node.id}
              className={cx(
                styles.node,
                node.kind === "rectangle" && styles.nodeRectangle,
                node.kind === "circle" && styles.nodeCircle,
                node.kind === "sticky" && styles.nodeSticky,
                selectedId === node.id && styles.nodeSelected,
              )}
              style={{ left: node.x, top: node.y, width: node.width, height: node.height }}
              onPointerDown={(event) => handlePointerDown(event, node)}
              onClick={(event) => event.stopPropagation()}
            >
              {node.label ? <span className={styles.nodeLabel}>{node.label}</span> : null}
            </div>
          ))}

          {selectedNode && toolbarStyle ? (
            <div
              className={styles.contextToolbar}
              style={toolbarStyle}
              role="toolbar"
              aria-label="Selection tools"
              onClick={(event) => event.stopPropagation()}
            >
              <IconButton icon="target" label="Shape" size="sm" variant="ghost" />
              <span className={styles.toolAccent} style={{ background: "var(--lf-surface-1)" }} aria-hidden />
              <span className={styles.contextDivider} />
              <IconButton icon="align-left" label="Align left" size="sm" variant="ghost" />
              <Button variant="ghost" size="sm">
                Small
              </Button>
              <Button variant="ghost" size="sm">
                B
              </Button>
              <Button variant="ghost" size="sm">
                S
              </Button>
              <IconButton icon="link" label="Link" size="sm" variant="ghost" />
              <IconButton icon="list" label="List" size="sm" variant="ghost" />
              <IconButton icon="more-vertical" label="More" size="sm" variant="ghost" />
            </div>
          ) : null}
        </div>

        <ToolDock
          items={TOOL_DOCK}
          activeId={activeTool}
          onSelect={(id) => handleToolSelect(id as NodalToolId)}
          dividersBefore={[2, 7]}
          trailing={<IconButton icon="plus" label="Add plugin" size="sm" variant="ghost" />}
          aria-label="Board tools"
        />

        <div className={styles.zoomWidget} aria-label="Zoom controls">
          <span className={styles.zoomLevel} aria-live="polite">
            {zoom}%
          </span>
          <IconButton
            icon="minus"
            label="Zoom out"
            size="sm"
            variant="ghost"
            onClick={() => setZoom((value) => Math.max(25, value - 25))}
          />
          <IconButton
            icon="plus"
            label="Zoom in"
            size="sm"
            variant="ghost"
            onClick={() => setZoom((value) => Math.min(200, value + 25))}
          />
          <IconButton icon="message-square" label="Help" size="sm" variant="ghost" />
        </div>
      </div>
    </div>
  );
}
