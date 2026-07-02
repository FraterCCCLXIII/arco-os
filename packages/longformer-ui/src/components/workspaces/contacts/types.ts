export interface PhoneContact {
  id: string;
  name: string;
  avatarSrc?: string;
  phone: string;
  /** Display label for the number, e.g. "Mobile" / "Work". */
  phoneLabel?: string;
  email?: string;
  company?: string;
  title?: string;
  favorite?: boolean;
}

export type DialPadKey = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "*" | "#";

export const DIAL_PAD_KEYS: (DialPadKey | null)[][] = [
  ["1", "2", "3"],
  ["4", "5", "6"],
  ["7", "8", "9"],
  ["*", "0", "#"],
];

export const DIAL_PAD_LETTERS: Partial<Record<DialPadKey, string>> = {
  "2": "ABC",
  "3": "DEF",
  "4": "GHI",
  "5": "JKL",
  "6": "MNO",
  "7": "PQRS",
  "8": "TUV",
  "9": "WXYZ",
};
