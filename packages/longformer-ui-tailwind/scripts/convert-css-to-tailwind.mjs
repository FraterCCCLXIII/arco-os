#!/usr/bin/env node
/**
 * Converts CSS modules in longformer-ui-tailwind to Tailwind class maps (.tailwind.ts).
 * Run once after copying from longformer-ui; safe to re-run only on a fresh copy.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import postcss from "postcss";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC_ROOT = path.resolve(__dirname, "../src");

const SPACING_TOKENS = {
  "var(--lf-space-1)": "lf-1",
  "var(--lf-space-2)": "lf-2",
  "var(--lf-space-3)": "lf-3",
  "var(--lf-space-4)": "lf-4",
  "var(--lf-space-5)": "lf-5",
  "var(--lf-space-6)": "lf-6",
  "var(--lf-space-7)": "lf-7",
  "var(--lf-space-8)": "lf-8",
};

const RADIUS_TOKENS = {
  "var(--lf-radius-sm)": "lf-sm",
  "var(--lf-radius-md)": "lf-md",
  "var(--lf-radius-lg)": "lf-lg",
  "var(--lf-radius-xl)": "lf-xl",
  "var(--lf-radius-pill)": "lf-pill",
};

const FONT_SIZE_TOKENS = {
  "var(--lf-font-size-xs)": "lf-xs",
  "var(--lf-font-size-sm)": "lf-sm",
  "var(--lf-font-size-md)": "lf-md",
  "var(--lf-font-size-base)": "lf-base",
  "var(--lf-font-size-lg)": "lf-lg",
  "var(--lf-font-size-xl)": "lf-xl",
  "var(--lf-font-size-2xl)": "lf-2xl",
};

const COLOR_TOKENS = {
  "var(--lf-surface-canvas)": "lf-surface-canvas",
  "var(--lf-surface-1)": "lf-surface-1",
  "var(--lf-surface-2)": "lf-surface-2",
  "var(--lf-surface-3)": "lf-surface-3",
  "var(--lf-surface-overlay)": "lf-surface-overlay",
  "var(--lf-surface-sunken)": "lf-surface-sunken",
  "var(--lf-surface-glass)": "lf-surface-glass",
  "var(--lf-border-subtle)": "lf-border-subtle",
  "var(--lf-border-default)": "lf-border-default",
  "var(--lf-border-strong)": "lf-border-strong",
  "var(--lf-divider)": "lf-divider",
  "var(--lf-text-primary)": "lf-text-primary",
  "var(--lf-text-secondary)": "lf-text-secondary",
  "var(--lf-text-tertiary)": "lf-text-tertiary",
  "var(--lf-text-disabled)": "lf-text-disabled",
  "var(--lf-text-on-accent)": "lf-text-on-accent",
  "var(--lf-accent)": "lf-accent",
  "var(--lf-accent-hover)": "lf-accent-hover",
  "var(--lf-accent-active)": "lf-accent-active",
  "var(--lf-accent-muted)": "lf-accent-muted",
  "var(--lf-accent-border)": "lf-accent-border",
  "var(--lf-success)": "lf-success",
  "var(--lf-success-muted)": "lf-success-muted",
  "var(--lf-warning)": "lf-warning",
  "var(--lf-warning-muted)": "lf-warning-muted",
  "var(--lf-danger)": "lf-danger",
  "var(--lf-danger-muted)": "lf-danger-muted",
  "var(--lf-info)": "lf-info",
  "var(--lf-info-muted)": "lf-info-muted",
  "var(--lf-focus-ring)": "lf-focus-ring",
  "var(--lf-scrim)": "lf-scrim",
};

const SHADOW_TOKENS = {
  "var(--lf-shadow-sm)": "lf-sm",
  "var(--lf-shadow-md)": "lf-md",
  "var(--lf-shadow-lg)": "lf-lg",
  "var(--lf-shadow-overlay)": "lf-overlay",
};

const Z_INDEX_TOKENS = {
  "var(--lf-z-dropdown)": "lf-dropdown",
  "var(--lf-z-overlay)": "lf-overlay",
  "var(--lf-z-modal)": "lf-modal",
  "var(--lf-z-tooltip)": "lf-tooltip",
  "var(--lf-z-toast)": "lf-toast",
};

const DISPLAY_MAP = {
  none: "hidden",
  flex: "flex",
  "inline-flex": "inline-flex",
  grid: "grid",
  block: "block",
  "inline-block": "inline-block",
  contents: "contents",
};

const FLEX_DIRECTION_MAP = {
  row: "flex-row",
  column: "flex-col",
  "row-reverse": "flex-row-reverse",
  "column-reverse": "flex-col-reverse",
};

const FLEX_WRAP_MAP = {
  wrap: "flex-wrap",
  nowrap: "flex-nowrap",
};

const ALIGN_ITEMS_MAP = {
  center: "items-center",
  "flex-start": "items-start",
  "flex-end": "items-end",
  stretch: "items-stretch",
  baseline: "items-baseline",
};

const JUSTIFY_CONTENT_MAP = {
  center: "justify-center",
  "flex-start": "justify-start",
  "flex-end": "justify-end",
  "space-between": "justify-between",
  "space-around": "justify-around",
  "space-evenly": "justify-evenly",
};

const ALIGN_SELF_MAP = {
  center: "self-center",
  "flex-start": "self-start",
  "flex-end": "self-end",
  stretch: "self-stretch",
};

const TEXT_ALIGN_MAP = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

const OVERFLOW_MAP = {
  hidden: "overflow-hidden",
  auto: "overflow-auto",
  scroll: "overflow-scroll",
  visible: "overflow-visible",
};

const POSITION_MAP = {
  relative: "relative",
  absolute: "absolute",
  fixed: "fixed",
  sticky: "sticky",
  static: "static",
};

const FONT_WEIGHT_MAP = {
  "400": "font-normal",
  "500": "font-medium",
  "600": "font-semibold",
  "700": "font-bold",
};

const CURSOR_MAP = {
  pointer: "cursor-pointer",
  "not-allowed": "cursor-not-allowed",
  default: "cursor-default",
  grab: "cursor-grab",
  text: "cursor-text",
};

const WHITESPACE_MAP = {
  nowrap: "whitespace-nowrap",
  normal: "whitespace-normal",
  pre: "whitespace-pre",
  "pre-wrap": "whitespace-pre-wrap",
};

const FLEX_MAP = {
  "1": "flex-1",
  "1 1 auto": "flex-1",
  "0 0 auto": "shrink-0",
  none: "flex-none",
};

const OPACITY_MAP = {
  "0": "opacity-0",
  "0.5": "opacity-50",
  "1": "opacity-100",
};

function normalizeValue(value) {
  return value.replace(/\s+/g, " ").trim();
}

function arbitrary(prop, value) {
  const safe = value.replace(/\s+/g, "_").replace(/,/g, ",");
  const cssProp = prop.replace(/([A-Z])/g, "-$1").toLowerCase();
  return `[${cssProp}:${safe}]`;
}

function spacingClass(prefix, value) {
  const token = SPACING_TOKENS[value];
  if (token) return `${prefix}-${token}`;
  if (value === "0") return `${prefix}-0`;
  if (value === "auto") return `${prefix}-auto`;
  if (value === "100%") return `${prefix}-full`;
  if (/^-?\d+(\.\d+)?px$/.test(value)) return `${prefix}-[${value}]`;
  return `${prefix}-[${value.replace(/\s+/g, "_")}]`;
}

function colorClass(prefix, value) {
  const token = COLOR_TOKENS[value];
  if (token) return `${prefix}-${token}`;
  if (value === "transparent") return `${prefix}-transparent`;
  if (value === "currentColor") return `${prefix}-current`;
  return `${prefix}-[${value.replace(/\s+/g, "_")}]`;
}

function radiusClass(value) {
  const token = RADIUS_TOKENS[value];
  if (token) return `rounded-${token}`;
  if (value === "50%") return "rounded-full";
  if (value === "0") return "rounded-none";
  return `rounded-[${value.replace(/\s+/g, "_")}]`;
}

function fontSizeClass(value) {
  const token = FONT_SIZE_TOKENS[value];
  if (token) return `text-${token}`;
  return `text-[${value.replace(/\s+/g, "_")}]`;
}

function shadowClass(value) {
  const token = SHADOW_TOKENS[value];
  if (token) return `shadow-${token}`;
  if (value === "none") return "shadow-none";
  return `shadow-[${value.replace(/\s+/g, "_")}]`;
}

function zIndexClass(value) {
  const token = Z_INDEX_TOKENS[value];
  if (token) return `z-${token}`;
  if (/^\d+$/.test(value)) return `z-[${value}]`;
  return `z-[${value.replace(/\s+/g, "_")}]`;
}

function convertDeclaration(prop, value) {
  const v = normalizeValue(value);

  switch (prop) {
    case "display":
      return DISPLAY_MAP[v] ?? arbitrary("display", v);
    case "flex-direction":
      return FLEX_DIRECTION_MAP[v] ?? arbitrary("flex-direction", v);
    case "flex-wrap":
      return FLEX_WRAP_MAP[v] ?? arbitrary("flex-wrap", v);
    case "align-items":
      return ALIGN_ITEMS_MAP[v] ?? arbitrary("align-items", v);
    case "justify-content":
      return JUSTIFY_CONTENT_MAP[v] ?? arbitrary("justify-content", v);
    case "align-self":
      return ALIGN_SELF_MAP[v] ?? arbitrary("align-self", v);
    case "text-align":
      return TEXT_ALIGN_MAP[v] ?? arbitrary("text-align", v);
    case "overflow":
      return OVERFLOW_MAP[v] ?? arbitrary("overflow", v);
    case "overflow-x":
      return v === "hidden" ? "overflow-x-hidden" : arbitrary("overflow-x", v);
    case "overflow-y":
      return v === "auto" ? "overflow-y-auto" : v === "hidden" ? "overflow-y-hidden" : arbitrary("overflow-y", v);
    case "position":
      return POSITION_MAP[v] ?? arbitrary("position", v);
    case "font-weight":
      return FONT_WEIGHT_MAP[v] ?? `font-[${v}]`;
    case "cursor":
      return CURSOR_MAP[v] ?? arbitrary("cursor", v);
    case "white-space":
      return WHITESPACE_MAP[v] ?? arbitrary("white-space", v);
    case "flex":
      return FLEX_MAP[v] ?? arbitrary("flex", v);
    case "opacity":
      return OPACITY_MAP[v] ?? `opacity-[${v}]`;
    case "appearance":
      return v === "none" ? "appearance-none" : arbitrary("appearance", v);
    case "box-sizing":
      return v === "border-box" ? "box-border" : arbitrary("box-sizing", v);
    case "pointer-events":
      return v === "none" ? "pointer-events-none" : v === "auto" ? "pointer-events-auto" : arbitrary("pointer-events", v);
    case "user-select":
      return v === "none" ? "select-none" : arbitrary("user-select", v);
    case "visibility":
      return v === "hidden" ? "invisible" : v === "visible" ? "visible" : arbitrary("visibility", v);
    case "outline":
      return v === "none" ? "outline-none" : arbitrary("outline", v);
    case "border":
      if (v === "none") return "border-none";
      if (v.startsWith("1px solid")) {
        const color = v.replace("1px solid ", "");
        return `border border-solid ${colorClass("border", color)}`;
      }
      return arbitrary("border", v);
    case "border-left": {
      const side = prop.split("-")[1];
      const prefix = `border-${side === "left" ? "l" : side === "right" ? "r" : side === "top" ? "t" : "b"}`;
      if (v.startsWith("1px solid")) {
        const color = v.replace("1px solid ", "");
        return `${prefix} ${colorClass("border", color)}`;
      }
      return arbitrary(prop, v);
    }
    case "border-right":
    case "border-bottom":
    case "border-top": {
      const side = prop.split("-")[1];
      const prefix = `border-${side === "left" ? "l" : side === "right" ? "r" : side === "top" ? "t" : "b"}`;
      if (v.startsWith("1px solid")) {
        const color = v.replace("1px solid ", "");
        return `${prefix} ${colorClass("border", color)}`;
      }
      return arbitrary(prop, v);
    }
    case "border-width":
      return v === "0" ? "border-0" : arbitrary("border-width", v);
    case "border-color":
      return colorClass("border", v);
    case "border-radius":
      return radiusClass(v);
    case "border-top-left-radius":
    case "border-top-right-radius":
    case "border-bottom-left-radius":
    case "border-bottom-right-radius":
      return arbitrary(prop, v);
    case "background":
    case "background-color":
      return colorClass("bg", v);
    case "background-image":
      return v === "none" ? "bg-none" : arbitrary("background-image", v);
    case "color":
      return colorClass("text", v);
    case "font-family":
      return v.includes("mono") ? "font-mono" : "font-sans";
    case "font-size":
      return fontSizeClass(v);
    case "line-height":
      if (v === "1") return "leading-none";
      if (v === "1.25") return "leading-tight";
      if (v === "1.5") return "leading-normal";
      return `leading-[${v}]`;
    case "gap":
      return spacingClass("gap", v);
    case "row-gap":
      return spacingClass("gap-y", v);
    case "column-gap":
      return spacingClass("gap-x", v);
    case "padding":
      return spacingClass("p", v);
    case "padding-top":
      return spacingClass("pt", v);
    case "padding-right":
      return spacingClass("pr", v);
    case "padding-bottom":
      return spacingClass("pb", v);
    case "padding-left":
      return spacingClass("pl", v);
    case "margin":
      return spacingClass("m", v);
    case "margin-top":
      return spacingClass("mt", v);
    case "margin-right":
      return spacingClass("mr", v);
    case "margin-bottom":
      return spacingClass("mb", v);
    case "margin-left":
      return spacingClass("ml", v);
    case "width":
      if (v === "100%") return "w-full";
      if (v === "auto") return "w-auto";
      if (v === "fit-content") return "w-fit";
      return `w-[${v.replace(/\s+/g, "_")}]`;
    case "min-width":
      if (v === "0") return "min-w-0";
      return `min-w-[${v.replace(/\s+/g, "_")}]`;
    case "max-width":
      if (v === "100%") return "max-w-full";
      return `max-w-[${v.replace(/\s+/g, "_")}]`;
    case "height":
      if (v === "100%") return "h-full";
      if (v === "auto") return "h-auto";
      if (/^\d+px$/.test(v)) return `h-[${v}]`;
      return `h-[${v.replace(/\s+/g, "_")}]`;
    case "min-height":
      if (v === "0") return "min-h-0";
      return `min-h-[${v.replace(/\s+/g, "_")}]`;
    case "max-height":
      return `max-h-[${v.replace(/\s+/g, "_")}]`;
    case "inset":
      if (v === "0") return "inset-0";
      return arbitrary("inset", v);
    case "top":
    case "right":
    case "bottom":
    case "left":
      if (v === "0") return `${prop}-0`;
      if (v === "auto") return `${prop}-auto`;
      return `${prop}-[${v.replace(/\s+/g, "_")}]`;
    case "z-index":
      return zIndexClass(v);
    case "box-shadow":
      return shadowClass(v);
    case "transform":
      return arbitrary("transform", v);
    case "transition":
      return "transition-[background-color,border-color,color,box-shadow,opacity,transform] duration-[var(--lf-duration-fast)] ease-[var(--lf-ease)]";
    case "transition-property":
    case "transition-duration":
    case "transition-timing-function":
      return null;
    case "grid-template-columns":
      return `grid-cols-[${v.replace(/\s+/g, "_")}]`;
    case "grid-template-rows":
      return `grid-rows-[${v.replace(/\s+/g, "_")}]`;
    case "grid-column":
      return `col-[${v.replace(/\s+/g, "_")}]`;
    case "grid-row":
      return `row-[${v.replace(/\s+/g, "_")}]`;
    case "aspect-ratio":
      return `aspect-[${v.replace(/\s+/g, "_")}]`;
    case "object-fit":
      return v === "cover" ? "object-cover" : v === "contain" ? "object-contain" : arbitrary("object-fit", v);
    case "text-overflow":
      return v === "ellipsis" ? "text-ellipsis" : arbitrary("text-overflow", v);
    case "text-decoration":
      return v === "none" ? "no-underline" : arbitrary("text-decoration", v);
    case "text-transform":
      return v === "uppercase" ? "uppercase" : v === "lowercase" ? "lowercase" : v === "capitalize" ? "capitalize" : arbitrary("text-transform", v);
    case "letter-spacing":
      return arbitrary("letter-spacing", v);
    case "list-style":
      return v === "none" ? "list-none" : arbitrary("list-style", v);
    case "content":
      return arbitrary("content", v);
    case "filter":
      return arbitrary("filter", v);
    case "backdrop-filter":
      return arbitrary("backdrop-filter", v);
    case "-webkit-line-clamp":
      return `line-clamp-[${v}]`;
    case "line-clamp":
      return `line-clamp-[${v}]`;
    case "scrollbar-width":
      return v === "none" ? "scrollbar-none" : arbitrary("scrollbar-width", v);
    case "-ms-overflow-style":
      return arbitrary("-ms-overflow-style", v);
    default:
      return arbitrary(prop, v);
  }
}

function splitSelectorList(selector) {
  const parts = [];
  let current = "";
  let depth = 0;
  for (const ch of selector) {
    if (ch === "(") depth++;
    if (ch === ")") depth--;
    if (ch === "," && depth === 0) {
      if (current.trim()) parts.push(current.trim());
      current = "";
    } else {
      current += ch;
    }
  }
  if (current.trim()) parts.push(current.trim());
  return parts;
}

function parseSingleSelector(selector) {
  const trimmed = selector.trim();
  if (!trimmed || trimmed.startsWith("@")) return { unsupported: true };
  if (/[+>~]/.test(trimmed)) return { unsupported: true };

  let working = trimmed;
  const pseudoParts = [];

  if (working.includes("::")) {
    const pseudoElementMatch = working.match(/^(.+)::(before|after)$/);
    if (!pseudoElementMatch) return { unsupported: true };
    working = pseudoElementMatch[1].trim();
    pseudoParts.push(`before:${pseudoElementMatch[2]}`);
  }

  const pseudoRegex = /:([a-z-]+)(?:\(([^)]*)\))?/g;
  let match;
  const pseudoMatches = [];
  while ((match = pseudoRegex.exec(working)) !== null) {
    pseudoMatches.push({ pseudo: match[1], arg: match[2] ?? null, index: match.index });
  }

  if (pseudoMatches.length > 0) {
    const firstPseudo = pseudoMatches[0];
    working = working.slice(0, firstPseudo.index).trim();

    for (const pm of pseudoMatches) {
      if (pm.pseudo === "not" && pm.arg?.includes(":disabled")) {
        pseudoParts.push("enabled");
      } else if (pm.pseudo === "hover") {
        pseudoParts.push("hover");
      } else if (pm.pseudo === "active") {
        pseudoParts.push("active");
      } else if (pm.pseudo === "focus") {
        pseudoParts.push("focus");
      } else if (pm.pseudo === "focus-visible") {
        pseudoParts.push("focus-visible");
      } else if (pm.pseudo === "disabled") {
        pseudoParts.push("disabled");
      } else if (pm.pseudo === "first-child") {
        pseudoParts.push("first");
      } else if (pm.pseudo === "last-child") {
        pseudoParts.push("last");
      }
    }
  }

  if (!working.startsWith(".")) return { unsupported: true };

  const classSegment = working.slice(1);
  const classes = classSegment
    .split(".")
    .map((c) => c.replace(/\[.*$/, "").trim())
    .filter(Boolean);

  if (classes.length === 0) return { unsupported: true };

  return { classes, pseudoParts };
}

function parseSelector(selector) {
  return splitSelectorList(selector)
    .map(parseSingleSelector)
    .filter((parsed) => !parsed.unsupported);
}

function classKey(classes) {
  if (classes.length === 1) return classes[0];
  return classes.join("_");
}

function safeObjectKey(key) {
  if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(key)) return key;
  return JSON.stringify(key);
}

function prefixClasses(classes, prefix) {
  if (!prefix.length) return classes;
  return classes.map((c) => `${prefix.join(":")}:${c}`);
}

function addToClassMap(classMap, key, classes) {
  const existing = classMap.get(key) ?? "";
  classMap.set(key, [existing, ...classes].filter(Boolean).join(" "));
}

function convertCssModule(cssPath) {
  const css = fs.readFileSync(cssPath, "utf8");
  const root = postcss.parse(css);
  const classMap = new Map();

  root.walkRules((rule) => {
    const parsedSelectors = parseSelector(rule.selector);
    if (parsedSelectors.length === 0) return;

    const declarations = [];
    rule.walkDecls((decl) => {
      const tw = convertDeclaration(decl.prop, decl.value);
      if (tw) declarations.push(tw);
    });

    if (declarations.length === 0) return;

    for (const parsed of parsedSelectors) {
      const prefixed = prefixClasses(declarations, parsed.pseudoParts);

      if (parsed.classes.length === 1) {
        addToClassMap(classMap, parsed.classes[0], prefixed);
      } else {
        addToClassMap(classMap, classKey(parsed.classes), prefixed);
        for (const cls of parsed.classes) {
          if (!classMap.has(cls)) classMap.set(cls, "");
        }
      }
    }
  });

  return classMap;
}

function writeTailwindModule(cssPath, classMap) {
  const dir = path.dirname(cssPath);
  const base = path.basename(cssPath, ".module.css");
  const outPath = path.join(dir, `${base}.tailwind.ts`);

  const entries = [...classMap.entries()].sort(([a], [b]) => a.localeCompare(b));
  const lines = entries.map(([key, value]) => {
    return `  ${safeObjectKey(key)}: ${JSON.stringify(value)},`;
  });

  const content = `/** Tailwind class map — converted from ${base}.module.css */\nconst styles: Record<string, string> = {\n${lines.join("\n")}\n};\nexport default styles;\n`;
  fs.writeFileSync(outPath, content);
  return outPath;
}

function updateTsxImports(srcRoot) {
  const exts = [".tsx", ".ts"];
  const files = [];

  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (exts.some((ext) => entry.name.endsWith(ext))) files.push(full);
    }
  }
  walk(srcRoot);

  for (const file of files) {
    let content = fs.readFileSync(file, "utf8");
    const original = content;
    content = content.replace(
      /import\s+(\w+)\s+from\s+["']([^"']+)\.module\.css["'];?/g,
      'import $1 from "$2.tailwind";'
    );
    if (content !== original) fs.writeFileSync(file, content);
  }
}

function removeCssModules(srcRoot) {
  const files = [];
  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name.endsWith(".module.css")) files.push(full);
    }
  }
  walk(srcRoot);
  for (const file of files) fs.unlinkSync(file);
}

function findCssModules(srcRoot) {
  const files = [];
  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name.endsWith(".module.css")) files.push(full);
    }
  }
  walk(srcRoot);
  return files;
}

function main() {
  const modules = findCssModules(SRC_ROOT);
  console.log(`Converting ${modules.length} CSS modules…`);

  let converted = 0;
  for (const cssPath of modules) {
    const classMap = convertCssModule(cssPath);
    if (classMap.size === 0) {
      console.warn(`  skip (empty): ${path.relative(SRC_ROOT, cssPath)}`);
      continue;
    }
    writeTailwindModule(cssPath, classMap);
    converted++;
  }

  updateTsxImports(SRC_ROOT);
  removeCssModules(SRC_ROOT);

  console.log(`Done — ${converted} modules converted to .tailwind.ts`);
}

main();
