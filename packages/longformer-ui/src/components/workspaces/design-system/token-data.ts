export interface TokenSwatch {
  name: string;
  variable: string;
  description?: string;
}

export interface TokenScale {
  name: string;
  variable: string;
  value: string;
}

export const TYPOGRAPHY_TOKENS = {
  families: [
    { name: "Sans", variable: "--lf-font-family", sample: "The quick brown fox jumps over the lazy dog." },
    { name: "Mono", variable: "--lf-font-mono", sample: "const surface = render(schema);" },
    { name: "Dot matrix", variable: "--lf-font-dot-matrix", sample: "0123456789 STEPS" },
    { name: "Banking", variable: "--lf-font-banking", sample: "$12,890.67 monthly revenue" },
  ] as const,
  sizes: [
    { name: "xs", variable: "--lf-font-size-xs", sample: "Caption and meta labels" },
    { name: "sm", variable: "--lf-font-size-sm", sample: "Secondary UI text" },
    { name: "md", variable: "--lf-font-size-md", sample: "Sidebar and compact body" },
    { name: "base", variable: "--lf-font-size-base", sample: "Default body copy" },
    { name: "lg", variable: "--lf-font-size-lg", sample: "Section headings" },
    { name: "xl", variable: "--lf-font-size-xl", sample: "Page titles" },
    { name: "2xl", variable: "--lf-font-size-2xl", sample: "Hero metrics" },
  ] as const,
  lineHeights: [
    { name: "Tight", variable: "--lf-line-height-tight", value: "1.25" },
    { name: "Normal", variable: "--lf-line-height-normal", value: "1.5" },
  ] as const,
};

export const COLOR_GROUPS: { title: string; tokens: TokenSwatch[] }[] = [
  {
    title: "Surfaces",
    tokens: [
      { name: "Canvas", variable: "--lf-surface-canvas", description: "App background" },
      { name: "Surface 1", variable: "--lf-surface-1", description: "Primary panels" },
      { name: "Surface 2", variable: "--lf-surface-2", description: "Hover / secondary" },
      { name: "Surface 3", variable: "--lf-surface-3", description: "Tertiary fill" },
      { name: "Overlay", variable: "--lf-surface-overlay", description: "Popovers & menus" },
      { name: "Sunken", variable: "--lf-surface-sunken", description: "Recessed areas" },
      { name: "Glass", variable: "--lf-surface-glass", description: "Translucent chrome" },
    ],
  },
  {
    title: "Text",
    tokens: [
      { name: "Primary", variable: "--lf-text-primary" },
      { name: "Secondary", variable: "--lf-text-secondary" },
      { name: "Tertiary", variable: "--lf-text-tertiary" },
      { name: "Disabled", variable: "--lf-text-disabled" },
      { name: "On accent", variable: "--lf-text-on-accent" },
    ],
  },
  {
    title: "Brand & semantic",
    tokens: [
      { name: "Accent", variable: "--lf-accent" },
      { name: "Accent muted", variable: "--lf-accent-muted" },
      { name: "Success", variable: "--lf-success" },
      { name: "Warning", variable: "--lf-warning" },
      { name: "Danger", variable: "--lf-danger" },
      { name: "Info", variable: "--lf-info" },
    ],
  },
  {
    title: "Borders & focus",
    tokens: [
      { name: "Border subtle", variable: "--lf-border-subtle" },
      { name: "Border default", variable: "--lf-border-default" },
      { name: "Border strong", variable: "--lf-border-strong" },
      { name: "Focus ring", variable: "--lf-focus-ring" },
    ],
  },
];

export const SPACING_SCALE: TokenScale[] = [
  { name: "1", variable: "--lf-space-1", value: "4px" },
  { name: "2", variable: "--lf-space-2", value: "8px" },
  { name: "3", variable: "--lf-space-3", value: "12px" },
  { name: "4", variable: "--lf-space-4", value: "16px" },
  { name: "5", variable: "--lf-space-5", value: "20px" },
  { name: "6", variable: "--lf-space-6", value: "24px" },
  { name: "7", variable: "--lf-space-7", value: "32px" },
  { name: "8", variable: "--lf-space-8", value: "40px" },
];

export const RADIUS_SCALE: TokenScale[] = [
  { name: "sm", variable: "--lf-radius-sm", value: "6px" },
  { name: "md", variable: "--lf-radius-md", value: "8px" },
  { name: "lg", variable: "--lf-radius-lg", value: "12px" },
  { name: "xl", variable: "--lf-radius-xl", value: "16px" },
  { name: "pill", variable: "--lf-radius-pill", value: "999px" },
];

export const SHADOW_SCALE: TokenScale[] = [
  { name: "sm", variable: "--lf-shadow-sm", value: "Subtle lift" },
  { name: "md", variable: "--lf-shadow-md", value: "Cards & panels" },
  { name: "lg", variable: "--lf-shadow-lg", value: "Floating trays" },
  { name: "overlay", variable: "--lf-shadow-overlay", value: "Modals & hover cards" },
];

export const MOTION_TOKENS: TokenScale[] = [
  { name: "Ease", variable: "--lf-ease", value: "cubic-bezier(0.2, 0, 0, 1)" },
  { name: "Fast", variable: "--lf-duration-fast", value: "120ms" },
  { name: "Normal", variable: "--lf-duration-normal", value: "180ms" },
];
