import { cx } from "../../../utils/cx";
import { Icon } from "../../../icons";
import { FinanceWidgetShell } from "./FinanceWidgetShell";
import styles from "./FinanceWidget.tailwind";
import type { FinanceWidgetExpenseSegment, FinanceWidgetProps } from "./types";

const SEGMENT_COLORS: Record<FinanceWidgetExpenseSegment["color"], string> = {
  teal: "var(--finance-teal, #5ec4b6)",
  lavender: "var(--finance-lavender, #b8a9e8)",
  lime: "var(--finance-lime, #d4f547)",
  orange: "var(--finance-orange, #f5a623)",
};

function Tag({ children, tone = "lime" }: { children: string; tone?: "lime" | "orange" }) {
  return <span className={cx(styles.tag, tone === "orange" && styles.tagOrange)}>{children}</span>;
}

function DonutChart({ segments, total }: { segments: FinanceWidgetExpenseSegment[]; total: string }) {
  const size = 120;
  const stroke = 16;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  let offset = 0;

  return (
    <div className={styles.donutWrap}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} />
        {segments.map((segment) => {
          const length = (segment.percent / 100) * c;
          const dasharray = `${length} ${c - length}`;
          const dashoffset = -offset;
          offset += length;
          return (
            <circle
              key={segment.label}
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke={SEGMENT_COLORS[segment.color]}
              strokeWidth={stroke}
              strokeLinecap="round"
              strokeDasharray={dasharray}
              strokeDashoffset={dashoffset}
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
            />
          );
        })}
      </svg>
      <div className={styles.donutCenter}>{total}</div>
    </div>
  );
}

function LineChart({
  series,
  labels,
  tooltipIndex,
  tooltip,
}: {
  series: { color: "teal" | "lavender"; values: number[] }[];
  labels: string[];
  tooltipIndex?: number;
  tooltip?: string;
}) {
  const width = 180;
  const height = 72;
  const padX = 4;
  const padY = 8;
  const max = Math.max(...series.flatMap((s) => s.values), 1);
  const min = Math.min(...series.flatMap((s) => s.values), 0);
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

  const tooltipSeries = series[1] ?? series[0];
  const tooltipValue = tooltipIndex !== undefined ? tooltipSeries?.values[tooltipIndex] : undefined;
  const tooltipX =
    tooltipIndex !== undefined
      ? padX + (tooltipIndex / Math.max((tooltipSeries?.values.length ?? 1) - 1, 1)) * (width - padX * 2)
      : 0;
  const tooltipY =
    tooltipValue !== undefined
      ? padY + (1 - (tooltipValue - min) / range) * (height - padY * 2)
      : 0;

  return (
    <div className={styles.lineChartWrap}>
      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" aria-hidden="true">
        {[0.25, 0.5, 0.75].map((ratio) => (
          <line
            key={ratio}
            x1={0}
            y1={padY + ratio * (height - padY * 2)}
            x2={width}
            y2={padY + ratio * (height - padY * 2)}
            className={styles.lineGrid}
          />
        ))}
        {series.map((s, index) => (
          <polyline
            key={s.color}
            points={points(s.values)}
            className={cx(styles.lineSeries, s.color === "lavender" && styles.lineSeriesDashed)}
            stroke={SEGMENT_COLORS[s.color]}
            fill="none"
            strokeWidth={index === 0 ? 2.5 : 2}
            strokeDasharray={s.color === "lavender" ? "4 4" : undefined}
          />
        ))}
        {tooltipIndex !== undefined && tooltipValue !== undefined && (
          <>
            <circle cx={tooltipX} cy={tooltipY} r={4} fill={SEGMENT_COLORS.lavender} />
            <line x1={tooltipX} y1={tooltipY} x2={tooltipX + 18} y2={tooltipY - 18} className={styles.lineTooltipStem} />
          </>
        )}
      </svg>
      {tooltipIndex !== undefined && tooltipValue !== undefined && tooltip && (
        <div className={styles.lineTooltip}>{tooltip}</div>
      )}
      <div className={styles.lineLabels}>
        {labels.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
    </div>
  );
}

/** Finance dashboard widget family — lime, lavender, and charcoal surfaces. */
export function FinanceWidget(props: FinanceWidgetProps) {
  const { className, bleed = true } = props;

  switch (props.variant) {
    case "expenses":
      return (
        <FinanceWidgetShell className={cx(styles.expenses, className)} surface="dark" bleed={bleed}>
          <Tag>{props.tag ?? "EXPENSES"}</Tag>
          {props.period && <div className={styles.expensesPeriod}>{props.period}</div>}
          <div className={styles.expensesChart}>
            <DonutChart segments={props.segments} total={props.total} />
          </div>
          <div className={styles.legend}>
            {props.segments.map((segment) => (
              <div key={segment.label} className={styles.legendRow}>
                <span className={styles.legendLeft}>
                  <span className={styles.legendDot} style={{ background: SEGMENT_COLORS[segment.color] }} />
                  {segment.label}
                </span>
                <span>{segment.percent}%</span>
              </div>
            ))}
          </div>
        </FinanceWidgetShell>
      );

    case "currentBalance":
      return (
        <FinanceWidgetShell className={cx(styles.currentBalance, className)} surface="lime" bleed={bleed}>
          <div className={styles.balanceTop}>
            <span className={styles.balanceIcon}>
              <Icon name="arrow-up-right" size={16} />
            </span>
            {props.change && <span className={styles.balanceChange}>{props.change}</span>}
          </div>
          <div className={styles.balanceAmount}>{props.amount}</div>
          <div className={styles.balanceLabel}>{props.label ?? "Current balance"}</div>
        </FinanceWidgetShell>
      );

    case "progress":
      return (
        <FinanceWidgetShell className={cx(styles.progress, className)} surface="white" bleed={bleed}>
          <div className={styles.progressTitle}>{props.title ?? "Progress"}</div>
          <div className={styles.progressValue}>
            <Icon name="arrow-up-right" size={22} />
            {props.value}
          </div>
          {props.pill && <span className={styles.progressPill}>{props.pill}</span>}
        </FinanceWidgetShell>
      );

    case "subscription":
      return (
        <FinanceWidgetShell className={cx(styles.subscription, className)} surface="lavender" bleed={bleed}>
          <div className={styles.subscriptionBlock}>
            <div className={styles.subscriptionKicker}>{props.monthLabel ?? "THIS MONTH"}</div>
            <div className={styles.subscriptionCount}>{props.count}</div>
          </div>
          <div className={styles.subscriptionBlock}>
            <div className={styles.subscriptionKicker}>{props.totalLabel ?? "TOTAL"}</div>
            <div className={styles.subscriptionTotal}>{props.total}</div>
          </div>
          <div className={styles.subscriptionBlock}>
            <div className={styles.subscriptionKicker}>{props.nextLabel ?? "NEXT PAYMENT IN 4 DAYS"}</div>
            <div className={styles.subscriptionNext}>{props.nextPayment}</div>
          </div>
        </FinanceWidgetShell>
      );

    case "performance": {
      const max = Math.max(...props.bars.map((bar) => bar.value), 1);
      return (
        <FinanceWidgetShell className={cx(styles.performance, className)} surface="dark" bleed={bleed}>
          <Tag tone="orange">{props.tag ?? "PERFORMANCE"}</Tag>
          <div className={styles.performanceHeadline}>{props.headline}</div>
          {props.period && <div className={styles.performancePeriod}>{props.period}</div>}
          <div className={styles.performanceChart}>
            {props.bars.map((bar) => (
              <div key={bar.label} className={styles.performanceBarCol}>
                <span className={styles.performanceBarLabel}>{bar.label}</span>
                <div className={styles.performanceBarTrack}>
                  <span
                    className={styles.performanceBarFill}
                    style={{ height: `${Math.max(12, (bar.value / max) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className={styles.performanceFooter}>
            <span className={styles.legendDot} style={{ background: SEGMENT_COLORS.lavender }} />
            {props.footerLabel ?? "SEE ALL"}
          </div>
        </FinanceWidgetShell>
      );
    }

    case "balance": {
      const labels = props.chartLabels ?? ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL"];
      const activePeriod = props.period ?? "monthly";
      return (
        <FinanceWidgetShell className={cx(styles.balance, className)} surface="lime" bleed={bleed}>
          <div className={styles.balanceHeader}>
            <div className={styles.balanceTitle}>{props.title ?? "Balance"}</div>
            <div className={styles.balanceToggle} aria-hidden="true">
              <span className={cx(activePeriod === "weekly" && styles.balanceToggleActive)}>WEEKLY</span>
              <span className={cx(activePeriod === "monthly" && styles.balanceToggleActive)}>MONTHLY</span>
            </div>
          </div>
          <div className={styles.balanceBody}>
            <div className={styles.balanceStats}>
              {props.series.map((s) => (
                <div key={s.id} className={styles.balanceStatRow}>
                  <span className={styles.legendDot} style={{ background: SEGMENT_COLORS[s.color] }} />
                  <span>{s.label}</span>
                  <span className={styles.balanceStatPct}>{s.percent}</span>
                </div>
              ))}
              <div className={styles.balanceHighlight}>
                {props.highlightValue}
                <span className={styles.balanceHighlightUnit}>{props.highlightUnit ?? "%"}</span>
              </div>
            </div>
            <LineChart
              series={props.series.map((s) => ({ color: s.color, values: s.values }))}
              labels={labels}
              tooltipIndex={3}
              tooltip={props.tooltip ? `${props.tooltip.value} ${props.tooltip.label}` : undefined}
            />
          </div>
        </FinanceWidgetShell>
      );
    }

    default:
      return null;
  }
}
