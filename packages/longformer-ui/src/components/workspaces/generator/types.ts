import type { GeneratedBlock, GeneratedSurfaceSchema } from "../generated-ui/types";

/** Catalog tier — atoms, cards, blocks, widgets, and collections. */
export type CatalogTier = "atom" | "card" | "block" | "widget" | "collection";

export interface CatalogItem {
  id: string;
  label: string;
  tier: CatalogTier;
  familyLabel?: string;
  blockType?: GeneratedBlock["type"];
  block?: GeneratedBlock;
  /** Atom gallery preview id when no generated block is attached. */
  componentPreviewId?: string;
}

export type ComposedUiKind =
  | "contact-form"
  | "login-form"
  | "newsletter"
  | "profile-settings"
  | "pricing-card"
  | "product-card";

export interface ComposedUiSchema {
  id: string;
  title: string;
  source: "local";
  kind: ComposedUiKind;
}

export type GeneratorResult =
  | { kind: "surface"; title: string; schema: GeneratedSurfaceSchema }
  | { kind: "composed"; title: string; schema: ComposedUiSchema }
  | { kind: "catalog"; title: string; item: CatalogItem };

export type GeneratorPreviewTab = "preview" | "schema";

export interface GeneratorWorkspaceData {
  examplePrompts: string[];
  defaultPrompt: string;
}
