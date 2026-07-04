import { cx } from "../../../utils/cx";
import { Icon } from "../../../icons";
import { Avatar } from "../Avatar";
import { DesignCardShell } from "./DesignCardShell";
import styles from "./DesignCard.tailwind";
import type { DesignCardProps } from "./types";

function clampProgress(value?: number) {
  return Math.max(0, Math.min(100, value ?? 0));
}

function VerticalBars({
  values,
  className,
  labels,
}: {
  values: number[];
  className?: string;
  labels?: string[];
}) {
  const max = Math.max(...values, 1);
  return (
    <div className={cx(styles.barChart, className)}>
      {values.map((value, index) => (
        <div key={index} className={styles.barColumn}>
          <span className={styles.bar} style={{ height: `${Math.max(12, (value / max) * 100)}%` }} />
          {labels?.[index] && <span className={styles.barLabel}>{labels[index]}</span>}
        </div>
      ))}
    </div>
  );
}

function RingGauge({
  progress,
  label,
  active,
  light,
  size = 34,
}: {
  progress: number;
  label?: string;
  active?: boolean;
  light?: boolean;
  size?: number;
}) {
  const r = (size - 6) / 2;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - clampProgress(progress) / 100);
  return (
    <div className={cx(styles.ringGauge, active && styles.ringGaugeActive, light && styles.ringGaugeLight)}>
      <svg width={size} height={size} aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={r} className={styles.ringTrack} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          className={styles.ringFill}
          strokeDasharray={c}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      {label && <span className={styles.ringLabel}>{label}</span>}
      {active && <span className={styles.ringDot} />}
    </div>
  );
}

function SemiGauge({ percent, side }: { percent: number; side: "L" | "R" }) {
  const p = clampProgress(percent);
  return (
    <div className={styles.semiGauge}>
      <svg viewBox="0 0 48 32" aria-hidden="true">
        <path d="M6 28 A 18 18 0 0 1 42 28" className={styles.semiTrack} />
        <path
          d="M6 28 A 18 18 0 0 1 42 28"
          className={styles.semiFill}
          pathLength={100}
          strokeDasharray={`${p} 100`}
        />
      </svg>
      <span className={styles.semiLabel}>{side}</span>
      <span className={styles.semiValue}>{p}%</span>
    </div>
  );
}

function BrandMark({ mark, color, size = 28 }: { mark: string; color: string; size?: number }) {
  return (
    <span className={styles.brandMark} style={{ background: color, width: size, height: size }}>
      {mark}
    </span>
  );
}

function FinanceHeader({
  symbol,
  company,
  brandMark = "T",
  brandColor = "#e82127",
  updated = "updated 2m ago",
}: {
  symbol: string;
  company: string;
  brandMark?: string;
  brandColor?: string;
  updated?: string;
}) {
  return (
    <div className={styles.financeHead}>
      <div className={styles.financeIdentity}>
        <BrandMark mark={brandMark} color={brandColor} />
        <span className={styles.financeTitle}>
          {symbol} / {company}
        </span>
      </div>
      <span className={styles.financeUpdated}>{updated}</span>
    </div>
  );
}

/** Dynamic Island-style live activity card — variant picks layout and visualization. */
export function DesignCard(props: DesignCardProps) {
  const { className, size = "md" } = props;

  switch (props.variant) {
    case "flight": {
      const progress = clampProgress(props.progress ?? 62);
      return (
        <DesignCardShell className={className} size={size}>
          <div className={styles.routeHead}>
            <span>{props.origin}</span>
            <span className={styles.routeDash}>—</span>
            <span>{props.destination}</span>
          </div>
          <div className={styles.progressTrackCyan}>
            <span className={styles.progressFillCyan} style={{ width: `${progress}%` }} />
            <span className={styles.progressMarkerCyan} style={{ left: `${progress}%` }}>
              <Icon name="plane" size={12} />
            </span>
          </div>
          <div className={styles.flightMeta}>
            {props.departureTime && <span>{props.departureTime}</span>}
            <span className={styles.statusCenter}>{props.status}</span>
            {props.arrivalTime && <span>{props.arrivalTime}</span>}
          </div>
        </DesignCardShell>
      );
    }
    case "order": {
      const progress = clampProgress(props.progress ?? 45);
      return (
        <DesignCardShell className={className} size={size}>
          <div className={styles.splitHead}>
            <span>{props.status}</span>
            <span className={styles.eta}>{props.eta}</span>
          </div>
          <div className={styles.progressTrackPurple}>
            <span className={styles.progressFillPurple} style={{ width: `${progress}%` }} />
            <span className={styles.milestone} style={{ left: "8%" }}>
              <Icon name="package" size={12} />
            </span>
            <span className={styles.milestone} style={{ left: "50%" }}>
              <Icon name="car" size={12} />
            </span>
            <span className={styles.milestone} style={{ left: "92%" }}>
              <Icon name="home" size={12} />
            </span>
          </div>
          <div className={styles.orderFooter}>
            {props.driverName && (
              <div className={styles.driver}>
                <Avatar name={props.driverName} size="sm" />
                <span>{props.driverName}</span>
              </div>
            )}
            <div className={styles.actionPills}>
              <button type="button" className={styles.actionPill}>
                <Icon name="phone" size={12} />
                {props.callLabel ?? "Call"}
              </button>
              <button type="button" className={styles.actionPill}>
                <Icon name="message-square" size={12} />
                {props.messageLabel ?? "Message"}
              </button>
            </div>
          </div>
        </DesignCardShell>
      );
    }
    case "glucose":
      return (
        <DesignCardShell className={className} size={size}>
          <div className={styles.metricHead}>
            <span className={styles.metricValue}>
              {props.value}
              {props.unit && <span className={styles.metricUnit}> {props.unit}</span>}
            </span>
            {props.trend === "down" && <Icon name="chevron-down" size={16} className={styles.trendDown} />}
            {props.trend === "up" && <Icon name="chevron-up" size={16} className={styles.trendUp} />}
          </div>
          <VerticalBars
            values={props.chartValues ?? [40, 58, 72, 64, 80, 68, 92]}
            labels={props.labels ?? ["1PM", "2PM", "NOW"]}
            className={styles.glucoseBars}
          />
        </DesignCardShell>
      );
    case "delivery":
      return (
        <DesignCardShell className={className} size={size}>
          <div className={styles.deliveryGrid}>
            <div>
              {props.statusLabel && <div className={styles.kicker}>{props.statusLabel}</div>}
              <div className={styles.deliveryStatus}>{props.status}</div>
              <div className={styles.deliveryEta}>ETA {props.eta}</div>
            </div>
            <svg className={styles.miniMap} viewBox="0 0 80 80" aria-hidden="true">
              <rect width="80" height="80" rx="14" fill="rgba(255,255,255,0.06)" />
              <path
                d="M12 56 C 24 42, 34 48, 46 34 S 68 22, 68 22"
                fill="none"
                stroke="#22c55e"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <circle cx="68" cy="22" r="5" fill="#22c55e" />
            </svg>
          </div>
        </DesignCardShell>
      );
    case "espresso":
      return (
        <DesignCardShell className={className} size={size}>
          <div className={styles.splitHead}>
            <span>{props.title ?? "Espresso"}</span>
            <span className={styles.timerAccent}>{props.timer}</span>
          </div>
          <VerticalBars
            values={props.chartValues ?? [24, 48, 72, 56, 88, 64, 40, 72, 52]}
            className={styles.espressoBars}
          />
          <button type="button" className={styles.stopButton} aria-label={props.stopLabel ?? "Stop"}>
            <Icon name="square" size={14} />
            {props.stopLabel ?? "Stop"}
          </button>
        </DesignCardShell>
      );
    case "iss":
      return (
        <DesignCardShell className={className} size={size}>
          <div className={styles.splitHead}>
            <span>{props.title ?? "ISS Flyover"}</span>
            <span className={styles.issCountdown}>{props.countdown}</span>
          </div>
          <div className={styles.issVisual}>
            <Icon name="satellite" size={16} className={styles.issIcon} />
            <svg className={styles.issArc} viewBox="0 0 160 64" aria-hidden="true">
              <defs>
                <linearGradient id="iss-arc-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#1e3a8a" />
                  <stop offset="100%" stopColor="#22d3ee" />
                </linearGradient>
              </defs>
              <path
                d="M8 52 C 40 8, 120 8, 152 52"
                fill="none"
                stroke="url(#iss-arc-gradient)"
                strokeWidth="8"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </DesignCardShell>
      );
    case "workout":
      return (
        <DesignCardShell className={className} size={size}>
          <div className={styles.workoutHead}>
            <span className={styles.workoutElapsed}>{props.elapsed}</span>
            <span className={styles.workoutDistance}>{props.distance}</span>
          </div>
          <VerticalBars values={props.chartValues ?? [32, 48, 72, 56, 88, 64, 80, 52, 68]} className={styles.workoutBars} />
          <div className={styles.workoutControls}>
            <button type="button" className={styles.circleButton} aria-label="Cancel">
              <Icon name="close" size={14} />
            </button>
            <button type="button" className={cx(styles.circleButton, styles.circleButtonPrimary)} aria-label="Pause">
              <Icon name="pause" size={14} />
            </button>
            <button type="button" className={styles.circleButton} aria-label="Target">
              <Icon name="target" size={14} />
            </button>
          </div>
        </DesignCardShell>
      );
    case "race":
      return (
        <DesignCardShell className={className} size={size}>
          <div className={styles.raceSector}>{props.sector}</div>
          <svg className={styles.raceTrack} viewBox="0 0 220 100" aria-hidden="true">
            <path
              d="M36 72 C 20 40, 44 18, 78 18 C 112 18, 128 34, 148 24 C 176 10, 204 28, 196 56 C 188 84, 148 88, 118 78 C 88 68, 72 92, 48 82 Z"
              fill="none"
              stroke="#ef4444"
              strokeWidth="3"
            />
            <circle
              cx={36 + (160 * clampProgress(props.progress ?? 38)) / 100}
              cy={56}
              r="5"
              fill="#fff"
            />
          </svg>
        </DesignCardShell>
      );
    case "transit":
      return (
        <DesignCardShell className={className} size={size}>
          <div className={styles.transitLine}>
            {props.stops.map((stop, index) => (
              <div key={stop.label} className={styles.transitStop}>
                <span className={cx(styles.transitDot, stop.active && styles.transitDotActive)} />
                <span className={cx(styles.transitLabel, stop.active && styles.transitLabelActive)}>{stop.label}</span>
                {index < props.stops.length - 1 && <span className={styles.transitSegment} aria-hidden="true" />}
              </div>
            ))}
          </div>
        </DesignCardShell>
      );
    case "heartRate":
      return (
        <DesignCardShell className={className} size={size}>
          <div className={styles.metricHead}>
            <span className={styles.metricValue}>
              {props.value}
              {props.unit && <span className={styles.metricUnit}> {props.unit}</span>}
            </span>
          </div>
          <VerticalBars values={props.chartValues ?? [28, 52, 88, 44, 72, 36, 64, 48, 80]} className={styles.heartBars} />
        </DesignCardShell>
      );
    case "sleep":
      return (
        <DesignCardShell className={className} size={size}>
          <div className={styles.sleepHead}>
            <span className={styles.heroMetric}>{props.duration}</span>
            {props.delta && <span className={styles.deltaPill}>{props.delta}</span>}
          </div>
          <div className={styles.sleepChartWrap}>
            {(props.segments ?? [
              { label: "TUE", values: [30, 45, 25] },
              { label: "WED", values: [35, 40, 25] },
              { label: "THU", values: [28, 48, 24] },
            ]).map((day) => (
              <div key={day.label} className={styles.sleepDay}>
                <div className={styles.sleepStack}>
                  {day.values.map((v, i) => (
                    <span key={i} className={styles.sleepSegment} style={{ flex: v }} />
                  ))}
                </div>
                <span className={styles.sleepDayLabel}>{day.label}</span>
              </div>
            ))}
            <span className={styles.sleepGoal} style={{ left: `${props.goalAt ?? 72}%` }} aria-hidden="true" />
          </div>
        </DesignCardShell>
      );
    case "subwayNav":
      return (
        <DesignCardShell className={className} size={size} theme="light">
          <div className={styles.subwayHeadline}>{props.headline}</div>
          <div className={styles.subwayTrack}>
            {Array.from({ length: props.stopCount ?? 5 }).map((_, i) => (
              <span
                key={i}
                className={cx(styles.subwayDot, i === (props.activeStop ?? 2) && styles.subwayDotActive)}
              />
            ))}
          </div>
          {props.stationCount && <div className={styles.subwayMeta}>{props.stationCount}</div>}
        </DesignCardShell>
      );
    case "wishlist":
      return (
        <DesignCardShell className={className} size={size} theme="gradientGreen">
          <div className={styles.wishlistGrid}>
            <div>
              {props.kicker && <div className={styles.kicker}>{props.kicker}</div>}
              <div className={styles.wishlistTitle}>{props.title}</div>
              <div className={styles.wishlistPriceRow}>
                <span>{props.price}</span>
                {props.discount && <span className={styles.discountPill}>{props.discount}</span>}
              </div>
            </div>
            <span className={styles.coverArt} aria-hidden="true">
              <Icon name="grid" size={18} />
            </span>
          </div>
          <div className={styles.limeTrack}>
            <span className={styles.limeFill} style={{ width: `${clampProgress(props.progress ?? 34)}%` }} />
          </div>
        </DesignCardShell>
      );
    case "weeklyRings":
      return (
        <DesignCardShell className={className} size={size}>
          {props.tags && props.tags.length > 0 && (
            <div className={styles.tagRow}>
              {props.tags.map((tag) => (
                <span key={tag.label} className={cx(styles.tagPill, tag.tone === "success" && styles.tagPillSuccess)}>
                  {tag.label}
                </span>
              ))}
            </div>
          )}
          <div className={styles.ringRow}>
            {props.rings.map((ring) => (
              <RingGauge
                key={ring.label}
                label={ring.label}
                progress={ring.progress ?? 0}
                active={ring.active}
              />
            ))}
          </div>
        </DesignCardShell>
      );
    case "podcast":
      return (
        <DesignCardShell className={className} size={size} theme="red">
          <div className={styles.podcastGrid}>
            <div>
              {props.date && <div className={styles.kicker}>{props.date}</div>}
              <div className={styles.podcastTitle}>{props.title}</div>
              <div className={styles.podcastShow}>{props.show}</div>
            </div>
            <span className={styles.podcastArt} aria-hidden="true" />
          </div>
          <div className={styles.mediaProgressRow}>
            {props.speed && <span className={styles.speedPill}>{props.speed}</span>}
            <div className={styles.mediaTrack}>
              <span className={styles.mediaFill} style={{ width: `${clampProgress(props.progress ?? 35)}%` }} />
            </div>
            {props.duration && <span className={styles.mediaDuration}>{props.duration}</span>}
          </div>
        </DesignCardShell>
      );
    case "weather":
      return (
        <DesignCardShell className={className} size={size} theme="blue">
          <div className={styles.weatherHead}>
            <div>
              <div className={styles.weatherCity}>{props.city}</div>
              <div className={styles.weatherTemp}>{props.temperature}</div>
            </div>
            <Icon name="sun" size={28} />
          </div>
          <div className={styles.weatherStats}>
            {props.aqi && (
              <div className={styles.weatherGauge}>
                <RingGauge progress={38} label="AQI" size={42} />
                <span>{props.aqi}</span>
              </div>
            )}
            <VerticalBars
              values={props.chartValues ?? [42, 58, 72, 64, 48]}
              className={styles.weatherBars}
            />
            {props.wind && (
              <div className={styles.weatherGauge}>
                <RingGauge progress={55} label="Mph" size={42} />
                <span>{props.wind}</span>
              </div>
            )}
          </div>
        </DesignCardShell>
      );
    case "network":
      return (
        <DesignCardShell className={className} size={size}>
          <div className={styles.networkStats}>
            {props.stats.map((stat, i) => (
              <span key={i} className={styles.networkStat}>
                {stat.direction === "up" && <Icon name="chevron-up" size={12} />}
                {stat.direction === "down" && <Icon name="chevron-down" size={12} />}
                {stat.value}
              </span>
            ))}
          </div>
          <div className={styles.dualTrack}>
            <span className={styles.dualCyan} style={{ width: `${clampProgress(props.downloadProgress ?? 62)}%` }} />
            <span className={styles.dualPurple} style={{ width: `${clampProgress(props.uploadProgress ?? 38)}%` }} />
          </div>
          <svg className={styles.dotChart} viewBox="0 0 200 40" preserveAspectRatio="none" aria-hidden="true">
            <polyline
              className={styles.dotLine}
              points={(props.chartValues ?? [12, 18, 14, 22, 16, 24, 18, 20, 26, 22])
                .map((v, i, arr) => {
                  const x = (i / Math.max(arr.length - 1, 1)) * 200;
                  const max = Math.max(...arr, 1);
                  const y = 36 - (v / max) * 28;
                  return `${x},${y}`;
                })
                .join(" ")}
              fill="none"
            />
          </svg>
          <div className={styles.dotLabels}>
            {(props.chartLabels ?? ["20m", "15m", "10m", "5m"]).map((label) => (
              <span key={label}>{label}</span>
            ))}
          </div>
        </DesignCardShell>
      );
    case "sportsScore":
      return (
        <div className={cx(styles.sportsCard, className)}>
          <div className={styles.sportsTop}>
            <span className={styles.teamMark}>{props.homeTeam.slice(0, 3).toUpperCase()}</span>
            <span className={styles.sportsScoreLine}>
              {props.homeScore} - {props.awayScore}
            </span>
            <span className={styles.teamMark}>{props.awayTeam.slice(0, 3).toUpperCase()}</span>
          </div>
          <div className={styles.sportsBottom}>
            <span style={{ background: props.homeColor ?? "#f97316" }}>{props.homeTeam}</span>
            {props.league && <span className={styles.leaguePill}>{props.league}</span>}
            <span style={{ background: props.awayColor ?? "#dc2626" }}>{props.awayTeam}</span>
          </div>
        </div>
      );
    case "billing":
      return (
        <DesignCardShell className={className} size={size} theme="light">
          <div className={styles.billingGrid}>
            <div>
              {props.kicker && <div className={styles.billingKicker}>{props.kicker}</div>}
              {props.countdown && <div className={styles.billingCountdown}>{props.countdown}</div>}
              <div className={styles.billingAmount}>{props.amount}</div>
            </div>
            <div className={styles.billingBars}>
              {(props.bars ?? [
                { label: "NOV", value: 60, tone: "accent" },
                { label: "DEC", value: 80, tone: "danger" },
                { label: "JAN", value: 45, tone: "neutral" },
                { label: "FEB", value: 70, tone: "accent" },
              ]).map((bar) => (
                <div key={bar.label} className={styles.billingBarCol}>
                  <span
                    className={cx(styles.billingBar, bar.tone && styles[`billingBar-${bar.tone}`])}
                    style={{ height: `${bar.value}%` }}
                  />
                  <span className={styles.billingBarLabel}>{bar.label}</span>
                </div>
              ))}
            </div>
          </div>
        </DesignCardShell>
      );
    case "activityGoals":
      return (
        <DesignCardShell className={className} size={size}>
          <div className={styles.activityRingGrid}>
            {props.goals.map((goal, i) => (
              <RingGauge
                key={i}
                progress={goal.completed ? 100 : clampProgress(goal.progress ?? 0)}
                label={goal.completed ? "✓" : goal.label}
              />
            ))}
          </div>
        </DesignCardShell>
      );
    case "airpods":
      return (
        <DesignCardShell className={className} size={size} theme="gradientPurple">
          <div className={styles.airpodsHead}>
            <Icon name="bluetooth" size={18} />
            <span>
              {props.featureValue ?? "13%"} {props.feature ?? "Noise Cancellation"}
            </span>
          </div>
          <div className={styles.airpodsGauges}>
            <SemiGauge side="L" percent={props.leftBattery ?? 7} />
            <SemiGauge side="R" percent={props.rightBattery ?? 19} />
          </div>
        </DesignCardShell>
      );
    case "laundry":
      return (
        <DesignCardShell className={className} size={size} theme="light">
          <div className={styles.laundryHead}>
            <Icon name="refresh" size={16} />
            <div>
              <div className={styles.laundryProgram}>{props.program}</div>
              <div className={styles.laundryTimer}>{props.timer}</div>
            </div>
          </div>
          <div className={styles.laundryPhase}>
            <span>{props.phase ?? "Rinse"}</span>
            {props.phaseTimer && <span>{props.phaseTimer}</span>}
          </div>
          <div className={styles.laundryTrack}>
            <span className={styles.laundryFill} style={{ width: `${clampProgress(props.phaseProgress ?? 55)}%` }} />
          </div>
          <div className={styles.laundryMeta}>
            {props.temp && <span>TEMP {props.temp}</span>}
            {props.spin && <span>SPIN {props.spin}</span>}
          </div>
        </DesignCardShell>
      );
    case "stockQuote": {
      const values = props.chartValues ?? [32, 38, 34, 42, 40, 48, 44, 52, 49, 58, 54, 62];
      const max = Math.max(...values, 1);
      const min = Math.min(...values);
      const width = 280;
      const height = 72;
      const baselineY = height - ((values[0] - min) / Math.max(max - min, 1)) * (height - 12) - 6;
      const points = values
        .map((value, index) => {
          const x = (index / Math.max(values.length - 1, 1)) * width;
          const y = height - ((value - min) / Math.max(max - min, 1)) * (height - 12) - 6;
          return `${x},${y}`;
        })
        .join(" ");
      const area = `${points} ${width},${height} 0,${height}`;
      const up = props.changeDirection !== "down";
      return (
        <DesignCardShell className={className} size={size ?? "lg"} theme="dark">
          <FinanceHeader
            symbol={props.symbol}
            company={props.company}
            brandMark={props.brandMark ?? "T"}
            brandColor={props.brandColor ?? "#e82127"}
            updated={props.updated}
          />
          <div className={styles.stockQuoteBody}>
            <div className={styles.stockPrice}>{props.price}</div>
            {(props.change || props.changePercent) && (
              <div className={cx(styles.stockChangeBlock, up ? styles.stockChangeUp : styles.stockChangeDown)}>
                {props.change && <span>{props.change}</span>}
                {props.changePercent && (
                  <span>
                    {props.changePercent}
                    {up ? " ↑" : " ↓"}
                  </span>
                )}
              </div>
            )}
          </div>
          <div className={styles.stockLineChart}>
            <svg className={styles.stockLineSvg} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" aria-hidden="true">
              <line x1="0" y1={baselineY} x2={width} y2={baselineY} className={styles.stockBaseline} />
              <polygon className={styles.stockArea} points={area} />
              <polyline className={styles.stockLine} points={points} />
            </svg>
          </div>
        </DesignCardShell>
      );
    }
    case "stockActivity": {
      const values = props.chartValues ?? [18, 24, 20, 28, 36, 34, 22, 18, 24, 20, 28, 36, 34, 22, 18, 24, 20, 28, 36, 34];
      const labels =
        props.chartLabels ??
        ["S", "M", "T", "W", "T", "F", "S", "S", "M", "T", "W", "T", "F", "S", "S", "M", "T", "W", "T", "F", "S"];
      const active = new Set(props.activeIndices ?? [4, 5]);
      const max = Math.max(...values, 1);
      return (
        <DesignCardShell className={className} size={size ?? "lg"} theme="dark">
          <FinanceHeader
            symbol={props.symbol}
            company={props.company}
            brandMark={props.brandMark ?? "T"}
            brandColor={props.brandColor ?? "#e82127"}
            updated={props.updated}
          />
          <div className={styles.activityBars}>
            {values.map((value, index) => (
              <span
                key={index}
                className={cx(styles.activityBar, active.has(index) && styles.activityBarActive)}
                style={{ height: `${Math.max(12, (value / max) * 100)}%` }}
              />
            ))}
          </div>
          <div className={styles.activityLabels}>
            {labels.map((label, index) => (
              <span key={`${label}-${index}`}>{label}</span>
            ))}
          </div>
        </DesignCardShell>
      );
    }
    case "amazonBuy":
      return (
        <DesignCardShell className={className} size={size} theme="dark">
          <div className={styles.actionPillRow}>
            <div className={styles.actionPillIdentity}>
              <BrandMark mark="a" color="#ff9900" />
              <span className={styles.actionPillTitle}>
                {props.symbol ?? "AMZN"} {props.company ?? "Amazon Ltd."}
              </span>
            </div>
            <button type="button" className={cx(styles.actionCircle, styles.buyCircle)}>
              <Icon name="shopping-cart" size={14} />
              {props.buyLabel ?? "Buy"}
            </button>
          </div>
        </DesignCardShell>
      );
    case "amazonActions":
      return (
        <DesignCardShell className={className} size={size} theme="dark">
          <div className={styles.actionPillRow}>
            <div className={styles.actionPillIdentity}>
              <BrandMark mark="a" color="#ff9900" />
              <span className={styles.actionPillTitle}>
                {props.symbol ?? "AMZN"} {props.company ?? "Amazon Ltd."}
              </span>
            </div>
            <div className={styles.actionButtons}>
              <button type="button" className={styles.actionCircle} aria-label="Search">
                <Icon name="search" size={14} />
              </button>
              <button type="button" className={cx(styles.actionCircle, styles.buyCircle)}>
                <Icon name="shopping-cart" size={14} />
                {props.buyLabel ?? "Buy"}
              </button>
            </div>
          </div>
        </DesignCardShell>
      );
    case "priceAlert":
      return (
        <DesignCardShell className={className} size={size} theme="dark">
          <div className={styles.alertPillRow}>
            <div className={styles.alertLeft}>
              <span className={styles.alertBell}>
                <Icon name="bell" size={14} />
                <span
                  className={styles.alertBellMark}
                  style={{ background: props.brandColor ?? "#e82127" }}
                >
                  {props.brandMark ?? "T"}
                </span>
              </span>
              <span className={styles.alertText}>
                {props.company} {props.alertLabel ?? "Price change"}
              </span>
            </div>
            <RingGauge progress={props.progress ?? 73} label={`${clampProgress(props.progress ?? 73)}%`} size={42} />
          </div>
        </DesignCardShell>
      );
    case "statusSpendings":
      return (
        <DesignCardShell className={cx(styles.statusPillOuter, className)} size={size} theme="light">
          <div className={styles.statusBar}>
            <span className={styles.statusBarLeft}>
              <span>{props.time ?? "9:41"}</span>
              {props.location && (
                <>
                  <Icon name="arrow-up-right" size={10} />
                  <span>{props.location}</span>
                </>
              )}
            </span>
            <span className={styles.statusBarRight}>
              <Icon name="link" size={10} />
              <Icon name="battery" size={10} />
              <span>{props.batteryPercent ?? 32}%</span>
            </span>
          </div>
          <div className={styles.statusInnerPill}>
            <span className={styles.statusInnerLeft}>
              <Icon name="wallet" size={14} />
              <span className={styles.statusInnerLabel}>{props.label ?? "Spendings"}</span>
            </span>
            <span className={styles.statusInnerValue}>{props.amount}</span>
          </div>
        </DesignCardShell>
      );
    case "statusCrypto":
      return (
        <DesignCardShell className={cx(styles.statusPillOuter, className)} size={size} theme="light">
          <div className={styles.statusBar}>
            <span className={styles.statusBarLeft}>
              <span>{props.time ?? "9:41"}</span>
              <Icon name="arrow-up-right" size={10} />
            </span>
            <span className={styles.statusBarRight}>
              <Icon name="link" size={10} />
              <Icon name="battery" size={10} />
              <span>{props.batteryPercent ?? 32}%</span>
            </span>
          </div>
          <div className={styles.statusInnerPill}>
            <span className={styles.statusInnerLeft}>
              <BrandMark mark="◆" color={props.brandColor ?? "#627eea"} size={24} />
              <span className={styles.statusInnerLabel}>{props.symbol}</span>
            </span>
            <span className={cx(styles.statusInnerChange, props.changeDirection === "down" && styles.stockChangeDown)}>
              {props.change}
              {props.changeDirection !== "down" && <Icon name="arrow-up-right" size={12} />}
            </span>
          </div>
        </DesignCardShell>
      );
    default:
      return null;
  }
}
