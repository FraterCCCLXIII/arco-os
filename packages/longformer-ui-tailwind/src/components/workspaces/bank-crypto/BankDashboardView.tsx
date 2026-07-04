import { useState } from "react";
import { Icon } from "../../../icons";
import { Avatar } from "../../primitives/Avatar";
import { cx } from "../../../utils/cx";
import type { BankDashboardData } from "./types";
import styles from "./BankDashboardView.tailwind";

export interface BankDashboardViewProps {
  data: BankDashboardData;
}

function BalanceChart({ values, labels }: { values: number[]; labels: string[] }) {
  const width = 480;
  const height = 120;
  const padX = 12;
  const padY = 16;
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = max - min || 1;

  const points = values
    .map((value, index) => {
      const x = padX + (index / Math.max(values.length - 1, 1)) * (width - padX * 2);
      const y = padY + (1 - (value - min) / range) * (height - padY * 2);
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className={styles.chartWrap}>
      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" aria-hidden="true">
        <polyline points={points} className={styles.chartLine} fill="none" />
      </svg>
      <div className={styles.chartLabels}>
        {labels.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
    </div>
  );
}

/** Mercury-inspired banking dashboard — balance chart, accounts, cash flow. */
export function BankDashboardView({ data }: BankDashboardViewProps) {
  const [chartMode, setChartMode] = useState<"chart" | "table">("chart");

  return (
    <div className={styles.dashboard}>
      <header className={styles.topBar}>
          <div className={styles.search}>
            <Icon name="search" size={16} />
            <span>Search or jump to</span>
            <kbd className={styles.kbd}>⌘ K</kbd>
          </div>
          <div className={styles.topActions}>
            <button type="button" className={styles.moveMoneyBtn}>
              Move Money
              <Icon name="chevron-down" size={14} />
            </button>
            <button type="button" className={styles.iconBtn} aria-label="Privacy mode">
              <Icon name="lock" size={16} />
            </button>
            <button type="button" className={styles.iconBtn} aria-label="Notifications">
              <Icon name="bell" size={16} />
            </button>
            <Avatar name={data.userName} size="sm" />
          </div>
        </header>

        <div className={styles.content}>
          <div className={styles.quickActions}>
            {data.quickActions.map((action) => (
              <button
                key={action.id}
                type="button"
                className={cx(styles.quickAction, action.primary && styles.quickActionPrimary)}
              >
                {action.label}
              </button>
            ))}
          </div>

          <div className={styles.grid}>
            <section className={styles.balanceCard}>
              <div className={styles.cardHeader}>
                <h2>Mercury Balance</h2>
                <div className={styles.viewToggle}>
                  <button
                    type="button"
                    className={cx(chartMode === "chart" && styles.viewToggleActive)}
                    onClick={() => setChartMode("chart")}
                    aria-label="Chart view"
                  >
                    <Icon name="grid" size={14} />
                  </button>
                  <button
                    type="button"
                    className={cx(chartMode === "table" && styles.viewToggleActive)}
                    onClick={() => setChartMode("table")}
                    aria-label="Table view"
                  >
                    <Icon name="list" size={14} />
                  </button>
                </div>
              </div>
              <div className={styles.balanceAmount}>{data.totalBalance}</div>
              <div className={styles.balanceMeta}>
                <span>Last 30 Days</span>
                <span className={styles.trendUp}>↗ {data.balanceTrendUp}</span>
                <span className={styles.trendDown}>↘ {data.balanceTrendDown}</span>
              </div>
              {chartMode === "chart" ? (
                <BalanceChart values={data.balanceChart} labels={data.balanceChartLabels} />
              ) : (
                <div className={styles.tablePlaceholder}>Balance history table</div>
              )}
            </section>

            <section className={styles.accountsCard}>
              <div className={styles.cardHeader}>
                <h2>Accounts</h2>
                <div className={styles.cardActions}>
                  <button type="button" className={styles.iconBtn} aria-label="Add account">
                    <Icon name="plus" size={14} />
                  </button>
                  <button type="button" className={styles.iconBtn} aria-label="Transfer">
                    <Icon name="arrow-up-right" size={14} />
                  </button>
                </div>
              </div>
              <ul className={styles.accountList}>
                {data.accounts.map((account) => (
                  <li key={account.id} className={styles.accountRow}>
                    <span className={styles.accountIcon} style={{ background: account.iconBg }}>
                      {account.icon}
                    </span>
                    <div className={styles.accountMeta}>
                      <span className={styles.accountName}>
                        {account.name}
                        {account.suffix && <span className={styles.accountSuffix}> {account.suffix}</span>}
                      </span>
                    </div>
                    <span className={styles.accountBalance}>{account.balance}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className={styles.movementCard}>
              <div className={styles.cardHeader}>
                <h2>Money movement</h2>
                <button type="button" className={styles.periodBtn}>
                  {data.periodLabel}
                  <Icon name="chevron-down" size={14} />
                </button>
              </div>
              <div className={styles.movementGrid}>
                <div className={styles.movementCol}>
                  <div className={styles.movementLabel}>Money in</div>
                  <div className={cx(styles.movementTotal, styles.movementIn)}>{data.moneyInTotal}</div>
                  <div className={styles.movementSubhead}>Top sources</div>
                  <ul className={styles.movementList}>
                    {data.moneyInItems.map((item) => (
                      <li key={item.id} className={styles.movementRow}>
                        <span>{item.label}</span>
                        <span>{item.amount}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={styles.movementCol}>
                  <div className={styles.movementLabel}>Money out</div>
                  <div className={styles.movementTotal}>{data.moneyOutTotal}</div>
                  <div className={styles.movementSubhead}>Top spend</div>
                  <ul className={styles.movementList}>
                    {data.moneyOutItems.map((item) => (
                      <li key={item.id} className={styles.movementRow}>
                        <span>{item.label}</span>
                        <span>{item.amount}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>
          </div>
        </div>
    </div>
  );
}
