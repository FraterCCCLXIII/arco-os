/**
 * Validation boundary for agent-produced surface JSON.
 *
 * Agents emit `GeneratedSurfaceSchema` as plain JSON over the wire; nothing
 * guarantees it is well-formed. `parseGeneratedSurface` checks the envelope
 * and every block against its registry schema, keeps the blocks that pass,
 * and reports the ones that don't — so one malformed block degrades to a
 * skipped card instead of a crashed surface (D10: validate at the boundary,
 * never trust generation).
 */
import { z } from "zod";
import type { GeneratedBlock, GeneratedSurfaceSchema } from "../types";
import { blockDefinition } from "./registry";

/** One rejected block, with enough context to log or show a fallback chip. */
export interface GeneratedBlockIssue {
  /** Position in the incoming `blocks` array. */
  index: number;
  /** The wire `type` string, if the block carried one. */
  type?: string;
  /** Human-readable validation failures. */
  messages: string[];
}

export interface GeneratedSurfaceParseResult {
  /** The surface containing only blocks that validated; null if the envelope itself was malformed. */
  surface: GeneratedSurfaceSchema | null;
  /** Blocks (or the envelope) that failed validation. Empty means a fully clean parse. */
  issues: GeneratedBlockIssue[];
}

/** Envelope check: `{ id, blocks[] }` with block contents validated separately. */
const surfaceEnvelopeSchema = z.object({
  id: z.string(),
  blocks: z.array(z.unknown()),
});

function formatZodError(error: z.ZodError): string[] {
  return error.issues.map((issue) => {
    const path = issue.path.length ? issue.path.join(".") : "(root)";
    return `${path}: ${issue.message}`;
  });
}

/**
 * Validate untrusted surface JSON. Invalid blocks are dropped and reported;
 * valid blocks render. A malformed envelope returns `surface: null`.
 */
export function parseGeneratedSurface(input: unknown): GeneratedSurfaceParseResult {
  const envelope = surfaceEnvelopeSchema.safeParse(input);
  if (!envelope.success) {
    return { surface: null, issues: [{ index: -1, messages: formatZodError(envelope.error) }] };
  }

  const blocks: GeneratedBlock[] = [];
  const issues: GeneratedBlockIssue[] = [];

  envelope.data.blocks.forEach((raw, index) => {
    // The `type` tag routes to the right schema; anything without a known
    // tag can't be validated or rendered, so it is reported and skipped.
    const typeTag =
      typeof raw === "object" && raw !== null && "type" in raw && typeof raw.type === "string"
        ? raw.type
        : undefined;
    const definition = typeTag ? blockDefinition(typeTag) : undefined;

    if (!definition) {
      issues.push({
        index,
        type: typeTag,
        messages: [typeTag ? `Unknown block type "${typeTag}"` : "Block is missing a string \"type\" tag"],
      });
      return;
    }

    const parsed = definition.schema.safeParse(raw);
    if (parsed.success) {
      blocks.push(parsed.data);
    } else {
      issues.push({ index, type: typeTag, messages: formatZodError(parsed.error) });
    }
  });

  return { surface: { id: envelope.data.id, blocks }, issues };
}
