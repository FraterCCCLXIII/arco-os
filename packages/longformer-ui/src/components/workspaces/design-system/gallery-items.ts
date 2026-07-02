import type { GeneratedBlock, GeneratedSurfaceSchema } from "../generated-ui/types";
import { CARD_FAMILIES, cardFamilyForBlockType } from "./ontology";
import { CARD_FAMILY_SAMPLES, WIDGET_SAMPLES } from "./samples";

const GALLERY_SKIP_BLOCK_TYPES = new Set<GeneratedBlock["type"]>(["text", "code", "terminal", "form"]);

export type GalleryItemCategory = "component" | "card" | "widget" | "collection" | "generated";

export interface DesignSystemGalleryItem {
  id: string;
  label: string;
  category: GalleryItemCategory;
  familyLabel?: string;
  blockType?: GeneratedBlock["type"];
  block?: GeneratedBlock;
}

/** Split multi-card/widget blocks into individual masonry tiles. */
export function splitBlockForGallery(block: GeneratedBlock): GeneratedBlock[] {
  if ("cards" in block && Array.isArray(block.cards) && block.cards.length > 1) {
    return block.cards.map((card, index) => ({
      ...block,
      id: `${block.id}__${card.id}`,
      title: index === 0 ? block.title : undefined,
      cards: [card],
    })) as GeneratedBlock[];
  }

  if ("widgets" in block && Array.isArray(block.widgets) && block.widgets.length > 1) {
    return block.widgets.map((widget, index) => ({
      ...block,
      id: `${block.id}__${widget.id}`,
      title: index === 0 ? block.title : undefined,
      widgets: [widget],
    })) as GeneratedBlock[];
  }

  return [block];
}

function galleryCategoryForBlock(block: GeneratedBlock): GalleryItemCategory {
  if (block.type === "glassWidgets" || block.type === "creatorWidgets") return "widget";
  if (block.type === "cardCollection") return "collection";
  return "card";
}

function labelForBlock(block: GeneratedBlock): string {
  if ("title" in block && block.title) return block.title;
  if ("cards" in block && block.cards?.[0] && "title" in block.cards[0] && block.cards[0].title) {
    return String(block.cards[0].title);
  }
  if ("widgets" in block && block.widgets?.[0] && "variant" in block.widgets[0]) {
    return String(block.widgets[0].variant);
  }
  return block.type;
}

function blockToGalleryItem(block: GeneratedBlock): DesignSystemGalleryItem {
  const family = cardFamilyForBlockType(block.type);
  return {
    id: block.id,
    label: labelForBlock(block),
    category: galleryCategoryForBlock(block),
    familyLabel: family?.label,
    blockType: block.type,
    block,
  };
}

function collectSampleBlocks(): GeneratedBlock[] {
  return [...Object.values(CARD_FAMILY_SAMPLES).flat(), ...WIDGET_SAMPLES];
}

function collectGeneratedBlocks(schema?: GeneratedSurfaceSchema): GeneratedBlock[] {
  if (!schema) return [];
  return schema.blocks.filter((block) => !GALLERY_SKIP_BLOCK_TYPES.has(block.type));
}

/** All visual blocks for the masonry gallery, de-duplicated by id. */
export function buildDesignSystemGalleryItems(generatedSchema?: GeneratedSurfaceSchema): DesignSystemGalleryItem[] {
  const seen = new Set<string>();
  const items: DesignSystemGalleryItem[] = [];

  for (const block of [...collectSampleBlocks(), ...collectGeneratedBlocks(generatedSchema)]) {
    for (const tile of splitBlockForGallery(block)) {
      if (seen.has(tile.id)) continue;
      seen.add(tile.id);
      items.push(blockToGalleryItem(tile));
    }
  }

  return items;
}

export const GALLERY_FILTER_OPTIONS: { id: string; label: string }[] = [
  { id: "all", label: "All" },
  { id: "component", label: "Components" },
  { id: "widget", label: "Widgets" },
  { id: "collection", label: "Collections" },
  ...CARD_FAMILIES.map((family) => ({ id: family.id, label: family.label })),
];

export function filterGalleryItems(
  items: DesignSystemGalleryItem[],
  filterId: string,
): DesignSystemGalleryItem[] {
  if (filterId === "all") return items;
  if (filterId === "component") return items.filter((item) => item.category === "component");
  if (filterId === "widget") return items.filter((item) => item.category === "widget");
  if (filterId === "collection") return items.filter((item) => item.category === "collection");

  const family = CARD_FAMILIES.find((entry) => entry.id === filterId);
  if (!family) return items;

  return items.filter(
    (item) => item.blockType && family.blockTypes.includes(item.blockType),
  );
}
