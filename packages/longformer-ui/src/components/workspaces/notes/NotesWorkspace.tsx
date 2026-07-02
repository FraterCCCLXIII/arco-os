import type { ReactNode } from "react";
import { TopBar, type BreadcrumbItem } from "../../shell/TopBar";
import { ScrollArea } from "../../primitives/ScrollArea";
import { DocBlock } from "./DocBlock";
import type { DocBlockNode } from "./types";
import styles from "./NotesWorkspace.module.css";

export interface NotesWorkspaceProps {
  breadcrumb: BreadcrumbItem[];
  title: string;
  collaborators?: { name: string; src?: string }[];
  actions?: ReactNode;
  blocks: DocBlockNode[];
  /** Optional formatting toolbar rendered below the breadcrumb bar, e.g. an `EditorToolbar`. */
  toolbar?: ReactNode;
}

/** A Notion-style document surface: breadcrumb + title + rich content blocks. */
export function NotesWorkspace({ breadcrumb, title, collaborators, actions, blocks, toolbar }: NotesWorkspaceProps) {
  return (
    <div className={styles.workspace}>
      <TopBar breadcrumb={breadcrumb} collaborators={collaborators} actions={actions} />
      {toolbar}
      <ScrollArea className={styles.scroll}>
        <div className={styles.page}>
          <h1 className={styles.title}>{title}</h1>
          {blocks.map((block) => (
            <DocBlock key={block.id} node={block} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
