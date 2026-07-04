import { cx } from "../../../../utils/cx";
import type { AgentStatusLineProps } from "./types";
import styles from "./AgentBlocks.module.css";

/** Dimmed one-line status between agent blocks, e.g. "Explored 24 files". */
export function AgentStatusLine({ children, className }: AgentStatusLineProps) {
  return <div className={cx(styles.status, className)}>{children}</div>;
}
