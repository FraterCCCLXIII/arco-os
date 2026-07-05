/**
 * Mock OpenAI-compatible server for the generative-UI prototype.
 *
 * Speaks just enough of the chat-completions dialect to stand in for a real
 * provider: `GET /v1/models` (used by "Test connection") and
 * `POST /v1/chat/completions` (used by generateSurface). It answers every
 * prompt with generated-surface JSON in the exact contract the demo expects,
 * so the full path — Connect API modal → HTTP request → JSON → registry
 * validation → inline render — can be exercised offline and in CI.
 *
 * Run: `npm run llm:mock --workspace=longformer-demo` (listens on :8787).
 * Connect from the app with base URL `http://localhost:8787/v1`, no API key.
 */
import { createServer } from "node:http";

const PORT = Number(process.env.PORT ?? 8787);
const MODEL_ID = "longformer-mock-1";

// ---------------------------------------------------------------------------
// Surface generation
//
// Deliberately different output from the in-app local composer (metric chart
// + stat tiles + checklist) so a demo can visually confirm the response came
// over HTTP rather than from the offline fallback.
// ---------------------------------------------------------------------------

/** Extract the last user message from a chat-completions request body. */
function lastUserMessage(body) {
  const messages = Array.isArray(body?.messages) ? body.messages : [];
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i]?.role === "user" && typeof messages[i].content === "string") {
      return messages[i].content;
    }
  }
  return "your request";
}

function titleCase(text) {
  const trimmed = text.trim().replace(/[.?!]+$/, "");
  return trimmed ? trimmed.charAt(0).toUpperCase() + trimmed.slice(1) : "Your request";
}

/** Deterministic pseudo-random chart values seeded by the prompt text. */
function chartValuesFor(prompt) {
  let seed = 0;
  for (const char of prompt) seed = (seed * 31 + char.charCodeAt(0)) % 9973;
  return Array.from({ length: 7 }, (_, i) => {
    seed = (seed * 137 + 71) % 9973;
    return 10 + ((seed + i * 13) % 25);
  });
}

function buildSurfacePayload(prompt) {
  const topic = titleCase(prompt);
  return {
    summary: `Here's a live surface for "${topic}" — generated over the API by ${MODEL_ID}.`,
    surface: {
      id: `mock-${Date.now()}`,
      blocks: [
        { id: "mk-heading", type: "text", text: topic, tone: "heading" },
        {
          id: "mk-metric",
          type: "metricChartCards",
          cards: [
            {
              id: "mm1",
              label: "Momentum",
              value: "72%",
              change: { amount: "+6.2", percent: "+9%", direction: "up" },
              chartValues: chartValuesFor(prompt),
            },
          ],
        },
        {
          id: "mk-stats",
          type: "statCards",
          cards: [
            { id: "ms1", label: "Confidence", value: "High", caption: "API round-trip verified", icon: "zap", tone: "success" },
            { id: "ms2", label: "Blocks validated", value: "4 / 4", icon: "check", tone: "accent" },
          ],
        },
        {
          id: "mk-tasks",
          type: "taskChecklistCards",
          cards: [
            {
              id: "mt1",
              title: "Next actions",
              items: [
                { label: "Review the generated layout", completed: true },
                { label: "Refine the prompt for more detail", completed: false },
                { label: "Save this surface as an app", completed: false },
              ],
              progress: 33,
              progressLabel: "1 of 3",
            },
          ],
        },
      ],
    },
  };
}

// ---------------------------------------------------------------------------
// HTTP plumbing — permissive CORS so the Vite dev app (any port) can call us.
// ---------------------------------------------------------------------------

function sendJson(res, status, payload) {
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  });
  res.end(JSON.stringify(payload));
}

const server = createServer((req, res) => {
  if (req.method === "OPTIONS") {
    sendJson(res, 204, {});
    return;
  }

  if (req.method === "GET" && req.url?.startsWith("/v1/models")) {
    sendJson(res, 200, { object: "list", data: [{ id: MODEL_ID, object: "model" }] });
    return;
  }

  if (req.method === "POST" && req.url?.startsWith("/v1/chat/completions")) {
    let raw = "";
    req.on("data", (chunk) => (raw += chunk));
    req.on("end", () => {
      let body = {};
      try {
        body = JSON.parse(raw || "{}");
      } catch {
        sendJson(res, 400, { error: { message: "Invalid JSON body" } });
        return;
      }
      const payload = buildSurfacePayload(lastUserMessage(body));
      sendJson(res, 200, {
        id: `chatcmpl-mock-${Date.now()}`,
        object: "chat.completion",
        model: MODEL_ID,
        choices: [
          {
            index: 0,
            finish_reason: "stop",
            message: { role: "assistant", content: JSON.stringify(payload) },
          },
        ],
      });
    });
    return;
  }

  sendJson(res, 404, { error: { message: `No route for ${req.method} ${req.url}` } });
});

server.listen(PORT, () => {
  console.log(`Mock LLM server ready at http://localhost:${PORT}/v1 (model: ${MODEL_ID})`);
});
