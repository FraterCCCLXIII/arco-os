/**
 * defineBlock — the single-source-of-truth contract for generated-UI blocks.
 *
 * Each block type is described once: its wire type, a Zod schema for
 * validating agent-produced JSON, prose the agent prompt can quote, an
 * ontology family for catalog grouping, and the React component that renders
 * it. The registry replaces three previously separate definition sites
 * (TS union, renderer switch, ontology lists) that had to be kept in sync
 * by hand.
 */
import type { ComponentType } from "react";
import { z } from "zod";
import type { GeneratedBlock } from "../types";

/** Narrow the GeneratedBlock union to one member by its `type` tag. */
export type BlockOf<T extends GeneratedBlock["type"]> = Extract<GeneratedBlock, { type: T }>;

/**
 * Ontology family a block belongs to. Card families mirror the design-system
 * catalog; `glass-widgets` / `creator-widgets` are widget tiers; `utility`
 * covers plumbing blocks (text, code, terminal, form) that never appear in
 * visual galleries.
 */
export type BlockFamilyId =
  | "metrics"
  | "commerce"
  | "finance"
  | "productivity"
  | "social"
  | "device"
  | "dashboard"
  | "design-media"
  | "collections"
  | "glass-widgets"
  | "creator-widgets"
  | "utility";

export interface BlockDefinition<T extends GeneratedBlock["type"] = GeneratedBlock["type"]> {
  type: T;
  /** One-line description quoted verbatim in the agent's system prompt. */
  description: string;
  family: BlockFamilyId;
  /**
   * Validates agent JSON for this block. Strict schemas reject malformed
   * payloads field-by-field; blocks not yet migrated use `looseBlockSchema`,
   * which only checks the `{ id, type }` envelope.
   */
  schema: z.ZodType<BlockOf<T>>;
  /** True once the schema validates every field (not just the envelope). */
  strict: boolean;
  Component: ComponentType<{ block: BlockOf<T> }>;
}

/** Identity helper that pins the generic so schema and component agree on T. */
export function defineBlock<T extends GeneratedBlock["type"]>(
  definition: BlockDefinition<T>,
): BlockDefinition<T> {
  return definition;
}

/**
 * Envelope-only schema for blocks awaiting strict migration. It confirms the
 * `{ id, type }` tag and passes everything else through, trusting the TS type
 * at render time — the same guarantee the old switch offered, now explicit.
 */
export function looseBlockSchema<T extends GeneratedBlock["type"]>(type: T): z.ZodType<BlockOf<T>> {
  return z.looseObject({
    id: z.string(),
    type: z.literal(type),
  }) as unknown as z.ZodType<BlockOf<T>>;
}
