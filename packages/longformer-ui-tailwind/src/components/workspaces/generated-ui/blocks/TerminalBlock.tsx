import styles from "../blocks.tailwind";
import type { GeneratedBlock } from "../types";

export function TerminalBlock({ block }: { block: Extract<GeneratedBlock, { type: "terminal" }> }) {
  return (
    <div className={styles.block}>
      <div className={styles.terminal}>
        <div className={styles.terminalHeader}>
          <span className={styles.terminalDot} />
          <span className={styles.terminalDot} />
          <span className={styles.terminalDot} />
        </div>
        <div className={styles.terminalBody}>
          {block.lines.map((line, index) => (
            <div key={index}>{line}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
