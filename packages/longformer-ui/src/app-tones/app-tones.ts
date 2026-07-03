import type { BadgeTone } from "../components/primitives/Badge";

/** Distinct hue slots for app launcher tiles — each workspace gets a stable color. */
export type AppIconHue =
  | "blue"
  | "indigo"
  | "violet"
  | "purple"
  | "teal"
  | "green"
  | "lime"
  | "amber"
  | "orange"
  | "rose"
  | "cyan"
  | "sky"
  | "gold"
  | "emerald"
  | "slate"
  | "graphite";

export const APP_ICON_HUES: readonly AppIconHue[] = [
  "blue",
  "indigo",
  "violet",
  "purple",
  "teal",
  "green",
  "lime",
  "amber",
  "orange",
  "rose",
  "cyan",
  "sky",
  "gold",
  "emerald",
  "slate",
  "graphite",
] as const;

/** Canonical hue per known workspace / launcher app id. */
export const APP_ICON_HUE_BY_ID: Record<string, AppIconHue> = {
  chat: "blue",
  messages: "indigo",
  slack: "violet",
  social: "sky",
  contacts: "teal",
  notes: "green",
  email: "amber",
  calendar: "orange",
  schedule: "cyan",
  files: "sky",
  wallet: "gold",
  "bank-crypto": "emerald",
  music: "green",
  composer: "rose",
  vision: "rose",
  reader: "amber",
  maps: "cyan",
  camera: "violet",
  weather: "sky",
  calculator: "amber",
  phone: "teal",
  tasks: "lime",
  notifications: "rose",
  apps: "slate",
  settings: "graphite",
  desktop: "graphite",
  generated: "purple",
  server: "cyan",
  orchestrator: "teal",
  tickets: "rose",
  transcribe: "violet",
  "life-planning": "emerald",
  psyche: "purple",
  sheets: "green",
  extensions: "violet",
  passport: "amber",
  bento: "purple",
  "app-port": "cyan",
  finder: "sky",
  browser: "blue",
  terminal: "graphite",
  longformer: "purple",
  zoom: "indigo",
  linear: "lime",
  notion: "slate",
  figma: "violet",
  github: "graphite",
  docker: "cyan",
  spotify: "green",
  "1password": "amber",
  analytics: "blue",
};

const FALLBACK_HUES = APP_ICON_HUES.filter((hue) => hue !== "slate" && hue !== "graphite");

function hashAppId(appId: string): number {
  let hash = 0;
  for (let index = 0; index < appId.length; index += 1) {
    hash = (hash * 31 + appId.charCodeAt(index)) >>> 0;
  }
  return hash;
}

/** Resolve the stable launcher hue for an app id. */
export function resolveAppIconHue(appId: string, explicit?: AppIconHue): AppIconHue {
  if (explicit) return explicit;
  const known = APP_ICON_HUE_BY_ID[appId];
  if (known) return known;
  return FALLBACK_HUES[hashAppId(appId) % FALLBACK_HUES.length] ?? "blue";
}

/** Map legacy semantic tones to a representative hue. */
export function badgeToneToHue(tone: BadgeTone): AppIconHue {
  switch (tone) {
    case "success":
      return "green";
    case "warning":
      return "amber";
    case "danger":
      return "rose";
    case "neutral":
      return "slate";
    case "accent":
    default:
      return "blue";
  }
}

/** Map a hue back to the closest semantic tone for APIs that still use `BadgeTone`. */
export function appHueToTone(hue: AppIconHue): BadgeTone {
  switch (hue) {
    case "green":
    case "lime":
    case "teal":
    case "emerald":
      return "success";
    case "amber":
    case "orange":
    case "gold":
      return "warning";
    case "rose":
      return "danger";
    case "slate":
    case "graphite":
      return "neutral";
    default:
      return "accent";
  }
}

export function resolveAppTone(appId: string, explicit?: BadgeTone): BadgeTone {
  if (explicit) return explicit;
  return appHueToTone(resolveAppIconHue(appId));
}
