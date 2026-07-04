/**
 * Surface generator — the demo's minimal agent loop.
 *
 * Given a chat prompt, produce a validated `GeneratedSurfaceSchema` plus a
 * conversational summary. Two engines, one contract:
 *
 * 1. **LLM engine** — used when `VITE_LLM_API_KEY` is set. Calls any
 *    OpenAI-compatible chat-completions endpoint with a system prompt built
 *    from the block registry (`describeBlockCatalog`), asks for JSON only.
 * 2. **Local engine** — deterministic keyword composer, always available, so
 *    the prototype works offline with zero configuration.
 *
 * Either way the raw JSON goes through `parseGeneratedSurface` before it can
 * reach a component: the registry's Zod schemas are the trust boundary, not
 * the model (spec D10 — generation is never the security boundary).
 */
import {
  describeBlockCatalog,
  parseGeneratedSurface,
  type GeneratedSurfaceSchema,
} from "longformer-ui";
import { composeLocalSurface } from "./localComposer";

export interface SurfaceGenerationResult {
  /** Validated surface; null when even the fallback failed (never in practice). */
  surface: GeneratedSurfaceSchema | null;
  /** Reply text shown above the generated UI. */
  summary: string;
  /** Which engine produced the surface — surfaced in the UI label. */
  engine: "llm" | "local";
  /** Validation messages for blocks the boundary rejected (logged, not fatal). */
  warnings: string[];
}

// ---------------------------------------------------------------------------
// LLM engine configuration (all optional; absence selects the local engine)
// ---------------------------------------------------------------------------

const LLM_API_KEY = import.meta.env.VITE_LLM_API_KEY;
const LLM_BASE_URL = import.meta.env.VITE_LLM_BASE_URL ?? "https://api.openai.com/v1";
const LLM_MODEL = import.meta.env.VITE_LLM_MODEL ?? "gpt-4o-mini";

/** System prompt: the registry's block vocabulary plus strict output rules. */
function buildSystemPrompt(): string {
  return [
    "You generate UI for the Longformer design system. Respond with JSON only — no prose, no markdown fences.",
    "Output shape: { \"summary\": string, \"surface\": { \"id\": string, \"blocks\": Block[] } }.",
    "`summary` is one short conversational sentence. Every block needs a unique `id` and a `type` from this catalog:",
    describeBlockCatalog(),
    "Each card/item inside a block also needs a unique `id`. Use 1-3 blocks. Prefer statCards, cardGrid, taskChecklistCards, eventCards, insightCards, mediaCards, timelineSteps, selectionTiles, form.",
  ].join("\n\n");
}

/** Strip markdown fences some models wrap around JSON despite instructions. */
function extractJson(text: string): string {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  return (fenced ? fenced[1] : text).trim();
}

/**
 * Ask the configured LLM for a surface. Throws on transport/parse failure;
 * the caller falls back to the local engine.
 */
async function generateWithLlm(prompt: string): Promise<{ summary: string; surfaceJson: unknown }> {
  const response = await fetch(`${LLM_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${LLM_API_KEY}`,
    },
    body: JSON.stringify({
      model: LLM_MODEL,
      temperature: 0.4,
      messages: [
        { role: "system", content: buildSystemPrompt() },
        { role: "user", content: prompt },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`LLM request failed: ${response.status} ${response.statusText}`);
  }

  const payload = (await response.json()) as { choices?: { message?: { content?: string } }[] };
  const content = payload.choices?.[0]?.message?.content;
  if (!content) throw new Error("LLM response contained no content");

  const parsed = JSON.parse(extractJson(content)) as { summary?: unknown; surface?: unknown };
  return {
    summary: typeof parsed.summary === "string" ? parsed.summary : "Here's what I generated.",
    surfaceJson: parsed.surface,
  };
}

// ---------------------------------------------------------------------------
// Public entry point
// ---------------------------------------------------------------------------

/**
 * Generate and validate a surface for a chat prompt. Never rejects: LLM
 * failures degrade to the local engine, and validation failures degrade to
 * whatever blocks survived (with warnings for the rest).
 */
export async function generateSurface(prompt: string): Promise<SurfaceGenerationResult> {
  if (LLM_API_KEY) {
    try {
      const { summary, surfaceJson } = await generateWithLlm(prompt);
      const { surface, issues } = parseGeneratedSurface(surfaceJson);
      const warnings = issues.map((issue) => `Block ${issue.index} (${issue.type ?? "?"}): ${issue.messages.join("; ")}`);
      // A surface with zero valid blocks is worse than the offline composer,
      // so only accept the LLM result when something actually validated.
      if (surface && surface.blocks.length > 0) {
        return { surface, summary, engine: "llm", warnings };
      }
      console.warn("LLM surface failed validation, falling back to local composer", issues);
    } catch (error) {
      console.warn("LLM generation failed, falling back to local composer", error);
    }
  }

  const local = composeLocalSurface(prompt);
  const { surface, issues } = parseGeneratedSurface(local.surfaceJson);
  return {
    surface,
    summary: local.summary,
    engine: "local",
    warnings: issues.map((issue) => `Block ${issue.index} (${issue.type ?? "?"}): ${issue.messages.join("; ")}`),
  };
}
