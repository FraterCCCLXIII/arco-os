import { useMemo, useState } from "react";
import { Icon } from "../../../icons";
import { cx } from "../../../utils/cx";
import { ScrollArea } from "../../primitives/ScrollArea";
import { Menu, type MenuItemDescriptor } from "../../primitives/Menu";
import { IconButton } from "../../primitives/IconButton";
import { EmptyState } from "../../primitives/EmptyState";
import { WalletCard } from "./WalletCard";
import type {
  WalletExpense,
  WalletExpenseSettingsAction,
  WalletPeriodId,
  WalletPeriodOption,
} from "./types";
import styles from "./WalletWorkspace.tailwind";

export interface WalletWorkspaceProps {
  title?: string;
  expenses: WalletExpense[];
  periods?: WalletPeriodOption[];
  activePeriodId?: WalletPeriodId;
  defaultPeriodId?: WalletPeriodId;
  onPeriodChange?: (periodId: WalletPeriodId) => void;
  selectedExpenseId?: string | null;
  defaultSelectedExpenseId?: string | null;
  onSelectedExpenseChange?: (id: string | null) => void;
  expenseSettingsItems?: WalletExpenseSettingsAction[];
  onExpenseSettingsAction?: (actionId: string, expenseId: string) => void;
}

const DEFAULT_PERIODS: WalletPeriodOption[] = [
  { id: "week", label: "This week" },
  { id: "month", label: "This month" },
  { id: "year", label: "This year" },
];

const CARD_HEIGHT = 168;
const CARD_STEP = 88;
const CARD_EXPANDED_HEIGHT = 236;

/** Expenses view with overlapping color cards stacked like a physical wallet. */
export function WalletWorkspace({
  title = "Expenses",
  expenses,
  periods = DEFAULT_PERIODS,
  activePeriodId: controlledPeriodId,
  defaultPeriodId = "month",
  onPeriodChange,
  selectedExpenseId: controlledSelectedId,
  defaultSelectedExpenseId = null,
  onSelectedExpenseChange,
  expenseSettingsItems,
  onExpenseSettingsAction,
}: WalletWorkspaceProps) {
  const [internalPeriodId, setInternalPeriodId] = useState<WalletPeriodId>(defaultPeriodId);
  const [internalSelectedId, setInternalSelectedId] = useState<string | null>(defaultSelectedExpenseId);

  const activePeriodId = controlledPeriodId ?? internalPeriodId;
  const selectedExpenseId = controlledSelectedId ?? internalSelectedId;
  const activePeriod = periods.find((period) => period.id === activePeriodId) ?? periods[0];
  const selectedExpense = expenses.find((expense) => expense.id === selectedExpenseId) ?? null;
  const hasSelection = Boolean(selectedExpenseId);

  const periodMenuItems = useMemo<MenuItemDescriptor[]>(
    () =>
      periods.map((period) => ({
        id: period.id,
        label: period.label,
        onSelect: () => {
          if (onPeriodChange) onPeriodChange(period.id);
          else setInternalPeriodId(period.id);
        },
      })),
    [onPeriodChange, periods],
  );

  function handleSelectExpense(id: string) {
    const next = selectedExpenseId === id ? null : id;
    if (onSelectedExpenseChange) onSelectedExpenseChange(next);
    else setInternalSelectedId(next);
  }

  const selectedIndex = expenses.findIndex((expense) => expense.id === selectedExpenseId);
  const expansionPush = CARD_EXPANDED_HEIGHT - CARD_HEIGHT;

  const stackHeight =
    expenses.length > 0
      ? CARD_HEIGHT +
        (expenses.length - 1) * CARD_STEP +
        (hasSelection ? expansionPush + 8 : 0) +
        48
      : 320;

  return (
    <div className={styles.workspace}>
      <header className={styles.header}>
        <Menu
          trigger={
            <button type="button" className={styles.titleButton}>
              <h1 className={styles.title}>{title}</h1>
              <Icon name="chevron-down" size={18} className={styles.titleChevron} />
            </button>
          }
          items={periodMenuItems}
          align="start"
        />
        <div className={styles.headerActions}>
          {hasSelection && (
            <button
              type="button"
              className={styles.clearSelection}
              onClick={() => {
                if (onSelectedExpenseChange) onSelectedExpenseChange(null);
                else setInternalSelectedId(null);
              }}
            >
              Clear selection
            </button>
          )}
          <IconButton icon="wallet" label="Wallet options" size="sm" />
        </div>
      </header>

      <ScrollArea className={styles.scroll}>
        <div className={styles.phoneFrame}>
          {expenses.length === 0 ? (
            <EmptyState
              className={styles.empty}
              icon={<Icon name="wallet" size={24} />}
              title="No expenses yet"
              description="Transactions you track will stack here like cards in a wallet."
            />
          ) : (
            <>
              <div
                className={cx(styles.stack, hasSelection && styles.stackHasSelection)}
                style={{ minHeight: stackHeight }}
              >
                {expenses.map((expense, index) => (
                  <WalletCard
                    key={expense.id}
                    expense={expense}
                    stackIndex={index}
                    selected={selectedExpenseId === expense.id}
                    dimmed={hasSelection && selectedExpenseId !== expense.id}
                    pushDown={
                      hasSelection && selectedIndex >= 0 && index > selectedIndex ? expansionPush : 0
                    }
                    settingsItems={expenseSettingsItems}
                    onSelect={handleSelectExpense}
                    onSettingsAction={onExpenseSettingsAction}
                  />
                ))}
              </div>

              {selectedExpense && (
                <div className={styles.selectionBar} role="status">
                  <div className={styles.selectionMeta}>
                    <span className={styles.selectionLabel}>Selected</span>
                    <strong>{selectedExpense.merchant}</strong>
                    <span className={styles.selectionAmount}>
                      -$
                      {Number.isInteger(selectedExpense.amount)
                        ? selectedExpense.amount
                        : selectedExpense.amount.toFixed(2)}
                    </span>
                  </div>
                  <IconButton
                    icon="close"
                    label="Deselect expense"
                    size="sm"
                    onClick={() => {
                      if (onSelectedExpenseChange) onSelectedExpenseChange(null);
                      else setInternalSelectedId(null);
                    }}
                  />
                </div>
              )}
            </>
          )}

          {activePeriod && expenses.length > 0 && !hasSelection && (
            <div className={styles.periodHint}>{activePeriod.label}</div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

export type { WalletExpense, WalletPeriodId, WalletPeriodOption, WalletExpenseSettingsAction };
