/**
 * LLM connection store — where the demo keeps "which API am I talking to".
 *
 * The connection (base URL, key, model) is entered at runtime through the
 * Connect API modal and persisted in localStorage, so a designer can point
 * the prototype at OpenAI, OpenRouter, a local Ollama, or any
 * OpenAI-compatible endpoint without touching `.env`. Env vars still work
 * as initial defaults for developers.
 *
 * `generateSurface` reads the stored connection at request time, so saving
 * a connection takes effect on the very next prompt with no reload.
 */

// ---------------------------------------------------------------------------
// Connection shape and provider presets
// ---------------------------------------------------------------------------

export interface LlmConnection {
  presetId: string;
  baseUrl: string;
  /** Empty is allowed for keyless local servers (Ollama, LM Studio, mocks). */
  apiKey: string;
  model: string;
}

export interface LlmProviderPreset {
  id: string;
  label: string;
  baseUrl: string;
  /** Placeholder / suggested model shown in the form. */
  suggestedModel: string;
  requiresKey: boolean;
  hint: string;
}

/**
 * Any endpoint speaking the OpenAI chat-completions dialect works; these are
 * the ones people reach for first.
 */
export const LLM_PRESETS: LlmProviderPreset[] = [
  {
    id: "openai",
    label: "OpenAI",
    baseUrl: "https://api.openai.com/v1",
    suggestedModel: "gpt-4o-mini",
    requiresKey: true,
    hint: "Uses your OpenAI API key. Any chat model works.",
  },
  {
    id: "openrouter",
    label: "OpenRouter",
    baseUrl: "https://openrouter.ai/api/v1",
    suggestedModel: "anthropic/claude-3.5-haiku",
    requiresKey: true,
    hint: "One key, many models — useful for comparing providers.",
  },
  {
    id: "ollama",
    label: "Ollama (local)",
    baseUrl: "http://localhost:11434/v1",
    suggestedModel: "llama3.2",
    requiresKey: false,
    hint: "Run `ollama serve` locally. No API key needed.",
  },
  {
    id: "custom",
    label: "Custom endpoint",
    baseUrl: "",
    suggestedModel: "",
    requiresKey: false,
    hint: "Any OpenAI-compatible /chat/completions endpoint.",
  },
];

export function presetById(id: string): LlmProviderPreset {
  return LLM_PRESETS.find((preset) => preset.id === id) ?? LLM_PRESETS[LLM_PRESETS.length - 1];
}

// ---------------------------------------------------------------------------
// Persistence
//
// localStorage wins over env vars: the modal writes what the user typed, and
// clearing the connection falls back to env defaults (if any).
// ---------------------------------------------------------------------------

const STORAGE_KEY = "lf-llm-connection";

function envDefaultConnection(): LlmConnection | null {
  const apiKey = import.meta.env.VITE_LLM_API_KEY;
  if (!apiKey) return null;
  return {
    presetId: "custom",
    baseUrl: import.meta.env.VITE_LLM_BASE_URL ?? "https://api.openai.com/v1",
    apiKey,
    model: import.meta.env.VITE_LLM_MODEL ?? "gpt-4o-mini",
  };
}

/** The active connection: user-saved first, env defaults second, else null. */
export function getStoredConnection(): LlmConnection | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<LlmConnection>;
      if (typeof parsed.baseUrl === "string" && typeof parsed.model === "string") {
        return {
          presetId: typeof parsed.presetId === "string" ? parsed.presetId : "custom",
          baseUrl: parsed.baseUrl,
          apiKey: typeof parsed.apiKey === "string" ? parsed.apiKey : "",
          model: parsed.model,
        };
      }
    }
  } catch {
    // Corrupt storage entry — treat as unconfigured rather than crash.
  }
  return envDefaultConnection();
}

export function saveConnection(connection: LlmConnection): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(connection));
}

export function clearConnection(): void {
  localStorage.removeItem(STORAGE_KEY);
}

/** True when the connection has enough fields to attempt a request. */
export function isConnectionUsable(connection: LlmConnection | null): connection is LlmConnection {
  return Boolean(connection && connection.baseUrl.trim() && connection.model.trim());
}

// ---------------------------------------------------------------------------
// Connection testing
//
// GET /models is the cheapest call every OpenAI-compatible server supports;
// it verifies reachability and auth without spending tokens.
// ---------------------------------------------------------------------------

export interface ConnectionTestResult {
  ok: boolean;
  message: string;
  /** Model ids the server advertises, when it returns them. */
  models?: string[];
}

export async function testConnection(connection: LlmConnection): Promise<ConnectionTestResult> {
  if (!connection.baseUrl.trim()) {
    return { ok: false, message: "Enter a base URL first." };
  }
  try {
    const headers: Record<string, string> = {};
    if (connection.apiKey.trim()) headers.Authorization = `Bearer ${connection.apiKey.trim()}`;
    const response = await fetch(`${connection.baseUrl.replace(/\/$/, "")}/models`, {
      headers,
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) {
      return {
        ok: false,
        message:
          response.status === 401 || response.status === 403
            ? "Endpoint reached, but the API key was rejected."
            : `Endpoint responded with ${response.status} ${response.statusText}.`,
      };
    }
    const payload = (await response.json().catch(() => null)) as { data?: { id?: string }[] } | null;
    const models = payload?.data
      ?.map((entry) => entry.id)
      .filter((id): id is string => typeof id === "string");
    return {
      ok: true,
      message: models?.length ? `Connected — ${models.length} models available.` : "Connected.",
      models,
    };
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    return { ok: false, message: `Could not reach the endpoint (${detail}).` };
  }
}
