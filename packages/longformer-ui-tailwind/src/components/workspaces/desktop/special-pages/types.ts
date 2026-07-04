export type SpecialPageId =
  | "desktop"
  | "booting"
  | "loading"
  | "sign-in"
  | "upgrade"
  | "setup-wizard"
  | "error";

export interface SpecialPageOption {
  id: SpecialPageId;
  label: string;
}

export const SPECIAL_PAGE_OPTIONS: SpecialPageOption[] = [
  { id: "desktop", label: "Desktop" },
  { id: "booting", label: "Booting" },
  { id: "loading", label: "Loading" },
  { id: "sign-in", label: "Sign in" },
  { id: "upgrade", label: "Upgrade (Select Pricing)" },
  { id: "setup-wizard", label: "Setup Wizard" },
  { id: "error", label: "Error Page" },
];

export const SPECIAL_PAGE_LABEL: Record<SpecialPageId, string> = Object.fromEntries(
  SPECIAL_PAGE_OPTIONS.map((option) => [option.id, option.label]),
) as Record<SpecialPageId, string>;
