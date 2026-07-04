import type { ReactNode } from "react";
import styles from "./DesignSystemWorkspace.tailwind";

export interface DesignSystemSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function DesignSystemSection({ title, description, children }: DesignSystemSectionProps) {
  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>{title}</h2>
        {description && <p className={styles.sectionDescription}>{description}</p>}
      </div>
      {children}
    </section>
  );
}

export function TokenTable({ rows }: { rows: { name: string; variable: string; meta?: string }[] }) {
  return (
    <div className={styles.tokenTable}>
      {rows.map((row) => (
        <div key={row.variable} className={styles.tokenRow}>
          <span className={styles.tokenName}>{row.name}</span>
          <code className={styles.tokenVariable}>{row.variable}</code>
          {row.meta && <span className={styles.tokenMeta}>{row.meta}</span>}
        </div>
      ))}
    </div>
  );
}

export function SwatchGrid({
  tokens,
}: {
  tokens: { name: string; variable: string; description?: string }[];
}) {
  return (
    <div className={styles.swatchGrid}>
      {tokens.map((token) => (
        <div key={token.variable} className={styles.swatchCard}>
          <div className={styles.swatchPreview} style={{ background: `var(${token.variable})` }} />
          <div className={styles.swatchMeta}>
            <span className={styles.swatchName}>{token.name}</span>
            <code className={styles.tokenVariable}>{token.variable}</code>
            {token.description && <span className={styles.swatchDescription}>{token.description}</span>}
          </div>
        </div>
      ))}
    </div>
  );
}

export function OntologyGrid({
  items,
}: {
  items: { label: string; description: string; meta?: string }[];
}) {
  return (
    <div className={styles.ontologyGrid}>
      {items.map((item) => (
        <div key={item.label} className={styles.ontologyCard}>
          <div className={styles.ontologyLabel}>{item.label}</div>
          <p className={styles.ontologyDescription}>{item.description}</p>
          {item.meta && <div className={styles.ontologyMeta}>{item.meta}</div>}
        </div>
      ))}
    </div>
  );
}
