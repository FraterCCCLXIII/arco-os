import { Icon } from "../../../icons";
import { Avatar } from "../../primitives/Avatar";
import { cx } from "../../../utils/cx";
import type { BankCryptoView, BankDashboardData } from "./types";
import styles from "./FinanceSidebar.module.css";

export interface FinanceSidebarProps {
  data: BankDashboardData;
  view: BankCryptoView;
  onViewChange: (view: BankCryptoView) => void;
}

/** Left nav — Bank/Crypto switch, account picker, and section links. */
export function FinanceSidebar({ data, view, onViewChange }: FinanceSidebarProps) {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.viewToggle} role="tablist" aria-label="Finance view">
        <button
          type="button"
          role="tab"
          aria-selected={view === "bank"}
          className={cx(styles.viewBtn, view === "bank" && styles.viewBtnActive)}
          onClick={() => onViewChange("bank")}
        >
          <Icon name="home" size={15} />
          Bank
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={view === "crypto"}
          className={cx(styles.viewBtn, view === "crypto" && styles.viewBtnActive)}
          onClick={() => onViewChange("crypto")}
        >
          <Icon name="smartphone" size={15} />
          Crypto
        </button>
      </div>

      <button type="button" className={styles.accountPicker}>
        <Avatar name={data.accountName} size="sm" />
        <span>{data.accountName}</span>
        <Icon name="chevron-down" size={14} />
      </button>

      <nav className={styles.nav}>
        {data.navItems.map((item) => (
          <button
            key={item.id}
            type="button"
            className={cx(styles.navItem, item.active && styles.navItemActive)}
          >
            <Icon name={item.icon} size={16} />
            <span>{item.label}</span>
            {item.hasChildren && <Icon name="chevron-down" size={14} className={styles.navChevron} />}
          </button>
        ))}
      </nav>
    </aside>
  );
}
