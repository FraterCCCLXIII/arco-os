import { useMemo, useState } from "react";
import { Icon } from "../../../icons";
import {
  Avatar,
  Badge,
  Button,
  Card,
  Chip,
  CountBadge,
  EmptyState,
  IconButton,
  Input,
  ListItem,
  Tabs,
} from "../../primitives";
import { GeneratedSurface } from "../generated-ui/GeneratedSurface";
import type { GeneratedSurfaceSchema } from "../generated-ui/types";
import { DesignSystemSection } from "./DesignSystemSection";
import {
  buildDesignSystemGalleryItems,
  filterGalleryItems,
  GALLERY_FILTER_OPTIONS,
  type DesignSystemGalleryItem,
} from "./gallery-items";
import styles from "./DesignSystemWorkspace.module.css";

const COMPONENT_GALLERY_ITEMS: DesignSystemGalleryItem[] = [
  { id: "gallery-btn-primary", label: "Button · primary", category: "component", blockType: undefined },
  { id: "gallery-btn-secondary", label: "Button · secondary", category: "component", blockType: undefined },
  { id: "gallery-btn-ghost", label: "Button · ghost", category: "component", blockType: undefined },
  { id: "gallery-icon-btn", label: "Icon button", category: "component", blockType: undefined },
  { id: "gallery-input", label: "Input", category: "component", blockType: undefined },
  { id: "gallery-chips", label: "Chips", category: "component", blockType: undefined },
  { id: "gallery-badges", label: "Badges", category: "component", blockType: undefined },
  { id: "gallery-avatar-list", label: "Avatar & list item", category: "component", blockType: undefined },
  { id: "gallery-tabs", label: "Tabs", category: "component", blockType: undefined },
  { id: "gallery-empty", label: "Empty state", category: "component", blockType: undefined },
];

function ComponentGalleryPreview({ itemId }: { itemId: string }) {
  switch (itemId) {
    case "gallery-btn-primary":
      return <Button variant="primary">Primary action</Button>;
    case "gallery-btn-secondary":
      return <Button variant="secondary">Secondary</Button>;
    case "gallery-btn-ghost":
      return <Button variant="ghost">Ghost</Button>;
    case "gallery-icon-btn":
      return (
        <div className={styles.galleryComponentRow}>
          <IconButton icon="plus" label="Add" />
          <IconButton icon="settings" label="Settings" variant="primary" />
        </div>
      );
    case "gallery-input":
      return <Input placeholder="Search components" startSlot={<Icon name="search" size={14} />} />;
    case "gallery-chips":
      return (
        <div className={styles.galleryComponentRow}>
          <Chip active>Active</Chip>
          <Chip>Default</Chip>
        </div>
      );
    case "gallery-badges":
      return (
        <div className={styles.galleryComponentRow}>
          <Badge tone="accent">Accent</Badge>
          <Badge tone="success" dot>
            Online
          </Badge>
          <CountBadge count={8} />
        </div>
      );
    case "gallery-avatar-list":
      return (
        <Card padding="md" className={styles.galleryComponentCard}>
          <div className={styles.galleryComponentRow}>
            <Avatar name="Paul Bloch" status="online" />
            <ListItem leading={<Icon name="folder" size={15} />} label="List item" description="Supporting text" />
          </div>
        </Card>
      );
    case "gallery-tabs":
      return (
        <Tabs
          items={[
            { id: "one", label: "First" },
            { id: "two", label: "Second" },
            { id: "three", label: "Third" },
          ]}
          value="one"
          onChange={() => undefined}
        />
      );
    case "gallery-empty":
      return (
        <EmptyState
          icon={<Icon name="sparkles" size={20} />}
          title="Nothing here"
          description="Empty states anchor list and detail panes."
        />
      );
    default:
      return null;
  }
}

function MasonryTile({ item }: { item: DesignSystemGalleryItem }) {
  return (
    <article className={styles.masonryItem}>
      <header className={styles.masonryItemHeader}>
        <span className={styles.masonryItemLabel}>{item.label}</span>
        <div className={styles.masonryItemMeta}>
          {item.familyLabel && <Chip>{item.familyLabel}</Chip>}
          {item.blockType && <code className={styles.masonryItemType}>{item.blockType}</code>}
          {item.category === "component" && <Chip active>Component</Chip>}
        </div>
      </header>
      <div className={styles.masonryItemBody}>
        {item.block ? (
          <GeneratedSurface schema={{ id: `gallery-${item.id}`, blocks: [item.block] }} />
        ) : (
          <ComponentGalleryPreview itemId={item.id} />
        )}
      </div>
    </article>
  );
}

export function MasonryGalleryPanel({ generatedSchema }: { generatedSchema?: GeneratedSurfaceSchema }) {
  const [filterId, setFilterId] = useState("all");

  const allItems = useMemo(
    () => [...COMPONENT_GALLERY_ITEMS, ...buildDesignSystemGalleryItems(generatedSchema)],
    [generatedSchema],
  );

  const filteredItems = useMemo(
    () => filterGalleryItems(allItems, filterId),
    [allItems, filterId],
  );

  return (
    <DesignSystemSection
      title="Gallery"
      description={`Masonry view of ${allItems.length} components, cards, widgets, and generated blocks.`}
    >
      <div className={styles.galleryToolbar}>
        <div className={styles.galleryFilters}>
          {GALLERY_FILTER_OPTIONS.map((option) => (
            <Chip key={option.id} active={filterId === option.id} onClick={() => setFilterId(option.id)}>
              {option.label}
            </Chip>
          ))}
        </div>
        <span className={styles.galleryCount}>
          {filteredItems.length} item{filteredItems.length === 1 ? "" : "s"}
        </span>
      </div>

      {filteredItems.length === 0 ? (
        <EmptyState
          icon={<Icon name="grid" size={22} />}
          title="No items in this category"
          description="Try another filter to browse the design system catalog."
        />
      ) : (
        <div className={styles.masonry}>
          {filteredItems.map((item) => (
            <MasonryTile key={item.id} item={item} />
          ))}
        </div>
      )}
    </DesignSystemSection>
  );
}
