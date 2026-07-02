import { ScrollArea } from "../../primitives/ScrollArea";
import { Icon } from "../../../icons";
import { GeneratedSurface } from "./GeneratedSurface";
import type { GeneratedSurfaceSchema } from "./types";
import styles from "./GeneratedUIWorkspace.module.css";

export interface GeneratedUIWorkspaceProps {
  title?: string;
  schema: GeneratedSurfaceSchema;
}

/** Wraps GeneratedSurface in the same header + scroll shape as the other workspaces. */
export function GeneratedUIWorkspace({ title = "Generated UI", schema }: GeneratedUIWorkspaceProps) {
  return (
    <div className={styles.workspace}>
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <span className={styles.headerIcon}>
            <Icon name="sparkles" size={15} />
          </span>
          {title}
        </div>
      </div>
      <ScrollArea className={styles.scroll}>
        <div className={styles.page}>
          <GeneratedSurface schema={schema} />
        </div>
      </ScrollArea>
    </div>
  );
}
