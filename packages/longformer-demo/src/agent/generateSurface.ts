/**
 * Surface generator — the demo's minimal agent loop.
 *
 * Given a chat prompt, produce a validated `GeneratedSurfaceSchema` plus a
 * conversational summary. A research step (`researchTopic`) runs first and
 * hands both engines an evidence pack of real pages, photos, and links to
 * ground the surface in. Two engines, one contract:
 *
 * 1. **LLM engine** — used when a connection is configured (Connect API
 *    modal, persisted in localStorage; `VITE_LLM_*` env vars as fallback).
 *    Calls any OpenAI-compatible chat-completions endpoint with a system
 *    prompt built from the block registry (`describeBlockCatalog`).
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
import { getStoredConnection, isConnectionUsable, type LlmConnection } from "./connection";
import { composeLocalSurface, isSmallTalk } from "./localComposer";
import { researchTopic, type EvidencePack } from "./research";

export interface SurfaceGenerationResult {
  /** Validated surface; null when even the fallback failed (never in practice). */
  surface: GeneratedSurfaceSchema | null;
  /** Reply text shown above the generated UI. */
  summary: string;
  /** Which engine produced the surface — surfaced in the UI label. */
  engine: "llm" | "local";
  /** Model that generated the surface, when the LLM engine was used. */
  model?: string;
  /**
   * Set when a configured API connection failed and the local engine answered
   * instead — shown in the reply so failures are never silent.
   */
  fallbackReason?: string;
  /** Research evidence the surface was grounded in, when the lookup succeeded. */
  evidence?: EvidencePack;
  /** Validation messages for blocks the boundary rejected (logged, not fatal). */
  warnings: string[];
}

/** System prompt: the registry's block vocabulary plus strict output rules. */
function buildSystemPrompt(): string {
  return [
    "You generate UI for the Longformer design system. Respond with JSON only — no prose, no markdown fences.",
    "Output shape: { \"summary\": string, \"surface\": { \"id\": string, \"blocks\": Block[] } }.",
    "`summary` is one short conversational sentence. Every block needs a unique `id` and a `type` from this catalog:",
    describeBlockCatalog(),
    "Each card/item inside a block also needs a unique `id`. Use 1-3 blocks. Prefer statCards, cardGrid, taskChecklistCards, eventCards, insightCards, mediaCards, timelineSteps, selectionTiles, form.",
    "URL rule: `image` and `href` fields may ONLY contain https URLs copied verbatim from the research evidence in the user message. Never invent, guess, or modify a URL. If no evidence is provided, omit image and href entirely.",
  ].join("\n\n");
}

/** Append the evidence pack to the prompt so the model grounds URLs in it. */
function buildUserMessage(prompt: string, evidence: EvidencePack | null): string {
  if (!evidence) return prompt;
  return [
    prompt,
    "Research evidence (real pages — use these titles, snippets, image URLs, and page URLs to fill blocks like mediaCards and insightCards):",
    JSON.stringify(evidence.sources, null, 2),
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
async function generateWithLlm(
  prompt: string,
  connection: LlmConnection,
  evidence: EvidencePack | null,
): Promise<{ summary: string; surfaceJson: unknown }> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (connection.apiKey.trim()) headers.Authorization = `Bearer ${connection.apiKey.trim()}`;

  const response = await fetch(`${connection.baseUrl.replace(/\/$/, "")}/chat/completions`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      model: connection.model,
      temperature: 0.4,
      messages: [
        { role: "system", content: buildSystemPrompt() },
        { role: "user", content: buildUserMessage(prompt, evidence) },
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
  // Read the connection per request so a save in the Connect API modal
  // applies to the very next prompt without a reload.
  const connection = getStoredConnection();
  let fallbackReason: string | undefined;

  // Research runs first, for both engines — small talk skips the round-trip.
  // A null pack simply means both engines generate ungrounded, as before.
  const evidence = isSmallTalk(prompt) ? null : await researchTopic(prompt);

  if (isConnectionUsable(connection)) {
    try {
      const { summary, surfaceJson } = await generateWithLlm(prompt, connection, evidence);
      const { surface, issues } = parseGeneratedSurface(surfaceJson);
      const warnings = issues.map((issue) => `Block ${issue.index} (${issue.type ?? "?"}): ${issue.messages.join("; ")}`);
      // A surface with zero valid blocks is worse than the offline composer,
      // so only accept the LLM result when something actually validated.
      if (surface && surface.blocks.length > 0) {
        return { surface, summary, engine: "llm", model: connection.model, evidence: evidence ?? undefined, warnings };
      }
      console.warn("LLM surface failed validation, falling back to local composer", issues);
      fallbackReason = `${connection.model} replied, but none of its blocks passed validation.`;
    } catch (error) {
      console.warn("LLM generation failed, falling back to local composer", error);
      fallbackReason = `Couldn't get a reply from ${connection.model} (${error instanceof Error ? error.message : String(error)}).`;
    }
  }

  const local = composeLocalSurface(prompt, evidence);
  const { surface, issues } = parseGeneratedSurface(local.surfaceJson);
  return {
    surface,
    summary: local.summary,
    engine: "local",
    fallbackReason,
    evidence: evidence ?? undefined,
    warnings: issues.map((issue) => `Block ${issue.index} (${issue.type ?? "?"}): ${issue.messages.join("; ")}`),
  };
}
