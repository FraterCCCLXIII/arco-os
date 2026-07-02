export type BankingWidgetVariant =
  | "monthlyRevenue"
  | "transactions"
  | "exchange"
  | "cryptoList"
  | "pricingPlans"
  | "creditCard"
  | "familySaving";

export interface BankingWidgetMonthlyRevenue {
  variant: "monthlyRevenue";
  title?: string;
  amount: string;
  period?: string;
  thisMonth: number[];
  previousMonth: number[];
  weekLabels?: string[];
}

export interface BankingWidgetTransaction {
  id: string;
  title: string;
  date: string;
  amount: string;
  icon?: string;
}

export interface BankingWidgetTransactions {
  variant: "transactions";
  title?: string;
  groups: { label: string; items: BankingWidgetTransaction[] }[];
}

export interface BankingWidgetExchange {
  variant: "exchange";
  title?: string;
  pair?: string;
  amount: string;
  available?: string;
  rate?: string;
  tax?: string;
  fee?: string;
  total?: string;
  actionLabel?: string;
  disclaimer?: string;
}

export interface BankingWidgetCryptoAsset {
  id: string;
  name: string;
  symbol: string;
  price?: string;
  change?: string;
  about?: string;
  expanded?: boolean;
}

export interface BankingWidgetCryptoList {
  variant: "cryptoList";
  assets: BankingWidgetCryptoAsset[];
}

export interface BankingWidgetPlan {
  id: string;
  name: string;
  price: string;
  period?: string;
  description: string;
  highlighted?: boolean;
  actionLabel?: string;
}

export interface BankingWidgetPricingPlans {
  variant: "pricingPlans";
  title?: string;
  period?: "monthly" | "yearly";
  plans: BankingWidgetPlan[];
}

export interface BankingWidgetCreditCard {
  variant: "creditCard";
  title?: string;
  number: string;
  brand?: string;
  name: string;
  expiry: string;
  transactionLimit?: string;
  dailyLimit?: string;
}

export interface BankingWidgetFamilySaving {
  variant: "familySaving";
  title?: string;
  amount: string;
  subtitle?: string;
  values: number[];
  highlightIndex?: number;
  tooltip?: { label: string; value: string };
}

export type BankingWidgetProps = (
  | BankingWidgetMonthlyRevenue
  | BankingWidgetTransactions
  | BankingWidgetExchange
  | BankingWidgetCryptoList
  | BankingWidgetPricingPlans
  | BankingWidgetCreditCard
  | BankingWidgetFamilySaving
) & {
  className?: string;
  bleed?: boolean;
};
