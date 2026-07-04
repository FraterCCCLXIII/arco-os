import type { WidgetContent } from "../desktop/widget-types";

export const BENTO_COLS = 24;
export const BENTO_ROW_HEIGHT_PX = 55;
export const BENTO_GAP_PX = 8;

export interface BentoItem {
  id: string;
  templateId: string;
  label: string;
  col: number;
  row: number;
  colSpan: number;
  rowSpan: number;
  content: WidgetContent;
}

export interface BentoWidgetTemplate {
  templateId: string;
  label: string;
  colSpan: number;
  rowSpan: number;
  content: WidgetContent;
}

export interface BentoGridMetrics {
  cols: number;
  rowHeight: number;
  gap: number;
  width: number;
}
