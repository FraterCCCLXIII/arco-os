export type FinanceWidgetVariant =
  | "expenses"
  | "currentBalance"
  | "progress"
  | "subscription"
  | "performance"
  | "balance";

export interface FinanceWidgetExpenseSegment {
  label: string;
  percent: number;
  color: "teal" | "lavender" | "lime" | "orange";
}

export interface FinanceWidgetExpenses {
  variant: "expenses";
  tag?: string;
  period?: string;
  total: string;
  segments: FinanceWidgetExpenseSegment[];
}

export interface FinanceWidgetCurrentBalance {
  variant: "currentBalance";
  amount: string;
  change?: string;
  label?: string;
}

export interface FinanceWidgetProgress {
  variant: "progress";
  title?: string;
  value: string;
  pill?: string;
}

export interface FinanceWidgetSubscription {
  variant: "subscription";
  monthLabel?: string;
  count: string;
  totalLabel?: string;
  total: string;
  nextLabel?: string;
  nextPayment: string;
}

export interface FinanceWidgetPerformanceBar {
  value: number;
  label: string;
}

export interface FinanceWidgetPerformance {
  variant: "performance";
  tag?: string;
  headline: string;
  period?: string;
  bars: FinanceWidgetPerformanceBar[];
  footerLabel?: string;
}

export interface FinanceWidgetBalanceSeries {
  id: string;
  color: "teal" | "lavender";
  label: string;
  percent: string;
  values: number[];
}

export interface FinanceWidgetBalance {
  variant: "balance";
  title?: string;
  period?: "weekly" | "monthly";
  highlightValue: string;
  highlightUnit?: string;
  series: FinanceWidgetBalanceSeries[];
  chartLabels?: string[];
  tooltip?: { label: string; value: string };
}

export type FinanceWidgetProps = (
  | FinanceWidgetExpenses
  | FinanceWidgetCurrentBalance
  | FinanceWidgetProgress
  | FinanceWidgetSubscription
  | FinanceWidgetPerformance
  | FinanceWidgetBalance
) & {
  className?: string;
  bleed?: boolean;
};
