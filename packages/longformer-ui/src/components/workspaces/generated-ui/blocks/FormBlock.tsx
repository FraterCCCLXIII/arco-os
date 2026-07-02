import styles from "../blocks.module.css";
import type { GeneratedBlock } from "../types";

export function FormBlock({ block }: { block: Extract<GeneratedBlock, { type: "form" }> }) {
  return (
    <div className={styles.block}>
      {block.title && <div className={styles.blockTitle}>{block.title}</div>}
      <div className={styles.form}>
        {block.fields.map((field) => (
          <div key={field.id} className={styles.formRow}>
            <span className={styles.formLabel}>{field.label}</span>
            <span className={styles.formValue}>{field.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
