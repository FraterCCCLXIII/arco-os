import { cx } from "../../../utils/cx";
import { Icon } from "../../../icons";
import { BankingWidgetShell } from "./BankingWidgetShell";
import styles from "./BankingWidget.tailwind";
import type { BankingWidgetProps } from "./types";

function LineChartDual({
  seriesA,
  seriesB,
  labels,
  light,
}: {
  seriesA: number[];
  seriesB: number[];
  labels: string[];
  light?: boolean;
}) {
  const width = 220;
  const height = 72;
  const padX = 8;
  const padY = 8;
  const all = [...seriesA, ...seriesB];
  const max = Math.max(...all, 1);
  const min = Math.min(...all, 0);
  const range = max - min || 1;

  function points(values: number[]) {
    return values
      .map((value, index) => {
        const x = padX + (index / Math.max(values.length - 1, 1)) * (width - padX * 2);
        const y = padY + (1 - (value - min) / range) * (height - padY * 2);
        return `${x},${y}`;
      })
      .join(" ");
  }

  return (
    <div className={styles.lineChart}>
      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" aria-hidden="true">
        <polyline points={points(seriesB)} className={cx(styles.lineGold, light && styles.lineGoldDark)} fill="none" />
        <polyline points={points(seriesA)} className={cx(styles.lineWhite, light && styles.lineWhiteDark)} fill="none" />
      </svg>
      <div className={styles.lineLabels}>
        {labels.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
    </div>
  );
}

function DotBars({ values, highlightIndex, tooltip }: { values: number[]; highlightIndex?: number; tooltip?: { label: string; value: string } }) {
  const max = Math.max(...values, 1);
  return (
    <div className={styles.dotBarsWrap}>
      <div className={styles.dotBars}>
        {values.map((value, index) => {
          const dots = Math.max(2, Math.round((value / max) * 8));
          const active = index === highlightIndex;
          return (
            <div key={index} className={cx(styles.dotBarCol, active && styles.dotBarColActive)}>
              {Array.from({ length: dots }).map((_, dotIndex) => (
                <span key={dotIndex} className={styles.dotBarDot} />
              ))}
            </div>
          );
        })}
      </div>
      {tooltip && highlightIndex !== undefined && (
        <div className={styles.dotBarTooltip} style={{ left: `${((highlightIndex + 0.5) / values.length) * 100}%` }}>
          <span>{tooltip.label}</span>
          <strong>{tooltip.value}</strong>
        </div>
      )}
    </div>
  );
}

/** Banking dashboard cards — Space Grotesk, purple/lime/black surfaces. */
export function BankingWidget(props: BankingWidgetProps) {
  const { className, bleed = true } = props;

  switch (props.variant) {
    case "monthlyRevenue":
      return (
        <BankingWidgetShell className={cx(styles.monthlyRevenue, className)} surface="purple" chamfer bleed={bleed}>
          <div className={styles.cardTitle}>{props.title ?? "Monthly Revenue"}</div>
          <div className={styles.heroAmount}>{props.amount}</div>
          {props.period && <div className={styles.cardMeta}>{props.period}</div>}
          <LineChartDual
            seriesA={props.thisMonth}
            seriesB={props.previousMonth}
            labels={props.weekLabels ?? ["W1", "W2", "W3", "W4"]}
            light
          />
          <div className={styles.legendRow}>
            <span><i className={styles.legendDotWhite} /> This month</span>
            <span><i className={styles.legendDotGold} /> Previous month</span>
          </div>
        </BankingWidgetShell>
      );

    case "transactions":
      return (
        <BankingWidgetShell className={cx(styles.transactions, className)} surface="lime" bleed={bleed}>
          <div className={styles.cardTitle}>{props.title ?? "Latest Transactions"}</div>
          <div className={styles.searchRow}>
            <span>Search...</span>
            <Icon name="search" size={14} />
          </div>
          <div className={styles.transactionGroups}>
            {props.groups.map((group) => (
              <div key={group.label} className={styles.transactionGroup}>
                <div className={styles.transactionGroupLabel}>{group.label}</div>
                {group.items.map((item) => (
                  <div key={item.id} className={styles.transactionRow}>
                    <span className={styles.transactionIcon}>{item.icon ?? "•"}</span>
                    <div className={styles.transactionMeta}>
                      <div>{item.title}</div>
                      <div className={styles.transactionDate}>{item.date}</div>
                    </div>
                    <div className={styles.transactionAmount}>{item.amount}</div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </BankingWidgetShell>
      );

    case "exchange":
      return (
        <BankingWidgetShell className={cx(styles.exchange, className)} surface="white" bleed={bleed}>
          <div className={styles.exchangeHead}>
            <div className={styles.cardTitle}>{props.title ?? "Exchange"}</div>
            <div className={styles.exchangePair}>{props.pair ?? "USD → EUR"}</div>
          </div>
          <div className={styles.heroAmountSm}>{props.amount}</div>
          {props.available && <div className={styles.cardMeta}>Available : {props.available}</div>}
          {props.rate && <div className={styles.exchangeRate}>{props.rate}</div>}
          <div className={styles.exchangeBreakdown}>
            {props.tax && <div><span>Tax (2%)</span><span>{props.tax}</span></div>}
            {props.fee && <div><span>Exchange fee (1%)</span><span>{props.fee}</span></div>}
            {props.total && <div className={styles.exchangeTotal}><span>Total Amount</span><span>{props.total}</span></div>}
          </div>
          <button type="button" className={styles.primaryBtn}>{props.actionLabel ?? "Exchange Now"}</button>
          {props.disclaimer && <div className={styles.disclaimer}>{props.disclaimer}</div>}
        </BankingWidgetShell>
      );

    case "cryptoList":
      return (
        <BankingWidgetShell className={cx(styles.cryptoList, className)} surface="black" bleed={bleed}>
          {props.assets.map((asset) => (
            <div key={asset.id} className={cx(styles.cryptoItem, asset.expanded && styles.cryptoItemExpanded)}>
              <div className={styles.cryptoRow}>
                <span className={styles.cryptoSymbol}>{asset.symbol.slice(0, 1)}</span>
                <span className={styles.cryptoName}>{asset.name}</span>
                <Icon name={asset.expanded ? "chevron-up" : "chevron-down"} size={14} />
              </div>
              {asset.expanded && (
                <div className={styles.cryptoBody}>
                  {asset.price && <div className={styles.cryptoPrice}>{asset.price}</div>}
                  {asset.change && <div className={styles.cryptoChange}>{asset.change}</div>}
                  {asset.about && (
                    <>
                      <div className={styles.cryptoAboutLabel}>ABOUT</div>
                      <p className={styles.cryptoAbout}>{asset.about}</p>
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
        </BankingWidgetShell>
      );

    case "pricingPlans": {
      const period = props.period ?? "monthly";
      return (
        <BankingWidgetShell className={cx(styles.pricingPlans, className)} surface="black" bleed={bleed}>
          <div className={styles.pricingHead}>
            <div className={styles.cardTitleLight}>{props.title ?? "Pick Your Plan"}</div>
            <div className={styles.pricingTabs}>
              <span className={cx(period === "monthly" && styles.pricingTabActive)}>Monthly</span>
              <span className={cx(period === "yearly" && styles.pricingTabActive)}>Yearly</span>
            </div>
          </div>
          <div className={styles.planList}>
            {props.plans.map((plan) => (
              <div key={plan.id} className={cx(styles.planCard, plan.highlighted && styles.planCardHighlight)}>
                <div className={styles.planName}>{plan.name}</div>
                <div className={styles.planPrice}>
                  {plan.price}
                  {plan.period && <span> {plan.period}</span>}
                </div>
                <p className={styles.planDescription}>{plan.description}</p>
                {plan.highlighted && plan.actionLabel && (
                  <button type="button" className={styles.planBtn}>{plan.actionLabel}</button>
                )}
              </div>
            ))}
          </div>
        </BankingWidgetShell>
      );
    }

    case "creditCard":
      return (
        <BankingWidgetShell className={cx(styles.creditCard, className)} surface="white" chamfer bleed={bleed}>
          <div className={styles.cardTitle}>{props.title ?? "Credit Card Information"}</div>
          <div className={styles.cardNumber}>{props.number}</div>
          {props.brand && <div className={styles.cardBrand}>{props.brand}</div>}
          <div className={styles.cardDetailsGrid}>
            <div>
              <div className={styles.cardFieldLabel}>NAME ON CARD</div>
              <div className={styles.cardFieldValue}>{props.name}</div>
            </div>
            <div>
              <div className={styles.cardFieldLabel}>EXPIRY DATE</div>
              <div className={styles.cardFieldValue}>{props.expiry}</div>
            </div>
          </div>
          <div className={styles.cardLimits}>
            {props.transactionLimit && (
              <div><span>Limit Per Transactions</span><strong>{props.transactionLimit}</strong></div>
            )}
            {props.dailyLimit && (
              <div><span>Daily Limit</span><strong>{props.dailyLimit}</strong></div>
            )}
          </div>
        </BankingWidgetShell>
      );

    case "familySaving":
      return (
        <BankingWidgetShell className={cx(styles.familySaving, className)} surface="purple" bleed={bleed}>
          <div className={styles.familyHead}>
            <div className={styles.cardTitle}>{props.title ?? "Family Saving"}</div>
            <button type="button" className={styles.iconBtn} aria-label="Add saving">
              <Icon name="plus" size={14} />
            </button>
          </div>
          <div className={styles.heroAmount}>{props.amount}</div>
          {props.subtitle && <div className={styles.cardMeta}>{props.subtitle}</div>}
          <DotBars values={props.values} highlightIndex={props.highlightIndex} tooltip={props.tooltip} />
        </BankingWidgetShell>
      );

    default:
      return null;
  }
}
