import styles from "../blocks.module.css";
import type { GeneratedBlock } from "../types";

export function CodeBlock({ block }: { block: Extract<GeneratedBlock, { type: "code" }> }) {
  return (
    <div className={styles.block}>
      {block.language && <span className={styles.codeLanguage}>{block.language}</span>}
      <pre className={styles.code}>
        <code>{block.code}</code>
      </pre>
    </div>
  );
}
