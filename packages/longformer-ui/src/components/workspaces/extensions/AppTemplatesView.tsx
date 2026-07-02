import { useMemo, useState } from "react";
import { Icon } from "../../../icons";
import { Badge } from "../../primitives/Badge";
import { Button } from "../../primitives/Button";
import { Card } from "../../primitives/Card";
import { EmptyState } from "../../primitives/EmptyState";
import { Input } from "../../primitives/Input";
import { cx } from "../../../utils/cx";
import { filterByQuery, type ExtensionAppTemplate, type ExtensionsWorkspaceData } from "./types";
import styles from "./ExtensionPage.module.css";

export interface AppTemplatesViewProps {
  data: ExtensionsWorkspaceData;
}

/** App Templates catalog — starter scaffolds for new workspace apps and projects. */
export function AppTemplatesView({ data }: AppTemplatesViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [featuredOnly, setFeaturedOnly] = useState(false);

  const visibleTemplates = useMemo(() => {
    let items = filterByQuery(data.appTemplates, searchQuery);
    if (featuredOnly) items = items.filter((template) => template.featured);
    return items;
  }, [data.appTemplates, searchQuery, featuredOnly]);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerBody}>
          <h1 className={styles.title}>App Templates</h1>
          <p className={styles.subtitle}>
            Starter scaffolds for new workspace apps — from chat dashboards to data pipelines and design systems.
          </p>
        </div>
        <Button type="button" variant="primary" size="sm">
          <Icon name="plus" size={14} />
          Create template
        </Button>
      </header>

      <div className={styles.toolbar}>
        <Input
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Search templates"
          aria-label="Search app templates"
          startSlot={<Icon name="search" size={14} />}
          wrapperClassName={styles.searchInput}
        />
        <button
          type="button"
          className={cx(styles.filterChip, featuredOnly && styles.filterChipActive)}
          onClick={() => setFeaturedOnly((prev) => !prev)}
        >
          Featured
        </button>
      </div>

      {visibleTemplates.length === 0 ? (
        <EmptyState
          icon={<Icon name="app-window" size={22} />}
          title="No templates found"
          description="Try a different search term or browse featured templates."
        />
      ) : (
        <div className={styles.cardGrid}>
          {visibleTemplates.map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>
      )}
    </div>
  );
}

function TemplateCard({ template }: { template: ExtensionAppTemplate }) {
  return (
    <Card className={styles.card} padding="lg">
      <div className={styles.cardHead}>
        <span className={styles.cardIcon}>
          <Icon name={template.icon} size={18} />
        </span>
        {template.featured && <Badge tone="accent">Featured</Badge>}
      </div>
      <div className={styles.cardTitle}>{template.name}</div>
      <div className={styles.cardMeta}>{template.author}</div>
      <div className={styles.cardDescription}>{template.description}</div>
      <div className={styles.stackRow}>
        {template.stack.map((item) => (
          <span key={item} className={styles.tag}>
            {item}
          </span>
        ))}
      </div>
      <div className={styles.cardFooter}>
        <span className={styles.stat}>{template.installs.toLocaleString()} installs</span>
        <Button type="button" variant="primary" size="sm">
          Use template
        </Button>
      </div>
    </Card>
  );
}
