import { Icon } from "../../../icons";
import { Avatar } from "../../primitives/Avatar";
import { NavSidebar } from "../../shell/NavSidebar";
import { cx } from "../../../utils/cx";
import type { BankCryptoView, BankDashboardData } from "./types";
import styles from "./FinanceSidebar.tailwind";

export interface FinanceSidebarProps {
  data: BankDashboardData;
  view: BankCryptoView;
  onViewChange: (view: BankCryptoView) => void;
}

/** Left nav — Bank/Crypto switch, account picker, and section links. */
export function FinanceSidebar({ data, view, onViewChange }: FinanceSidebarProps) {
  return (
    <NavSidebar
      className={styles.sidebar}
      header={
        <>
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
        </>
      }
      sections={[
        {
          id: "nav",
          items: data.navItems.map((item) => ({
            id: item.id,
            label: item.label,
            leading: <Icon name={item.icon} size={16} />,
            trailing: item.hasChildren ? <Icon name="chevron-down" size={14} /> : undefined,
            active: item.active,
          })),
        },
      ]}
    />
  );
}
