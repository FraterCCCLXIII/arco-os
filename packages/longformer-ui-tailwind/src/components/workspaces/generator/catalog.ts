import {
  buildDesignSystemGalleryItems,
  type DesignSystemGalleryItem,
} from "../design-system/gallery-items";
import type { CatalogItem, CatalogTier } from "./types";

const ATOM_GALLERY_ITEMS: CatalogItem[] = [
  { id: "gallery-btn-primary", label: "Button · primary", tier: "atom", componentPreviewId: "gallery-btn-primary" },
  { id: "gallery-btn-secondary", label: "Button · secondary", tier: "atom", componentPreviewId: "gallery-btn-secondary" },
  { id: "gallery-btn-ghost", label: "Button · ghost", tier: "atom", componentPreviewId: "gallery-btn-ghost" },
  { id: "gallery-btn-danger", label: "Button · danger", tier: "atom", componentPreviewId: "gallery-btn-danger" },
  { id: "gallery-icon-btn", label: "Icon button", tier: "atom", componentPreviewId: "gallery-icon-btn" },
  { id: "gallery-input", label: "Input", tier: "atom", componentPreviewId: "gallery-input" },
  { id: "gallery-textarea", label: "Textarea", tier: "atom", componentPreviewId: "gallery-textarea" },
  { id: "gallery-label", label: "Label", tier: "atom", componentPreviewId: "gallery-label" },
  { id: "gallery-checkbox", label: "Checkbox", tier: "atom", componentPreviewId: "gallery-checkbox" },
  { id: "gallery-switch", label: "Switch", tier: "atom", componentPreviewId: "gallery-switch" },
  { id: "gallery-chips", label: "Chips", tier: "atom", componentPreviewId: "gallery-chips" },
  { id: "gallery-badges", label: "Badges", tier: "atom", componentPreviewId: "gallery-badges" },
  { id: "gallery-avatar-list", label: "Avatar & list item", tier: "atom", componentPreviewId: "gallery-avatar-list" },
  { id: "gallery-tabs", label: "Tabs", tier: "atom", componentPreviewId: "gallery-tabs" },
  { id: "gallery-card", label: "Card", tier: "atom", componentPreviewId: "gallery-card" },
  { id: "gallery-empty", label: "Empty state", tier: "atom", componentPreviewId: "gallery-empty" },
  { id: "gallery-kbd", label: "Kbd", tier: "atom", componentPreviewId: "gallery-kbd" },
];

function tierForGalleryItem(item: DesignSystemGalleryItem): CatalogTier {
  if (item.category === "component") return "atom";
  if (item.category === "widget") return "widget";
  if (item.category === "collection") return "collection";
  return "card";
}

function galleryItemToCatalog(item: DesignSystemGalleryItem): CatalogItem {
  return {
    id: item.id,
    label: item.label,
    tier: tierForGalleryItem(item),
    familyLabel: item.familyLabel,
    blockType: item.blockType,
    block: item.block,
    componentPreviewId: item.category === "component" ? item.id : undefined,
  };
}

/** Full scrollable catalog of atoms, cards, blocks, and widgets. */
export function buildGeneratorCatalog(): CatalogItem[] {
  const seen = new Set<string>();
  const items: CatalogItem[] = [];

  for (const item of [...ATOM_GALLERY_ITEMS, ...buildDesignSystemGalleryItems().map(galleryItemToCatalog)]) {
    if (seen.has(item.id)) continue;
    seen.add(item.id);
    items.push(item);
  }

  return items.sort((left, right) => {
    const tierOrder: Record<CatalogTier, number> = {
      atom: 0,
      card: 1,
      block: 2,
      widget: 3,
      collection: 4,
    };
    const tierDiff = tierOrder[left.tier] - tierOrder[right.tier];
    if (tierDiff !== 0) return tierDiff;
    return left.label.localeCompare(right.label);
  });
}

export const CATALOG_TIER_LABELS: Record<CatalogTier, string> = {
  atom: "Atoms",
  card: "Cards",
  block: "Blocks",
  widget: "Widgets",
  collection: "Collections",
};

export function filterCatalogItems(items: CatalogItem[], query: string): CatalogItem[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return items;

  return items.filter((item) => {
    const haystack = [item.label, item.tier, item.familyLabel, item.blockType]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return haystack.includes(normalized);
  });
}

export function catalogItemById(items: CatalogItem[], id: string): CatalogItem | undefined {
  return items.find((item) => item.id === id);
}
