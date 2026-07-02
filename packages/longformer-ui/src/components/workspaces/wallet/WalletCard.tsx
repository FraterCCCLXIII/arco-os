import type { KeyboardEvent } from "react";
import { Avatar } from "../../primitives/Avatar";
import { IconButton } from "../../primitives/IconButton";
import { Menu, type MenuItemDescriptor } from "../../primitives/Menu";
import { Icon } from "../../../icons";
import { cx } from "../../../utils/cx";
import type { WalletExpense, WalletExpenseSettingsAction } from "./types";
import styles from "./WalletCard.module.css";

export interface WalletCardProps {
  expense: WalletExpense;
  /** Stack position — later items layer on top, tucking under the card above. */
  stackIndex: number;
  selected?: boolean;
  dimmed?: boolean;
  /** Extra top margin when a card above expands — keeps the stack from overlapping. */
  pushDown?: number;
  settingsItems?: WalletExpenseSettingsAction[];
  onSelect?: (id: string) => void;
  onSettingsAction?: (actionId: string, expenseId: string) => void;
  className?: string;
}

const DEFAULT_SETTINGS: WalletExpenseSettingsAction[] = [
  { id: "edit", label: "Edit expense", icon: "edit" },
  { id: "category", label: "Change category", icon: "layers" },
  { id: "hide", label: "Hide from wallet", icon: "minus" },
  { id: "delete", label: "Delete", icon: "trash", danger: true },
];

function formatAmount(amount: number) {
  const formatted = Number.isInteger(amount) ? amount.toString() : amount.toFixed(2);
  return `-$${formatted}`;
}

/** A single expense tile in the wallet stack — rounded, color-coded, overlapping siblings. */
export function WalletCard({
  expense,
  stackIndex,
  selected = false,
  dimmed = false,
  pushDown = 0,
  settingsItems = DEFAULT_SETTINGS,
  onSelect,
  onSettingsAction,
  className,
}: WalletCardProps) {
  const menuItems: MenuItemDescriptor[] = settingsItems.map((action, index) => ({
    id: action.id,
    label: action.label,
    icon: action.icon,
    danger: action.danger,
    separatorAbove: action.danger && index > 0,
    onSelect: () => {
      action.onSelect?.(expense.id);
      onSettingsAction?.(action.id, expense.id);
    },
  }));

  function handleSelect() {
    onSelect?.(expense.id);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleSelect();
    }
  }

  const stackMarginTop =
    stackIndex === 0
      ? undefined
      : pushDown > 0
        ? `calc(var(--wallet-card-step) - var(--wallet-card-height) + ${pushDown}px)`
        : undefined;

  return (
    <article
      className={cx(
        styles.card,
        selected && styles.cardSelected,
        dimmed && styles.cardDimmed,
        className,
      )}
      style={{
        background: expense.color,
        zIndex: selected ? 1000 : dimmed ? 1 : stackIndex + 1,
        marginTop: stackMarginTop,
      }}
      data-selected={selected || undefined}
    >
      <div className={styles.settingsWrap}>
        <Menu
          trigger={
            <IconButton
              icon="settings"
              label={`Settings for ${expense.merchant}`}
              size="sm"
              className={styles.settingsButton}
              onClick={(event) => event.stopPropagation()}
            />
          }
          items={menuItems}
          align="end"
          aria-label={`${expense.merchant} options`}
        />
      </div>

      <div className={styles.cardBody}>
        <button
          type="button"
          className={styles.cardSelect}
          aria-pressed={selected}
          aria-label={`${expense.merchant}, ${formatAmount(expense.amount)}`}
          onClick={handleSelect}
          onKeyDown={handleKeyDown}
        >
          <div className={styles.meta}>
            <Avatar name={expense.avatarLabel} src={expense.avatarSrc} size="sm" className={styles.avatar} />
            <span className={styles.category}>{expense.category}</span>
          </div>

          <h3 className={styles.merchant}>{expense.merchant}</h3>

          <div className={styles.footer}>
            {selected && expense.dateLabel && <span className={styles.date}>{expense.dateLabel}</span>}
            <span className={styles.amount}>{formatAmount(expense.amount)}</span>
          </div>
        </button>

        {selected && (
          <div className={styles.expanded}>
            {expense.note && <p className={styles.note}>{expense.note}</p>}
            <div className={styles.quickActions}>
              <button
                type="button"
                className={styles.quickAction}
                onClick={() => onSettingsAction?.("edit", expense.id)}
              >
                <Icon name="edit" size={13} />
                Edit
              </button>
              <button
                type="button"
                className={styles.quickAction}
                onClick={() => onSettingsAction?.("category", expense.id)}
              >
                <Icon name="layers" size={13} />
                Recategorize
              </button>
              <button
                type="button"
                className={styles.quickAction}
                onClick={() => onSettingsAction?.("hide", expense.id)}
              >
                <Icon name="more-horizontal" size={13} />
                More
              </button>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
