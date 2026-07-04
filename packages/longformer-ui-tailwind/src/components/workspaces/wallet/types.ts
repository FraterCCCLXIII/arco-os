import type { IconName } from "../../../icons";

export interface WalletExpense {
  id: string;
  merchant: string;
  category: string;
  amount: number;
  /** CSS color for the card background. */
  color: string;
  /** Short label for the merchant avatar (1–2 chars). */
  avatarLabel: string;
  /** Optional avatar image URL. */
  avatarSrc?: string;
  /** When the expense occurred — shown on the card and when selected. */
  dateLabel?: string;
  /** Optional note shown when the card is selected. */
  note?: string;
}

export interface WalletExpenseSettingsAction {
  id: string;
  label: string;
  icon?: IconName;
  danger?: boolean;
  onSelect?: (expenseId: string) => void;
}

export type WalletPeriodId = "week" | "month" | "year";

export interface WalletPeriodOption {
  id: WalletPeriodId;
  label: string;
}
