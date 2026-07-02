import type { IconName } from "../../../icons";

export type BankCryptoView = "bank" | "crypto";

export interface BankNavItem {
  id: string;
  label: string;
  icon: IconName;
  active?: boolean;
  hasChildren?: boolean;
}

export interface BankAccount {
  id: string;
  name: string;
  suffix?: string;
  balance: string;
  icon: string;
  iconBg: string;
}

export interface BankMoneyMovementItem {
  id: string;
  label: string;
  amount: string;
}

export interface BankDashboardData {
  accountName: string;
  userName: string;
  totalBalance: string;
  balanceTrendUp: string;
  balanceTrendDown: string;
  balanceChart: number[];
  balanceChartLabels: string[];
  navItems: BankNavItem[];
  quickActions: { id: string; label: string; primary?: boolean }[];
  accounts: BankAccount[];
  moneyInTotal: string;
  moneyOutTotal: string;
  moneyInItems: BankMoneyMovementItem[];
  moneyOutItems: BankMoneyMovementItem[];
  periodLabel: string;
}

export interface CryptoAsset {
  id: string;
  name: string;
  symbol: string;
  price: string;
  balance: string;
  balanceUsd: string;
  icon: string;
  iconBg: string;
  changePercent?: string;
  changeUsd?: string;
  chart?: number[];
  activities?: CryptoActivity[];
}

export interface CryptoActivity {
  id: string;
  type: "sent" | "received";
  date: string;
  amount: string;
  amountUsd: string;
}

export interface CryptoWalletData {
  totalBalance: string;
  assets: CryptoAsset[];
}

export type CryptoChartPeriod = "1D" | "1W" | "1M" | "1Y" | "5Y" | "All";

export const CRYPTO_CHART_PERIODS: CryptoChartPeriod[] = ["1D", "1W", "1M", "1Y", "5Y", "All"];
