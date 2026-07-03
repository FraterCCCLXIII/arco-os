import { useMemo } from "react";
import { Icon } from "../../../icons";
import {
  Badge,
  Chip,
  IconButton,
  Input,
  Kbd,
  ScrollArea,
  Tabs,
  Textarea,
} from "../../primitives";
import { SidebarPane } from "../../shell/NavSidebar/SidebarPane";
import { GeneratedSurface } from "../generated-ui/GeneratedSurface";
import {
  buildGeneratorCatalog,
  CATALOG_TIER_LABELS,
  filterCatalogItems,
} from "./catalog";
import type { CatalogItem } from "./types";
import { ComponentPreview } from "./ComponentPreview";
import { ComposedUiSurface } from "./ComposedUiSurface";
import type { GeneratorPreviewTab, GeneratorResult, GeneratorWorkspaceData } from "./types";
import styles from "./GeneratorWorkspace.module.css";

export function GeneratorCatalogSidebar({
  items,
  searchQuery,
  onSearchChange,
  activeId,
  onSelect,
}: {
  items: CatalogItem[];
  searchQuery: string;
  onSearchChange: (value: string) => void;
  activeId: string | null;
  onSelect: (id: string) => void;
}) {
  const filtered = useMemo(() => filterCatalogItems(items, searchQuery), [items, searchQuery]);

  const grouped = useMemo(() => {
    const map = new Map<string, CatalogItem[]>();
    for (const item of filtered) {
      const key = item.tier;
      const bucket = map.get(key) ?? [];
      bucket.push(item);
      map.set(key, bucket);
    }
    return map;
  }, [filtered]);

  return (
    <SidebarPane handleLabel="Resize generator catalog" defaultWidth={260} minWidth={220} maxWidth={320}>
      <div className={styles.catalogSidebar}>
        <div className={styles.catalogHeader}>
          <div className={styles.catalogTitle}>Components</div>
          <div className={styles.catalogSubtitle}>{items.length} atoms, cards, and blocks</div>
          <Input
            placeholder="Search catalog"
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            startSlot={<Icon name="search" size={14} />}
            wrapperClassName={styles.catalogSearch}
          />
        </div>

        <ScrollArea className={styles.catalogScroll}>
          <div className={styles.catalogSections}>
            {Array.from(grouped.entries()).map(([tier, sectionItems]) => (
              <section key={tier} className={styles.catalogSection}>
                <div className={styles.catalogSectionTitle}>{CATALOG_TIER_LABELS[tier as keyof typeof CATALOG_TIER_LABELS]}</div>
                <div className={styles.catalogList}>
                  {sectionItems.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className={styles.catalogItem}
                      data-active={activeId === item.id || undefined}
                      onClick={() => onSelect(item.id)}
                    >
                      <div className={styles.catalogPreviewViewport} aria-hidden="true">
                        <div className={styles.catalogPreviewScale}>
                          <ComponentPreview item={item} />
                        </div>
                      </div>
                      <div className={styles.catalogItemBody}>
                        <span className={styles.catalogItemLabel}>{item.label}</span>
                        <div className={styles.catalogItemMeta}>
                          <Chip>{item.tier}</Chip>
                          {item.familyLabel ? <span className={styles.catalogFamily}>{item.familyLabel}</span> : null}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </ScrollArea>
      </div>
    </SidebarPane>
  );
}

export function GeneratorPromptPanel({
  prompt,
  onPromptChange,
  onGenerate,
  generating,
  examples,
  onExampleSelect,
}: {
  prompt: string;
  onPromptChange: (value: string) => void;
  onGenerate: () => void;
  generating: boolean;
  examples: string[];
  onExampleSelect: (value: string) => void;
}) {
  return (
    <div className={styles.promptPanel}>
      <div className={styles.promptIntro}>
        <h2 className={styles.promptTitle}>Describe the interface you want</h2>
        <p className={styles.promptDescription}>
          Write a prompt and generate a real, rendered UI composed from Longformer atoms and blocks.
        </p>
      </div>

      <div className={styles.promptComposer}>
        <div className={styles.promptField}>
          <Textarea
            value={prompt}
            onChange={(event) => onPromptChange(event.target.value)}
            placeholder="e.g. A newsletter signup card with a heading, email field, and subscribe button"
            aria-label="UI description prompt"
            rows={6}
            autoResize={false}
            className={styles.promptTextarea}
            onKeyDown={(event) => {
              if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
                event.preventDefault();
                onGenerate();
              }
            }}
          />
          <IconButton
            icon="send"
            label="Generate UI"
            variant="primary"
            className={styles.promptSubmit}
            onClick={onGenerate}
            disabled={generating || prompt.trim().length === 0}
          />
        </div>
        <p className={styles.promptHint}>
          Press <Kbd>⌘/Ctrl</Kbd> <Kbd>Enter</Kbd> to generate
        </p>
      </div>

      <div className={styles.examples}>
        <span className={styles.examplesLabel}>Try an example</span>
        <div className={styles.exampleList}>
          {examples.map((example) => (
            <button
              key={example}
              type="button"
              className={styles.exampleButton}
              onClick={() => onExampleSelect(example)}
              disabled={generating}
            >
              {example}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function GeneratorPreviewPanel({
  result,
  activeTab,
  onTabChange,
}: {
  result: GeneratorResult | null;
  activeTab: GeneratorPreviewTab;
  onTabChange: (tab: GeneratorPreviewTab) => void;
}) {
  const schemaJson = useMemo(() => {
    if (!result) return "";
    if (result.kind === "catalog") {
      return JSON.stringify(result.item, null, 2);
    }
    return JSON.stringify(result.schema, null, 2);
  }, [result]);

  return (
    <div className={styles.previewPanel}>
      <div className={styles.previewToolbar}>
        <div className={styles.previewTitleRow}>
          <span className={styles.previewTitle}>{result?.title ?? "Preview"}</span>
          <Badge tone="neutral">Local</Badge>
        </div>
        <Tabs
          variant="pill"
          items={[
            { id: "preview", label: "Preview" },
            { id: "schema", label: "Schema" },
          ]}
          value={activeTab}
          onChange={(id) => onTabChange(id as GeneratorPreviewTab)}
          aria-label="Generator output tabs"
        />
      </div>

      <ScrollArea className={styles.previewScroll}>
        {activeTab === "preview" ? (
          <div className={styles.previewContent}>
            {!result ? (
              <div className={styles.previewEmpty}>
                <Icon name="sparkles" size={28} />
                <p>Generate a UI or pick a component from the catalog to preview it here.</p>
              </div>
            ) : result.kind === "surface" ? (
              <GeneratedSurface schema={result.schema} />
            ) : result.kind === "composed" ? (
              <ComposedUiSurface schema={result.schema} />
            ) : (
              <div className={styles.catalogDetailPreview}>
                <ComponentPreview item={result.item} />
              </div>
            )}
          </div>
        ) : (
          <pre className={styles.schemaBlock}>
            <code>{schemaJson || "// Schema will appear after you generate or select a component."}</code>
          </pre>
        )}
      </ScrollArea>
    </div>
  );
}

export function useGeneratorCatalog() {
  return useMemo(() => buildGeneratorCatalog(), []);
}

export type { GeneratorWorkspaceData };
