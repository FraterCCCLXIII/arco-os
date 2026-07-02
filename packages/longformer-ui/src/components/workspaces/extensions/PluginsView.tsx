import { useMemo, useState } from "react";
import { Icon } from "../../../icons";
import { Badge } from "../../primitives/Badge";
import { Button } from "../../primitives/Button";
import { Card } from "../../primitives/Card";
import { EmptyState } from "../../primitives/EmptyState";
import { Input } from "../../primitives/Input";
import { cx } from "../../../utils/cx";
import { filterByQuery, type ExtensionsWorkspaceData, type Plugin } from "./types";
import styles from "./ExtensionPage.module.css";

export interface PluginsViewProps {
  data: ExtensionsWorkspaceData;
}

/** Plugins catalog — MCP servers, integrations, and third-party connectors. */
export function PluginsView({ data }: PluginsViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [installedOnly, setInstalledOnly] = useState(false);

  const visiblePlugins = useMemo(() => {
    let items = filterByQuery(data.plugins, searchQuery);
    if (installedOnly) items = items.filter((plugin) => plugin.installed);
    return items;
  }, [data.plugins, searchQuery, installedOnly]);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerBody}>
          <h1 className={styles.title}>Plugins</h1>
          <p className={styles.subtitle}>
            Extend your workspace with MCP servers, API integrations, and third-party connectors for external tools.
          </p>
        </div>
        <Button type="button" variant="primary" size="sm">
          <Icon name="plus" size={14} />
          Add plugin
        </Button>
      </header>

      <div className={styles.toolbar}>
        <Input
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Search plugins"
          aria-label="Search plugins"
          startSlot={<Icon name="search" size={14} />}
          wrapperClassName={styles.searchInput}
        />
        <button
          type="button"
          className={cx(styles.filterChip, installedOnly && styles.filterChipActive)}
          onClick={() => setInstalledOnly((prev) => !prev)}
        >
          Installed
        </button>
      </div>

      {visiblePlugins.length === 0 ? (
        <EmptyState
          icon={<Icon name="package" size={22} />}
          title="No plugins found"
          description="Try a different search term or browse the marketplace."
        />
      ) : (
        <div className={styles.cardGrid}>
          {visiblePlugins.map((plugin) => (
            <PluginCard key={plugin.id} plugin={plugin} />
          ))}
        </div>
      )}
    </div>
  );
}

function PluginCard({ plugin }: { plugin: Plugin }) {
  return (
    <Card className={styles.card} padding="lg">
      <div className={styles.cardHead}>
        <span className={styles.cardIcon}>
          <Icon name={plugin.icon} size={18} />
        </span>
        <Badge tone="neutral">{plugin.category}</Badge>
      </div>
      <div className={styles.cardTitle}>{plugin.name}</div>
      <div className={styles.cardMeta}>
        {plugin.author} · v{plugin.version}
      </div>
      <div className={styles.cardDescription}>{plugin.description}</div>
      <div className={styles.cardFooter}>
        {typeof plugin.rating === "number" ? (
          <span className={styles.rating}>
            <Icon name="star" size={13} />
            {plugin.rating.toFixed(1)}
          </span>
        ) : (
          <span className={styles.stat} />
        )}
        {plugin.installed ? (
          <Button type="button" variant="secondary" size="sm" disabled>
            Installed
          </Button>
        ) : (
          <Button type="button" variant="primary" size="sm">
            <Icon name="plus" size={14} />
            Install
          </Button>
        )}
      </div>
    </Card>
  );
}
