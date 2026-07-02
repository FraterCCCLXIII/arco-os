import { Icon } from "../../../icons";
import { Badge } from "../../primitives/Badge";
import { Button } from "../../primitives/Button";
import { Card } from "../../primitives/Card";
import type { IdentityDocument } from "./types";
import styles from "./DocumentView.module.css";

export interface DocumentViewProps {
  document: IdentityDocument;
  variant: "soul" | "ethics";
}

/** Identity document viewer — Soul.md and Ethics.md structured content. */
export function DocumentView({ document, variant }: DocumentViewProps) {
  const icon = variant === "soul" ? "heart" : "lock";
  const accentClass = variant === "soul" ? styles.headerSoul : styles.headerEthics;

  return (
    <div className={styles.view}>
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <span className={accentClass}>
            <Icon name={icon} size={18} />
          </span>
          <div>
            <h1 className={styles.title}>{document.title}</h1>
            <p className={styles.filename}>{document.filename}</p>
          </div>
          <div className={styles.headerActions}>
            <Badge tone="neutral">v{document.version}</Badge>
            <Button type="button" variant="secondary" size="sm">
              <Icon name="edit" size={14} />
              Edit
            </Button>
          </div>
        </div>
        <p className={styles.meta}>Last edited {document.lastEdited}</p>
      </header>

      <div className={styles.layout}>
        <nav className={styles.toc} aria-label="Document sections">
          <div className={styles.tocLabel}>Contents</div>
          {document.sections.map((section) => (
            <a key={section.id} href={`#${section.id}`} className={styles.tocItem}>
              {section.heading}
            </a>
          ))}
        </nav>

        <div className={styles.content}>
          {document.sections.map((section) => (
            <Card key={section.id} padding="lg" className={styles.sectionCard} id={section.id}>
              <h2 className={styles.sectionHeading}>{section.heading}</h2>
              <div className={styles.sectionBody}>
                {section.content.split("\n\n").map((paragraph, index) => (
                  <p key={index} className={styles.paragraph}>
                    {paragraph}
                  </p>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
