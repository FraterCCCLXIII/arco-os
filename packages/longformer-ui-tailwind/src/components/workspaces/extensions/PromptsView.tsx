import { useMemo, useState } from "react";
import { Icon } from "../../../icons";
import { Badge } from "../../primitives/Badge";
import { Button } from "../../primitives/Button";
import { Card } from "../../primitives/Card";
import { EmptyState } from "../../primitives/EmptyState";
import { Input } from "../../primitives/Input";
import { cx } from "../../../utils/cx";
import { filterByQuery, type ExtensionsWorkspaceData } from "./types";
import styles from "./ExtensionPage.tailwind";

export interface PromptsViewProps {
  data: ExtensionsWorkspaceData;
}

/** Prompts library — saved system prompts and reusable instruction templates. */
export function PromptsView({ data }: PromptsViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [starredOnly, setStarredOnly] = useState(false);

  const visiblePrompts = useMemo(() => {
    let items = filterByQuery(data.prompts, searchQuery);
    if (starredOnly) items = items.filter((prompt) => prompt.starred);
    return items;
  }, [data.prompts, searchQuery, starredOnly]);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerBody}>
          <h1 className={styles.title}>Prompts</h1>
          <p className={styles.subtitle}>
            Saved system prompts and reusable instruction templates for chat, agents, and automated workflows.
          </p>
        </div>
        <Button type="button" variant="primary" size="sm">
          <Icon name="plus" size={14} />
          New prompt
        </Button>
      </header>

      <div className={styles.toolbar}>
        <Input
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Search prompts"
          aria-label="Search prompts"
          startSlot={<Icon name="search" size={14} />}
          wrapperClassName={styles.searchInput}
        />
        <button
          type="button"
          className={cx(styles.filterChip, starredOnly && styles.filterChipActive)}
          onClick={() => setStarredOnly((prev) => !prev)}
        >
          <Icon name="star" size={13} />
          Starred
        </button>
      </div>

      {visiblePrompts.length === 0 ? (
        <EmptyState
          icon={<Icon name="chat" size={22} />}
          title="No prompts found"
          description="Create a prompt template or adjust your filters."
        />
      ) : (
        <Card padding="none" className={styles.listCard}>
          {visiblePrompts.map((prompt) => (
            <div key={prompt.id} className={styles.promptRow}>
              <div className={styles.promptHead}>
                <div>
                  <h3 className={styles.promptTitle}>
                    {prompt.starred && (
                      <span className={styles.starred} aria-label="Starred">
                        <Icon name="star" size={14} />
                      </span>
                    )}{" "}
                    {prompt.title}
                  </h3>
                  <div className={styles.promptMeta}>
                    <Badge tone="neutral">{prompt.category}</Badge>
                    <span>{prompt.usageCount} uses</span>
                    <span>Updated {prompt.updatedAt}</span>
                  </div>
                </div>
                <Button type="button" variant="secondary" size="sm">
                  Use prompt
                </Button>
              </div>
              <p className={styles.promptBody}>{prompt.body}</p>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}
