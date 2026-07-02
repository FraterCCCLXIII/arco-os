import type { BankingWidgetProps } from "../BankingWidget";
import type { FinanceWidgetProps } from "../FinanceWidget";
import type { FitnessWidgetProps } from "../FitnessWidget";

export type CardCollectionLayout =
  | "grid"
  | "denseGrid"
  | "wideGrid"
  | "carousel"
  | "snapCarousel"
  | "featured"
  | "bento"
  | "strip";

export type CardCollectionSpan = "normal" | "wide" | "tall" | "hero";

export type CardCollectionItem =
  | ({ id: string; kind: "banking"; span?: CardCollectionSpan } & BankingWidgetProps)
  | ({ id: string; kind: "finance"; span?: CardCollectionSpan } & FinanceWidgetProps)
  | ({ id: string; kind: "fitness"; span?: CardCollectionSpan } & FitnessWidgetProps);

export interface CardCollectionProps {
  layout: CardCollectionLayout;
  items: CardCollectionItem[];
  itemHeight?: number;
  className?: string;
}
