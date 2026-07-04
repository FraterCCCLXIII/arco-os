import type { ReactNode } from "react";
import styles from "./WorkspaceWindowShell.tailwind";

export interface WorkspaceWindowShellProps {
  children: ReactNode;
}

/** Fills a desktop window frame so workspace UIs scale with the window bounds. */
export function WorkspaceWindowShell({ children }: WorkspaceWindowShellProps) {
  return <div className={styles.shell}>{children}</div>;
}
