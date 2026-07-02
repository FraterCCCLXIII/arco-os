import type { ReactNode } from "react";
import { Icon } from "../../../icons";
import { TopBar, type BreadcrumbItem } from "../../shell/TopBar";
import { ScrollArea } from "../../primitives/ScrollArea";
import { DocBlock } from "./DocBlock";
import { NotesGraphView } from "./NotesGraphView";
import { NoteTag } from "./WikiLink";
import type { DocBlockNode, NotesGraphEdge, NotesGraphNode, NotesView } from "./types";
import styles from "./NotesWorkspace.module.css";

export interface NotesWorkspaceProps {
  breadcrumb: BreadcrumbItem[];
  title: string;
  tags?: string[];
  collaborators?: { name: string; src?: string }[];
  actions?: ReactNode;
  blocks: DocBlockNode[];
  /** Optional formatting toolbar rendered below the breadcrumb bar. */
  toolbar?: ReactNode;
  /** Graph data derived from the note vault. */
  graphNodes?: NotesGraphNode[];
  graphEdges?: NotesGraphEdge[];
  activeNoteId?: string;
  view?: NotesView;
  graphPanelOpen?: boolean;
  onToggleGraphPanel?: () => void;
  onViewChange?: (view: NotesView) => void;
  onNoteSelect?: (noteId: string) => void;
  backlinkCount?: number;
  wordCount?: number;
}

/** A Notion-style document surface with optional Obsidian-style graph panel. */
export function NotesWorkspace({
  breadcrumb,
  title,
  tags,
  collaborators,
  actions,
  blocks,
  toolbar,
  graphNodes = [],
  graphEdges = [],
  activeNoteId,
  view = "editor",
  graphPanelOpen = true,
  onToggleGraphPanel,
  onViewChange,
  onNoteSelect,
  backlinkCount = 0,
  wordCount,
}: NotesWorkspaceProps) {
  const graphActions = (
    <>
      {actions}
      {graphNodes.length > 0 && (
        <>
          <button
            type="button"
            className={styles.graphToggle}
            aria-pressed={view === "graph"}
            title="Full graph view"
            onClick={() => onViewChange?.(view === "graph" ? "editor" : "graph")}
          >
            <Icon name="globe" size={16} />
          </button>
          {view === "editor" && (
            <button
              type="button"
              className={styles.graphToggle}
              aria-pressed={graphPanelOpen}
              title={graphPanelOpen ? "Hide graph panel" : "Show graph panel"}
              onClick={onToggleGraphPanel}
            >
              <Icon name="panel-right" size={16} />
            </button>
          )}
        </>
      )}
    </>
  );

  if (view === "graph" && graphNodes.length > 0) {
    return (
      <div className={styles.workspace}>
        <TopBar breadcrumb={breadcrumb} collaborators={collaborators} actions={graphActions} />
        <ScrollArea className={styles.scroll}>
          <NotesGraphView
            nodes={graphNodes}
            edges={graphEdges}
            activeNoteId={activeNoteId}
            activeNoteTitle={title}
            onNodeClick={onNoteSelect}
          />
        </ScrollArea>
      </div>
    );
  }

  return (
    <div className={styles.workspace}>
      <TopBar breadcrumb={breadcrumb} collaborators={collaborators} actions={graphActions} />
      {toolbar}
      <div className={styles.body}>
        <ScrollArea className={styles.editorPane}>
          <div className={styles.page}>
            <h1 className={styles.title}>{title}</h1>
            {tags && tags.length > 0 && (
              <div className={styles.tags}>
                {tags.map((tag) => (
                  <NoteTag key={tag} label={tag} />
                ))}
              </div>
            )}
            {blocks.map((block) => (
              <DocBlock key={block.id} node={block} />
            ))}
            {(backlinkCount > 0 || wordCount !== undefined) && (
              <footer className={styles.meta}>
                {backlinkCount > 0 && (
                  <span>{backlinkCount} backlink{backlinkCount === 1 ? "" : "s"}</span>
                )}
                {backlinkCount > 0 && wordCount !== undefined && <span aria-hidden="true"> · </span>}
                {wordCount !== undefined && <span>{wordCount} words</span>}
              </footer>
            )}
          </div>
        </ScrollArea>

        {graphPanelOpen && graphNodes.length > 0 && (
          <aside className={styles.graphPane} aria-label="Graph of current note">
            <NotesGraphView
              nodes={graphNodes}
              edges={graphEdges}
              activeNoteId={activeNoteId}
              activeNoteTitle={title}
              onNodeClick={onNoteSelect}
              compact
            />
          </aside>
        )}
      </div>
    </div>
  );
}
