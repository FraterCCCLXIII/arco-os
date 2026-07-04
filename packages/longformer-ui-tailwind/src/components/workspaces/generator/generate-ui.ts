import type { GeneratedSurfaceSchema } from "../generated-ui/types";
import type { ComposedUiKind, ComposedUiSchema, GeneratorResult } from "./types";

function titleFromPrompt(prompt: string): string {
  const trimmed = prompt.trim();
  if (!trimmed) return "Generated UI";
  const words = trimmed.split(/\s+/).slice(0, 4);
  return words.map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
}

function matches(prompt: string, keywords: string[]): boolean {
  const normalized = prompt.toLowerCase();
  return keywords.some((keyword) => normalized.includes(keyword));
}

function contactFormSchema(prompt: string): ComposedUiSchema {
  return {
    id: `composed-${Date.now().toString(36)}`,
    title: titleFromPrompt(prompt) || "Contact Form",
    source: "local",
    kind: "contact-form",
  };
}

function loginFormSchema(prompt: string): ComposedUiSchema {
  return {
    id: `composed-${Date.now().toString(36)}`,
    title: titleFromPrompt(prompt) || "Login Form",
    source: "local",
    kind: "login-form",
  };
}

function newsletterSchema(prompt: string): ComposedUiSchema {
  return {
    id: `composed-${Date.now().toString(36)}`,
    title: titleFromPrompt(prompt) || "Newsletter Signup",
    source: "local",
    kind: "newsletter",
  };
}

function profileSettingsSchema(prompt: string): ComposedUiSchema {
  return {
    id: `composed-${Date.now().toString(36)}`,
    title: titleFromPrompt(prompt) || "Profile Settings",
    source: "local",
    kind: "profile-settings",
  };
}

function pricingCardSchema(prompt: string): ComposedUiSchema {
  return {
    id: `composed-${Date.now().toString(36)}`,
    title: titleFromPrompt(prompt) || "Pricing Card",
    source: "local",
    kind: "pricing-card",
  };
}

function productCardSurface(): GeneratedSurfaceSchema {
  return {
    id: `surface-${Date.now().toString(36)}`,
    blocks: [
      {
        id: "product-listing",
        type: "listingCards",
        title: "Product",
        cards: [
          {
            id: "headphones",
            title: "Wireless Headphones",
            subtitle: "Noise-cancelling · 30h battery",
            price: "$249",
            priceMeta: "Free shipping",
            actionLabel: "Add to cart",
            icon: "play",
            tags: ["Audio", "Featured"],
          },
        ],
      },
    ],
  };
}

function statCardsSurface(prompt: string): GeneratedSurfaceSchema {
  return {
    id: `surface-${Date.now().toString(36)}`,
    blocks: [
      {
        id: "kpi-row",
        type: "statCards",
        title: titleFromPrompt(prompt),
        cards: [
          { id: "mrr", label: "MRR", value: "$48.2k", caption: "+12% MoM", icon: "dollar-sign", tone: "accent" },
          { id: "users", label: "Active users", value: "12,480", caption: "+4.1%", icon: "users", tone: "success" },
          { id: "churn", label: "Churn", value: "1.8%", caption: "-0.3%", icon: "refresh", tone: "warning" },
        ],
      },
    ],
  };
}

function defaultSurface(prompt: string): GeneratedSurfaceSchema {
  return {
    id: `surface-${Date.now().toString(36)}`,
    blocks: [
      {
        id: "hero",
        type: "text",
        text: titleFromPrompt(prompt),
        tone: "heading",
      },
      {
        id: "body",
        type: "text",
        text: "Generated from your prompt using Longformer blocks and primitives.",
        tone: "muted",
      },
      {
        id: "stats",
        type: "statCards",
        cards: [
          { id: "one", label: "Blocks", value: "59", icon: "layers" },
          { id: "two", label: "Atoms", value: "90+", icon: "grid" },
        ],
      },
    ],
  };
}

function resolveComposedKind(prompt: string): ComposedUiKind | null {
  if (matches(prompt, ["login", "sign in", "sign-in", "password"])) return "login-form";
  if (matches(prompt, ["contact", "message", "get in touch"])) return "contact-form";
  if (matches(prompt, ["newsletter", "subscribe", "signup", "sign up"])) return "newsletter";
  if (matches(prompt, ["profile", "settings", "avatar", "account"])) return "profile-settings";
  if (matches(prompt, ["pricing", "plan", "subscription", "pro plan", "cta"])) return "pricing-card";
  return null;
}

/** Local prompt matcher that assembles schema-backed UI without a live model. */
export function generateFromPrompt(prompt: string): GeneratorResult {
  const trimmed = prompt.trim();
  const title = titleFromPrompt(trimmed);

  if (matches(trimmed, ["headphones", "product card", "add to cart", "wireless"])) {
    return { kind: "surface", title: title || "Product Card", schema: productCardSurface() };
  }

  const composedKind = resolveComposedKind(trimmed);
  if (composedKind) {
    const schemaBuilders: Record<ComposedUiKind, (value: string) => ComposedUiSchema> = {
      "contact-form": contactFormSchema,
      "login-form": loginFormSchema,
      newsletter: newsletterSchema,
      "profile-settings": profileSettingsSchema,
      "pricing-card": pricingCardSchema,
      "product-card": () => ({
        id: `composed-${Date.now().toString(36)}`,
        title: title || "Product Card",
        source: "local",
        kind: "product-card",
      }),
    };
    return { kind: "composed", title: title, schema: schemaBuilders[composedKind](trimmed) };
  }

  if (matches(trimmed, ["dashboard", "kpi", "metric", "analytics", "chart"])) {
    return { kind: "surface", title, schema: statCardsSurface(trimmed) };
  }

  if (matches(trimmed, ["form"])) {
    return { kind: "composed", title, schema: contactFormSchema(trimmed) };
  }

  return { kind: "surface", title, schema: defaultSurface(trimmed) };
}
