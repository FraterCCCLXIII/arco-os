/**
 * Typed references to the CSS custom properties declared in `theme.css`.
 *
 * These are handy when a component needs to read/write a token from JS
 * (e.g. measuring a spacing value) but the source of truth always stays the
 * CSS file — nothing here hardcodes a color or size.
 */

export const space = {
  1: "var(--lf-space-1)",
  2: "var(--lf-space-2)",
  3: "var(--lf-space-3)",
  4: "var(--lf-space-4)",
  5: "var(--lf-space-5)",
  6: "var(--lf-space-6)",
  7: "var(--lf-space-7)",
  8: "var(--lf-space-8)",
} as const;

export const radius = {
  sm: "var(--lf-radius-sm)",
  md: "var(--lf-radius-md)",
  lg: "var(--lf-radius-lg)",
  xl: "var(--lf-radius-xl)",
  pill: "var(--lf-radius-pill)",
} as const;

export const color = {
  surfaceCanvas: "var(--lf-surface-canvas)",
  surface1: "var(--lf-surface-1)",
  surface2: "var(--lf-surface-2)",
  surface3: "var(--lf-surface-3)",
  surfaceOverlay: "var(--lf-surface-overlay)",
  surfaceSunken: "var(--lf-surface-sunken)",
  borderSubtle: "var(--lf-border-subtle)",
  borderDefault: "var(--lf-border-default)",
  borderStrong: "var(--lf-border-strong)",
  textPrimary: "var(--lf-text-primary)",
  textSecondary: "var(--lf-text-secondary)",
  textTertiary: "var(--lf-text-tertiary)",
  textDisabled: "var(--lf-text-disabled)",
  textOnAccent: "var(--lf-text-on-accent)",
  accent: "var(--lf-accent)",
  accentHover: "var(--lf-accent-hover)",
  accentActive: "var(--lf-accent-active)",
  accentMuted: "var(--lf-accent-muted)",
  success: "var(--lf-success)",
  warning: "var(--lf-warning)",
  danger: "var(--lf-danger)",
  info: "var(--lf-info)",
} as const;

export const fontSize = {
  xs: "var(--lf-font-size-xs)",
  sm: "var(--lf-font-size-sm)",
  md: "var(--lf-font-size-md)",
  base: "var(--lf-font-size-base)",
  lg: "var(--lf-font-size-lg)",
  xl: "var(--lf-font-size-xl)",
  "2xl": "var(--lf-font-size-2xl)",
} as const;

export const zIndex = {
  dropdown: "var(--lf-z-dropdown)",
  overlay: "var(--lf-z-overlay)",
  modal: "var(--lf-z-modal)",
  tooltip: "var(--lf-z-tooltip)",
  toast: "var(--lf-z-toast)",
} as const;

export type LongformerTheme = "dark" | "light";
