import { cx } from "../../../utils/cx";
import { Icon } from "../../../icons";
import { DotMatrix } from "./DotMatrix";
import { FitnessWidgetShell } from "./FitnessWidgetShell";
import styles from "./FitnessWidget.module.css";
import type { FitnessWidgetProps } from "./types";

function clampProgress(value?: number) {
  return Math.max(0, Math.min(100, value ?? 0));
}

function PlayRing({ progress, size = 40 }: { progress: number; size?: number }) {
  const r = (size - 6) / 2;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - clampProgress(progress) / 100);
  return (
    <div className={styles.playRing} style={{ width: size, height: size }}>
      <svg width={size} height={size} aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={r} className={styles.playRingTrack} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          className={styles.playRingFill}
          strokeDasharray={c}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <span className={styles.playRingIcon}>
        <Icon name="play" size={14} />
      </span>
    </div>
  );
}

function WeatherIcon({ kind }: { kind?: "sun" | "cloud" | "partly-cloudy" }) {
  if (kind === "sun") {
    return (
      <span className={styles.weatherIcon} aria-hidden="true">
        <span className={styles.weatherSun} />
      </span>
    );
  }
  if (kind === "cloud") {
    return (
      <span className={styles.weatherIcon} aria-hidden="true">
        <span className={styles.weatherCloud} />
      </span>
    );
  }
  return (
    <span className={styles.weatherIcon} aria-hidden="true">
      <span className={styles.weatherSun} />
      <span className={styles.weatherCloudSmall} />
    </span>
  );
}

/** Fitness dashboard widget family — dot-matrix numerals, pink/green accents. */
export function FitnessWidget(props: FitnessWidgetProps) {
  const { className, bleed = true } = props;

  switch (props.variant) {
    case "workoutPhoto":
      return (
        <FitnessWidgetShell className={cx(styles.workoutPhoto, className)} surface="dark" bleed={bleed}>
          <div
            className={styles.workoutPhotoBg}
            style={props.imageUrl ? { backgroundImage: `url(${props.imageUrl})` } : undefined}
          />
          <div className={styles.workoutPhotoOverlay}>
            <div className={styles.workoutPhotoBubble}>
              <div className={styles.workoutPhotoTime}>{props.totalTime}</div>
              <div className={styles.workoutPhotoLabel}>{props.totalTimeLabel ?? "TOTAL TIME"}</div>
            </div>
          </div>
        </FitnessWidgetShell>
      );

    case "hiking":
      return (
        <FitnessWidgetShell className={cx(styles.stack, className)} surface="dark" bleed={bleed}>
          <div className={styles.activityLabel}>{props.label ?? "HIKING"}</div>
          <div className={styles.activityValueRow}>
            <DotMatrix size="xl">{props.distance}</DotMatrix>
            <span className={styles.activityUnit}>{props.unit ?? "m"}</span>
          </div>
          <button type="button" className={cx(styles.actionBtn, styles.actionBtnGreen)}>
            {props.actionLabel ?? "START"}
          </button>
        </FitnessWidgetShell>
      );

    case "running":
      return (
        <FitnessWidgetShell className={cx(styles.stack, className)} surface="dark" bleed={bleed}>
          <div className={styles.runningHead}>
            {props.date && <span>{props.date}</span>}
            <span>{props.label ?? "RUNNING"}</span>
          </div>
          <div className={styles.runningValue}>
            <span className={styles.runningAdjust} aria-hidden="true">−</span>
            <DotMatrix size="xl">{props.distance}</DotMatrix>
            <span className={styles.runningAdjust} aria-hidden="true">+</span>
          </div>
          <div className={styles.activityUnitCenter}>{props.unit ?? "KM"}</div>
          <button type="button" className={cx(styles.actionBtn, styles.actionBtnPink)}>
            {props.actionLabel ?? "START SESSION"}
          </button>
        </FitnessWidgetShell>
      );

    case "gymStreak": {
      const weekdays = props.weekdays ?? ["M", "T", "W", "T", "F", "S", "S"];
      const rows = Math.ceil(props.dots.length / 7);
      return (
        <FitnessWidgetShell className={cx(styles.gymStreak, className)} surface="dark" bleed={bleed}>
          <div className={styles.gymStreakHead}>
            <Icon name="star" size={14} className={styles.gymStreakIcon} />
            <div>
              <div className={styles.gymStreakTitle}>{props.title ?? "Gym streak"}</div>
              <div className={styles.gymStreakMeta}>
                {props.completed}/{props.total}
              </div>
            </div>
          </div>
          <div className={styles.gymStreakWeekdays}>
            {weekdays.map((label, index) => (
              <span key={`${label}-${index}`}>{label}</span>
            ))}
          </div>
          <div className={styles.gymStreakGrid} style={{ gridTemplateRows: `repeat(${rows}, 1fr)` }}>
            {props.dots.map((done, index) => (
              <span key={index} className={cx(styles.gymDot, done && styles.gymDotDone)} />
            ))}
          </div>
        </FitnessWidgetShell>
      );
    }

    case "heartRate": {
      const max = Math.max(...props.chartValues, props.rangeMax, 1);
      const labels = props.chartLabels ?? ["12 AM", "2 PM", "4 PM", "6 PM", "8 PM"];
      const avgY = 100 - (props.average / max) * 100;
      return (
        <FitnessWidgetShell className={cx(styles.heartRate, className)} surface="dark" bleed={bleed}>
          <div className={styles.heartRateHead}>
            <span className={styles.heartBadge}>
              <Icon name="heart" size={12} />
            </span>
            <div>
              <div className={styles.heartRateTitle}>{props.title ?? "Heart rate"}</div>
              {props.date && <div className={styles.heartRateDate}>{props.date}</div>}
            </div>
          </div>
          <div className={styles.heartRateStats}>
            <div>
              <span className={styles.heartRateStatLabel}>AVG</span>
              <DotMatrix size="md">{props.average}</DotMatrix>
              <span className={styles.heartRateStatUnit}>BPM</span>
            </div>
            <div>
              <span className={styles.heartRateStatLabel}>RANGE</span>
              <DotMatrix size="sm">{props.rangeMin}-{props.rangeMax}</DotMatrix>
              <span className={styles.heartRateStatUnit}>BPM</span>
            </div>
          </div>
          <div className={styles.heartRateChartWrap}>
            <div className={styles.heartRateYAxis}>
              <span>150</span>
              <span>100</span>
              <span>50</span>
              <span>0</span>
            </div>
            <div className={styles.heartRateChart}>
              <div className={styles.heartRateBars}>
                {props.chartValues.map((value, index) => (
                  <span
                    key={index}
                    className={styles.heartRateBar}
                    style={{ height: `${Math.max(8, (value / max) * 100)}%` }}
                  />
                ))}
              </div>
              <div className={styles.heartRateAvgLine} style={{ top: `${avgY}%` }}>
                <span className={styles.heartRateAvgDot} />
              </div>
              <div className={styles.heartRateXAxis}>
                {labels.map((label) => (
                  <span key={label}>{label}</span>
                ))}
              </div>
            </div>
          </div>
        </FitnessWidgetShell>
      );
    }

    case "progressTracker": {
      const { rows, columns, cells } = props;
      return (
        <FitnessWidgetShell className={cx(styles.progressTracker, className)} surface="pink" bleed={bleed}>
          <div className={styles.progressTitle}>{props.title ?? "Progress"}</div>
          <div className={styles.progressGridWrap}>
            <div
              className={styles.progressGrid}
              style={{ gridTemplateColumns: `repeat(${columns.length}, 1fr)`, gridTemplateRows: `repeat(${rows.length}, 1fr)` }}
            >
              {cells.map((done, index) => (
                <span key={index} className={cx(styles.progressCell, done ? styles.progressCellDone : styles.progressCellOpen)} />
              ))}
            </div>
            <div className={styles.progressRowLabels}>
              {rows.map((row) => (
                <span key={row}>{row}</span>
              ))}
            </div>
          </div>
          <div className={styles.progressColLabels} style={{ gridTemplateColumns: `repeat(${columns.length}, 1fr)` }}>
            {columns.map((col) => (
              <span key={col}>{col}</span>
            ))}
          </div>
        </FitnessWidgetShell>
      );
    }

    case "musicPlayer":
      return (
        <FitnessWidgetShell className={cx(styles.musicPlayer, className)} surface="dark" bleed={bleed}>
          <div className={styles.nowPlaying}>
            <div className={styles.albumArt} aria-hidden="true" />
            <div className={styles.nowPlayingMeta}>
              <div className={styles.nowPlayingTitle}>{props.title}</div>
              <div className={styles.nowPlayingArtist}>{props.artist}</div>
              <Icon name="heart" size={14} className={styles.nowPlayingHeart} />
            </div>
          </div>
          <div className={styles.musicControls}>
            <button type="button" className={styles.musicControlBtn} aria-label="Previous">
              <Icon name="skip-back" size={16} />
            </button>
            <PlayRing progress={props.progress ?? 42} />
            <button type="button" className={styles.musicControlBtn} aria-label="Next">
              <Icon name="skip-forward" size={16} />
            </button>
          </div>
          {props.upNext && props.upNext.length > 0 && (
            <div className={styles.upNext}>
              <div className={styles.upNextLabel}>Up Next</div>
              <div className={styles.upNextGrid}>
                {props.upNext.map((track) => (
                  <div key={track.title} className={styles.upNextItem}>
                    <span className={styles.upNextArt} style={track.swatch ? { background: track.swatch } : undefined} />
                    <span className={styles.upNextTitle}>{track.title}</span>
                    <span className={styles.upNextArtist}>{track.artist}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </FitnessWidgetShell>
      );

    case "stepsStreak":
      return (
        <FitnessWidgetShell className={cx(styles.stepsStreak, className)} surface="light" bleed={bleed}>
          <div className={styles.stepsBlock}>
            <div className={styles.stepsLabel}>{props.stepsLabel ?? "TOTAL STEPS"}</div>
            <DotMatrix size="lg" tone="dark">{props.steps}</DotMatrix>
          </div>
          <div className={styles.stepsBlock}>
            <div className={styles.stepsLabel}>{props.streakLabel ?? "STREAK"}</div>
            <DotMatrix size="lg" tone="dark">{props.streak}</DotMatrix>
          </div>
        </FitnessWidgetShell>
      );

    case "weather":
      return (
        <FitnessWidgetShell className={cx(styles.weather, className)} surface="dark" bleed={bleed}>
          <div className={styles.weatherCurrent}>
            <WeatherIcon kind="partly-cloudy" />
            <div>
              <DotMatrix size="xl">{props.temperature}</DotMatrix>
              <div className={styles.weatherHighLow}>
                H {props.high} · L {props.low}
              </div>
              <div className={styles.weatherLocation}>{props.location}</div>
              <div className={styles.weatherCondition}>{props.condition}</div>
            </div>
          </div>
          <div className={styles.weatherForecast}>
            {props.forecast.map((day) => (
              <div key={day.label} className={styles.weatherDay}>
                <span className={styles.weatherDayLabel}>{day.label}</span>
                <WeatherIcon kind={day.icon ?? "partly-cloudy"} />
                <span className={styles.weatherDayHigh}>{day.high}</span>
                <span className={styles.weatherDayLow}>{day.low}</span>
              </div>
            ))}
          </div>
        </FitnessWidgetShell>
      );

    case "weightTracker": {
      const tabs = props.tabs ?? ["WEIGHT", "BMI"];
      const activeTab = props.activeTab ?? tabs[0];
      const min = props.baseline;
      const max = props.max ?? Math.max(props.threshold + 2, ...props.values);
      const range = max - min || 1;
      const thresholdPct = ((props.threshold - min) / range) * 100;

      return (
        <FitnessWidgetShell className={cx(styles.weightTracker, className)} surface="light" bleed={bleed}>
          <div className={styles.weightHeader}>
            <div className={styles.weightTabs}>
              {tabs.map((tab) => (
                <span key={tab} className={cx(styles.weightTab, tab === activeTab && styles.weightTabActive)}>
                  {tab}
                </span>
              ))}
            </div>
            {props.change && <span className={styles.weightChange}>{props.change}</span>}
          </div>
          <div className={styles.weightChartWrap}>
            <div className={styles.weightYAxis}>
              <span className={styles.weightYThreshold} style={{ bottom: `${thresholdPct}%` }}>
                {props.threshold}
              </span>
              <span className={styles.weightYBaseline}>{props.baseline}</span>
            </div>
            <div className={styles.weightChart}>
              <div className={styles.weightThresholdLine} style={{ bottom: `${thresholdPct}%` }} />
              <div className={styles.weightBars}>
                {props.values.map((value, index) => {
                  const heightPct = Math.max(2, ((value - min) / range) * 100);
                  const splitPct = value > props.threshold ? ((value - props.threshold) / (value - min)) * 100 : 0;
                  const belowPct = 100 - splitPct;
                  return (
                    <div key={index} className={styles.weightBarCol} style={{ height: `${heightPct}%` }}>
                      {splitPct > 0 && <span className={styles.weightBarAbove} style={{ flex: splitPct }} />}
                      <span className={styles.weightBarBelow} style={{ flex: belowPct }} />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </FitnessWidgetShell>
      );
    }

    default:
      return null;
  }
}
