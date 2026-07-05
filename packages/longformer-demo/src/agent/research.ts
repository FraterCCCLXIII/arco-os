/**
 * Research tool — turns a chat prompt into an evidence pack of real pages,
 * snippets, and photos the surface generator can cite.
 *
 * Backend choice: the Wikimedia Action API. It is the one research source
 * that works from a keyless browser app — CORS-enabled (`origin=*`), no
 * secret to leak, hotlinkable thumbnails, and canonical URLs to real pages.
 * Keyed providers (Tavily, Google Places…) can slot in behind the same
 * `EvidencePack` shape once requests are proxied server-side.
 *
 * The pack is *evidence*, not UI: the generator (LLM or local composer)
 * decides layout, but is instructed to only use URLs and images that appear
 * here — the model must never invent links.
 */

export interface EvidenceSource {
  /** Page title, e.g. "Alfama". */
  title: string;
  /** Canonical https URL of the real page. */
  url: string;
  /** One-line description, e.g. "Neighborhood in Lisbon, Portugal". */
  description?: string;
  /** First sentences of the page, plain text. */
  snippet?: string;
  /** https thumbnail URL, when the page has a lead image. */
  image?: string;
}

export interface EvidencePack {
  /** The cleaned query the sources were fetched for. */
  query: string;
  /** Ranked sources; the first ones are the best matches. */
  sources: EvidenceSource[];
}

/** Filler that pollutes encyclopedia search when taken verbatim from chat. */
const PROMPT_FILLER =
  /\b(please|can you|could you|help me|i want to|i'd like to|show me|find me|plan(?: a| the| my)?|create|make|build|generate|give me|research|look up|what about|tell me about|weekend|trip to|travel to|visit(?:ing)?)\b/gi;

/** Reduce a chat prompt to search terms; falls back to the raw prompt. */
export function toSearchQuery(prompt: string): string {
  const cleaned = prompt
    .replace(PROMPT_FILLER, " ")
    .replace(/[^\p{L}\p{N}\s'-]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
  return cleaned || prompt.trim();
}

/** Shape of the Wikimedia `generator=search` response we consume. */
interface WikiQueryResponse {
  query?: {
    pages?: Record<
      string,
      {
        index?: number;
        title?: string;
        description?: string;
        extract?: string;
        fullurl?: string;
        thumbnail?: { source?: string };
      }
    >;
  };
}

const WIKI_ENDPOINT = "https://en.wikipedia.org/w/api.php";
const RESEARCH_TIMEOUT_MS = 8000;

/**
 * Fetch evidence for a prompt. Resolves to null when the search finds
 * nothing or the network fails — research is an enhancement, never a
 * prerequisite, so callers degrade to generation without evidence.
 */
export async function researchTopic(prompt: string): Promise<EvidencePack | null> {
  const query = toSearchQuery(prompt);
  const params = new URLSearchParams({
    action: "query",
    format: "json",
    origin: "*",
    generator: "search",
    gsrsearch: query,
    gsrlimit: "6",
    prop: "pageimages|description|extracts|info",
    piprop: "thumbnail",
    pithumbsize: "900",
    exintro: "1",
    explaintext: "1",
    exsentences: "2",
    inprop: "url",
  });

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), RESEARCH_TIMEOUT_MS);
  try {
    const response = await fetch(`${WIKI_ENDPOINT}?${params}`, { signal: controller.signal });
    if (!response.ok) return null;
    const payload = (await response.json()) as WikiQueryResponse;
    const pages = Object.values(payload.query?.pages ?? {});
    if (pages.length === 0) return null;

    const sources: EvidenceSource[] = pages
      .sort((a, b) => (a.index ?? 0) - (b.index ?? 0))
      .filter((page): page is typeof page & { title: string; fullurl: string } =>
        Boolean(page.title && page.fullurl?.startsWith("https://")),
      )
      .map((page) => ({
        title: page.title,
        url: page.fullurl,
        description: page.description,
        snippet: page.extract,
        image: page.thumbnail?.source?.startsWith("https://") ? page.thumbnail.source : undefined,
      }));

    return sources.length > 0 ? { query, sources } : null;
  } catch (error) {
    console.warn("Research failed, generating without evidence", error);
    return null;
  } finally {
    clearTimeout(timeout);
  }
}
