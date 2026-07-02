import type { IconName } from "../../../icons";

export type CellValue = string | number;

export interface CellFormat {
  bold?: boolean;
  italic?: boolean;
  strikethrough?: boolean;
  align?: "left" | "center" | "right";
  numberFormat?: "plain" | "currency" | "percent";
  fill?: "none" | "accent" | "muted";
}

export interface Cell {
  value: CellValue;
  formula?: string;
  format?: CellFormat;
}

export type SheetCells = Record<string, Cell>;

export interface Sheet {
  id: string;
  name: string;
  cells: SheetCells;
  frozenRows?: number;
  frozenColumns?: number;
}

export interface Workbook {
  id: string;
  title: string;
  starred?: boolean;
  shared?: boolean;
  meta?: string;
  owner?: string;
  sheets: Sheet[];
}

export interface SheetsWorkspaceData {
  workbooks: Workbook[];
  collaborators?: { name: string; src?: string }[];
  menuItems?: string[];
}

export type SheetsLocation = "home" | "recent" | "starred" | "shared";

export interface CellSelection {
  col: number;
  row: number;
}

export const DEFAULT_COLUMN_COUNT = 18;
export const DEFAULT_ROW_COUNT = 48;
export const DEFAULT_COLUMN_WIDTH = 96;
export const ROW_HEADER_WIDTH = 46;
export const COLUMN_HEADER_HEIGHT = 24;

export function columnLabel(index: number): string {
  let label = "";
  let value = index;

  while (value >= 0) {
    label = String.fromCharCode(65 + (value % 26)) + label;
    value = Math.floor(value / 26) - 1;
  }

  return label;
}

export function cellAddress(col: number, row: number): string {
  return `${columnLabel(col)}${row + 1}`;
}

export function parseCellAddress(address: string): CellSelection | null {
  const match = /^([A-Z]+)(\d+)$/.exec(address.trim().toUpperCase());
  if (!match) return null;

  const [, letters, rowText] = match;
  let col = 0;

  for (let index = 0; index < letters.length; index += 1) {
    col = col * 26 + (letters.charCodeAt(index) - 64);
  }

  return { col: col - 1, row: Number.parseInt(rowText, 10) - 1 };
}

export function formatCellDisplay(cell: Cell | undefined): string {
  if (!cell) return "";

  const raw = cell.formula?.startsWith("=") ? cell.formula : String(cell.value ?? "");
  const format = cell.format?.numberFormat ?? "plain";

  if (format === "currency" && raw && !raw.startsWith("=")) {
    const numeric = Number(raw);
    if (!Number.isNaN(numeric)) {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }).format(numeric);
    }
  }

  if (format === "percent" && raw && !raw.startsWith("=")) {
    const numeric = Number(raw);
    if (!Number.isNaN(numeric)) {
      return `${numeric}%`;
    }
  }

  return raw;
}

export const SHEETS_MENU_ITEMS = [
  "File",
  "Edit",
  "View",
  "Insert",
  "Format",
  "Data",
  "Tools",
  "Extensions",
  "Help",
] as const;

export const SHEETS_TOOLBAR_GROUPS: {
  id: string;
  items: { id: string; icon: IconName; label: string }[];
}[] = [
  {
    id: "history",
    items: [
      { id: "undo", icon: "undo", label: "Undo" },
      { id: "redo", icon: "redo", label: "Redo" },
      { id: "copy", icon: "copy", label: "Copy" },
    ],
  },
  {
    id: "numbers",
    items: [
      { id: "currency", icon: "dollar-sign", label: "Format as currency" },
      { id: "percent", icon: "hash", label: "Format as percent" },
    ],
  },
  {
    id: "text",
    items: [
      { id: "bold", icon: "bold", label: "Bold" },
      { id: "italic", icon: "italic", label: "Italic" },
      { id: "strikethrough", icon: "strikethrough", label: "Strikethrough" },
    ],
  },
  {
    id: "align",
    items: [
      { id: "align-left", icon: "align-left", label: "Align left" },
      { id: "align-center", icon: "align-center", label: "Align center" },
      { id: "align-right", icon: "align-right", label: "Align right" },
    ],
  },
  {
    id: "insert",
    items: [
      { id: "link", icon: "link", label: "Insert link" },
      { id: "layers", icon: "layers", label: "Insert chart" },
    ],
  },
];
