import { BankingWidget, type BankingWidgetProps } from "../BankingWidget";
import { FinanceWidget, type FinanceWidgetProps } from "../FinanceWidget";
import { FitnessWidget, type FitnessWidgetProps } from "../FitnessWidget";
import type { CardCollectionItem } from "./types";

export function DashboardWidgetCard({ item, bleed = false }: { item: CardCollectionItem; bleed?: boolean }) {
  switch (item.kind) {
    case "banking": {
      const { id: _id, kind: _kind, span: _span, ...props } = item as Extract<CardCollectionItem, { kind: "banking" }>;
      return <BankingWidget {...(props as BankingWidgetProps)} bleed={bleed} />;
    }
    case "finance": {
      const { id: _id, kind: _kind, span: _span, ...props } = item as Extract<CardCollectionItem, { kind: "finance" }>;
      return <FinanceWidget {...(props as FinanceWidgetProps)} bleed={bleed} />;
    }
    case "fitness": {
      const { id: _id, kind: _kind, span: _span, ...props } = item as Extract<CardCollectionItem, { kind: "fitness" }>;
      return <FitnessWidget {...(props as FitnessWidgetProps)} bleed={bleed} />;
    }
    default:
      return null;
  }
}
