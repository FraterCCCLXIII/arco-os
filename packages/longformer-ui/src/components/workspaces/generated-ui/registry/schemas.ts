/**
 * Strict Zod schemas for the pilot set of generated-UI blocks — the
 * most-used, simplest-shaped block types. Each schema is annotated with
 * `z.ZodType<BlockOf<...>>` so the compiler proves it stays in lockstep with
 * the `GeneratedBlock` union in ../types; drift in either direction is a
 * type error, not a runtime surprise.
 *
 * Blocks not covered here fall back to `looseBlockSchema` in the registry
 * and migrate to strict schemas incrementally.
 */
import { z } from "zod";
import { ICON_NAMES, type IconName } from "../../../../icons";
import type { MediaCardTone } from "../../../primitives/MediaCard";
import type { StatCardTone, StatCardVisualization } from "../../../primitives/StatCard";
import type { SelectionTileSize } from "../../../primitives/SelectionTile";
import type { ScheduleSlotTone } from "../../../primitives/ScheduleSlotCard";
import type { BlockOf } from "./defineBlock";

// ---------------------------------------------------------------------------
// Shared scalar schemas
//
// Icon names are validated against the runtime ICON_NAMES list so an agent
// can't reference a glyph the kit doesn't ship. Tone enums are annotated with
// the primitive's exported type, keeping schema and component in sync.
// ---------------------------------------------------------------------------

const iconNameSet = new Set<string>(ICON_NAMES);

export const iconNameSchema: z.ZodType<IconName> = z
  .string()
  .refine((value): value is IconName => iconNameSet.has(value), {
    message: "Unknown icon name",
  }) as unknown as z.ZodType<IconName>;

const statCardToneSchema: z.ZodType<StatCardTone> = z.enum([
  "accent",
  "success",
  "warning",
  "danger",
  "neutral",
]);

const statCardVisualizationSchema: z.ZodType<StatCardVisualization> = z.discriminatedUnion("type", [
  z.object({ type: z.literal("ring"), percent: z.number() }),
  z.object({ type: z.literal("bars"), values: z.array(z.number()) }),
  z.object({ type: z.literal("dots"), total: z.number(), filled: z.number() }),
]);

const mediaCardToneSchema: z.ZodType<MediaCardTone> = z.enum(["accent", "success", "warning"]);

/**
 * URLs in generated blocks must be https — agents are untrusted, so this
 * rules out `javascript:`, `data:`, and mixed-content http at the boundary.
 */
export const httpsUrlSchema = z
  .string()
  .refine((value) => /^https:\/\/\S+$/i.test(value), { message: "URL must be https" });

const selectionTileSizeSchema: z.ZodType<SelectionTileSize> = z.enum(["sm", "md", "lg", "wide", "tall"]);

const scheduleSlotToneSchema: z.ZodType<ScheduleSlotTone> = z.enum(["success", "warning", "accent"]);

// ---------------------------------------------------------------------------
// Pilot block schemas
//
// Every schema starts from the same `{ id, type }` envelope the renderer
// keys on, then validates the block's payload field-by-field.
// ---------------------------------------------------------------------------

export const textBlockSchema: z.ZodType<BlockOf<"text">> = z.object({
  id: z.string(),
  type: z.literal("text"),
  text: z.string(),
  tone: z.enum(["default", "muted", "heading"]).optional(),
});

export const cardGridBlockSchema: z.ZodType<BlockOf<"cardGrid">> = z.object({
  id: z.string(),
  type: z.literal("cardGrid"),
  title: z.string().optional(),
  cards: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      description: z.string().optional(),
      badge: z.string().optional(),
      icon: iconNameSchema.optional(),
    }),
  ),
});

export const mediaCardsBlockSchema: z.ZodType<BlockOf<"mediaCards">> = z.object({
  id: z.string(),
  type: z.literal("mediaCards"),
  title: z.string().optional(),
  cards: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      description: z.string().optional(),
      image: httpsUrlSchema.optional(),
      imageAlt: z.string().optional(),
      tone: mediaCardToneSchema.optional(),
      badges: z.array(z.object({ icon: iconNameSchema.optional(), label: z.string() })).optional(),
      actionLabel: z.string().optional(),
      href: httpsUrlSchema.optional(),
    }),
  ),
});

export const listingCardsBlockSchema: z.ZodType<BlockOf<"listingCards">> = z.object({
  id: z.string(),
  type: z.literal("listingCards"),
  title: z.string().optional(),
  cards: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      subtitle: z.string().optional(),
      tags: z.array(z.string()).optional(),
      price: z.string().optional(),
      priceMeta: z.string().optional(),
      actionLabel: z.string().optional(),
      icon: iconNameSchema.optional(),
      avatarName: z.string().optional(),
      saved: z.boolean().optional(),
    }),
  ),
});

export const statCardsBlockSchema: z.ZodType<BlockOf<"statCards">> = z.object({
  id: z.string(),
  type: z.literal("statCards"),
  title: z.string().optional(),
  cards: z.array(
    z.object({
      id: z.string(),
      label: z.string(),
      value: z.string(),
      caption: z.string().optional(),
      icon: iconNameSchema.optional(),
      tone: statCardToneSchema.optional(),
      visualization: statCardVisualizationSchema.optional(),
    }),
  ),
});

export const selectionTilesBlockSchema: z.ZodType<BlockOf<"selectionTiles">> = z.object({
  id: z.string(),
  type: z.literal("selectionTiles"),
  title: z.string().optional(),
  tiles: z.array(
    z.object({
      id: z.string(),
      label: z.string(),
      selected: z.boolean().optional(),
      size: selectionTileSizeSchema.optional(),
    }),
  ),
});

export const timelineStepsBlockSchema: z.ZodType<BlockOf<"timelineSteps">> = z.object({
  id: z.string(),
  type: z.literal("timelineSteps"),
  title: z.string().optional(),
  steps: z.array(
    z.object({
      id: z.string(),
      label: z.string(),
      completed: z.boolean().optional(),
      showConnector: z.boolean().optional(),
    }),
  ),
});

export const insightCardsBlockSchema: z.ZodType<BlockOf<"insightCards">> = z.object({
  id: z.string(),
  type: z.literal("insightCards"),
  title: z.string().optional(),
  cards: z.array(
    z.object({
      id: z.string(),
      label: z.string().optional(),
      title: z.string(),
      description: z.string().optional(),
      href: httpsUrlSchema.optional(),
    }),
  ),
});

export const eventCardsBlockSchema: z.ZodType<BlockOf<"eventCards">> = z.object({
  id: z.string(),
  type: z.literal("eventCards"),
  title: z.string().optional(),
  cards: z.array(
    z.object({
      id: z.string(),
      label: z.string().optional(),
      title: z.string(),
      startTime: z.string(),
      endTime: z.string(),
      timeLeft: z.object({ icon: iconNameSchema.optional(), label: z.string() }).optional(),
    }),
  ),
});

export const scheduleSlotsBlockSchema: z.ZodType<BlockOf<"scheduleSlots">> = z.object({
  id: z.string(),
  type: z.literal("scheduleSlots"),
  title: z.string().optional(),
  slots: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      mode: z.string().optional(),
      timeRange: z.string(),
      tone: scheduleSlotToneSchema.optional(),
    }),
  ),
});

export const taskChecklistCardsBlockSchema: z.ZodType<BlockOf<"taskChecklistCards">> = z.object({
  id: z.string(),
  type: z.literal("taskChecklistCards"),
  title: z.string().optional(),
  cards: z.array(
    z.object({
      id: z.string(),
      tabs: z.array(z.object({ id: z.string(), label: z.string() })).optional(),
      activeTab: z.string().optional(),
      title: z.string(),
      items: z.array(z.object({ label: z.string(), completed: z.boolean().optional() })),
      progress: z.number().optional(),
      progressLabel: z.string().optional(),
      memberNames: z.array(z.string()).optional(),
      actionLabel: z.string().optional(),
    }),
  ),
});

export const formBlockSchema: z.ZodType<BlockOf<"form">> = z.object({
  id: z.string(),
  type: z.literal("form"),
  title: z.string().optional(),
  fields: z.array(z.object({ id: z.string(), label: z.string(), value: z.string() })),
});

export const codeBlockSchema: z.ZodType<BlockOf<"code">> = z.object({
  id: z.string(),
  type: z.literal("code"),
  language: z.string().optional(),
  code: z.string(),
});

export const terminalBlockSchema: z.ZodType<BlockOf<"terminal">> = z.object({
  id: z.string(),
  type: z.literal("terminal"),
  lines: z.array(z.string()),
});
