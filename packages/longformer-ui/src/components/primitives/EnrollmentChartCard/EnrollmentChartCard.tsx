import { cx } from "../../../utils/cx";
import { Card } from "../Card";
import { Chip } from "../Chip";
import styles from "./EnrollmentChartCard.module.css";

export interface EnrollmentChartTooltip {
  title: string;
  enrollments: string;
  completion: string;
}

export interface EnrollmentChartCardProps {
  title?: string;
  avgLabel?: string;
  avgValue?: string;
  change?: string;
  changeDirection?: "up" | "down";
  timeframes?: string[];
  activeTimeframe?: string;
  months?: string[];
  enrollments?: number[];
  completionRates?: number[];
  activeMonth?: number;
  tooltip?: EnrollmentChartTooltip;
  className?: string;
}

/** Enrollment dashboard — combo bar/line chart with timeframe pills and active-month tooltip. */
export function EnrollmentChartCard({
  title = "Monthly Course Enrollments & Completion Rates",
  avgLabel = "Avg per month",
  avgValue,
  change,
  changeDirection = "up",
  timeframes = ["1 Year", "6 Months", "3 Months", "1 Month"],
  activeTimeframe = "1 Year",
  months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  enrollments = [220, 260, 240, 280, 300, 320, 350, 330, 310, 290, 270, 250],
  completionRates = [72, 74, 76, 78, 80, 82, 85, 84, 83, 81, 79, 77],
  activeMonth = 6,
  tooltip,
  className,
}: EnrollmentChartCardProps) {
  const width = 480;
  const height = 160;
  const maxEnrollment = Math.max(...enrollments, 1);
  const barWidth = width / enrollments.length - 8;

  const linePoints = completionRates.map((rate, index) => {
    const x = index * (width / completionRates.length) + barWidth / 2 + 4;
    const y = height - 20 - (rate / 100) * (height - 40);
    return `${x},${y}`;
  });

  const activeX = activeMonth * (width / enrollments.length) + barWidth / 2 + 4;
  const activeY = height - 20 - ((completionRates[activeMonth] ?? 0) / 100) * (height - 40);

  return (
    <Card padding="lg" className={cx(styles.card, className)}>
      <div className={styles.top}>
        <div className={styles.title}>{title}</div>
        <div className={styles.timeframes}>
          {timeframes.map((frame) => (
            <Chip key={frame} active={frame === activeTimeframe}>
              {frame}
            </Chip>
          ))}
        </div>
      </div>

      {(avgValue || change) && (
        <div className={styles.summary}>
          {avgValue && (
            <span>
              {avgLabel} <strong>{avgValue}</strong>
            </span>
          )}
          {change && (
            <span className={cx(styles.change, changeDirection === "up" ? styles.changeUp : styles.changeDown)}>
              {change}
            </span>
          )}
        </div>
      )}

      <div className={styles.legend}>
        <span className={styles.legendLine}>Completion Rate (%)</span>
        <span className={styles.legendBar}>Enrollments</span>
      </div>

      <div className={styles.chartWrap}>
        <svg className={styles.chart} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" role="img" aria-label={title}>
          {[0.25, 0.5, 0.75].map((ratio) => (
            <line
              key={ratio}
              x1={0}
              x2={width}
              y1={height - 20 - ratio * (height - 40)}
              y2={height - 20 - ratio * (height - 40)}
              className={styles.gridLine}
            />
          ))}
          {enrollments.map((value, index) => {
            const x = index * (width / enrollments.length) + 4;
            const h = ((value / maxEnrollment) * (height - 40));
            const active = index === activeMonth;
            return (
              <rect
                key={index}
                x={x}
                y={height - 20 - h}
                width={barWidth}
                height={h}
                className={active ? styles.barActive : styles.barMuted}
                rx={4}
              />
            );
          })}
          <polyline className={styles.line} points={linePoints.join(" ")} fill="none" />
          {completionRates.map((rate, index) => {
            const x = index * (width / completionRates.length) + barWidth / 2 + 4;
            const y = height - 20 - (rate / 100) * (height - 40);
            return <circle key={index} cx={x} cy={y} r={index === activeMonth ? 5 : 4} className={styles.dot} />;
          })}
        </svg>

        {tooltip && (
          <div className={styles.tooltip} style={{ left: `${(activeX / width) * 100}%`, top: `${(activeY / height) * 100}%` }}>
            <div className={styles.tooltipTitle}>{tooltip.title}</div>
            <div>{tooltip.enrollments}</div>
            <div>{tooltip.completion}</div>
          </div>
        )}
      </div>

      <div className={styles.months}>
        {months.map((month, index) => (
          <span key={month} className={cx(index === activeMonth && styles.monthActive)}>
            {month}
          </span>
        ))}
      </div>
    </Card>
  );
}
