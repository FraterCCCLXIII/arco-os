import type { ReactNode } from "react";
import { cx } from "../../../utils/cx";
import { Icon } from "../../../icons";
import { GlassWidgetShell } from "./GlassWidgetShell";
import styles from "./GlassWidget.module.css";
import type { GlassWidgetProps } from "./types";

function clampProgress(value?: number) {
  return Math.max(0, Math.min(100, value ?? 0));
}

function RingGauge({
  progress,
  size = 56,
  tone = "green",
  children,
}: {
  progress: number;
  size?: number;
  tone?: "green" | "orange";
  children?: ReactNode;
}) {
  const r = (size - 8) / 2;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - clampProgress(progress) / 100);
  return (
    <div className={styles.ringGauge}>
      <svg width={size} height={size} aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={r} className={styles.ringTrack} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          className={cx(styles.ringFill, tone === "orange" && styles.ringFillOrange)}
          strokeDasharray={c}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      {children && <div className={styles.ringCenter}>{children}</div>}
    </div>
  );
}

function Waveform({ values }: { values: number[] }) {
  const max = Math.max(...values, 1);
  return (
    <div className={styles.waveform} aria-hidden="true">
      {values.map((value, index) => (
        <span key={index} className={styles.waveBar} style={{ height: `${Math.max(20, (value / max) * 100)}%` }} />
      ))}
    </div>
  );
}

const DEFAULT_WAVEFORM = [18, 32, 24, 40, 28, 36, 22, 44, 30, 38, 26, 34, 20, 42, 28, 36];

/** Glassmorphic squircle dashboard widget — variant picks layout and visualization. */
export function GlassWidget(props: GlassWidgetProps) {
  const { className } = props;

  switch (props.variant) {
    case "wifi": {
      const theme = props.theme ?? "light";
      return (
        <GlassWidgetShell className={className} size={props.size ?? "sm"} theme={theme}>
          <div className={styles.headRow}>
            <span className={styles.iconBadge}>
              <Icon name="wifi" size={18} />
            </span>
            <button
              type="button"
              className={cx(styles.toggle, props.enabled !== false && styles.toggleOn)}
              aria-label={props.enabled !== false ? "Disable WiFi" : "Enable WiFi"}
            >
              <span className={styles.toggleKnob} />
            </button>
          </div>
          <div>
            <div className={styles.title}>{props.title ?? "WiFi"}</div>
            <div className={styles.network}>{props.network}</div>
          </div>
        </GlassWidgetShell>
      );
    }
    case "habits": {
      return (
        <GlassWidgetShell className={className} size={props.size ?? "sm"} theme={props.theme ?? "dark"}>
          <div className={styles.habitRow}>
            <div className={styles.habitMeta}>
              <div className={styles.habitLabel}>{props.label}</div>
              {props.remaining && <div className={styles.habitRemaining}>{props.remaining}</div>}
            </div>
            <RingGauge progress={props.progress ?? 72} tone="orange">
              <Icon name="leaf" size={16} />
            </RingGauge>
          </div>
        </GlassWidgetShell>
      );
    }
    case "gateInfo": {
      return (
        <GlassWidgetShell className={cx(styles.stretch, className)} size={props.size ?? "sm"} theme={props.theme ?? "light"}>
          <div className={styles.gateValue}>{props.gate}</div>
          <div className={styles.gateStatus}>{props.status}</div>
          <div className={styles.gateCountdown}>{props.countdown}</div>
        </GlassWidgetShell>
      );
    }
    case "audioRecording": {
      const waveform = props.waveform ?? DEFAULT_WAVEFORM;
      return (
        <GlassWidgetShell className={className} size={props.size ?? "sm"} theme={props.theme ?? "dark"}>
          <Waveform values={waveform} />
          <div className={styles.recordFooter}>
            <span className={styles.recordTime}>{props.elapsed}</span>
            <button type="button" className={styles.recordButton} aria-label={props.recording !== false ? "Pause" : "Resume"}>
              <Icon name={props.recording !== false ? "pause" : "play"} size={16} />
            </button>
          </div>
        </GlassWidgetShell>
      );
    }
    case "analogClock": {
      const hours = props.hours ?? 10;
      const minutes = props.minutes ?? 25;
      const hourAngle = ((hours % 12) + minutes / 60) * 30;
      const minuteAngle = minutes * 6;
      const secondAngle = (minutes * 60) % 360;
      return (
        <GlassWidgetShell className={className} size={props.size ?? "sm"} theme={props.theme ?? "light"}>
          <div className={styles.clockFace}>
            <svg viewBox="0 0 100 100" className={styles.clockSvg} aria-hidden="true">
              <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeOpacity="0.08" strokeWidth="2" />
              <text x="50" y="16" textAnchor="middle" className={styles.clockNumeral}>XII</text>
              <text x="86" y="54" textAnchor="middle" className={styles.clockNumeral}>III</text>
              <text x="50" y="92" textAnchor="middle" className={styles.clockNumeral}>VI</text>
              <text x="14" y="54" textAnchor="middle" className={styles.clockNumeral}>IX</text>
              <line
                x1="50"
                y1="50"
                x2="50"
                y2="28"
                className={styles.clockHand}
                strokeWidth="3"
                transform={`rotate(${hourAngle} 50 50)`}
              />
              <line
                x1="50"
                y1="50"
                x2="50"
                y2="18"
                className={styles.clockHand}
                strokeWidth="2"
                transform={`rotate(${minuteAngle} 50 50)`}
              />
              <line
                x1="50"
                y1="50"
                x2="50"
                y2="14"
                className={cx(styles.clockHand, styles.clockSecond)}
                strokeWidth="1.5"
                transform={`rotate(${secondAngle} 50 50)`}
              />
            </svg>
          </div>
        </GlassWidgetShell>
      );
    }
    case "cameraRecording": {
      return (
        <GlassWidgetShell className={className} size={props.size ?? "sm"} theme={props.theme ?? "light"}>
          <div className={styles.cameraHead}>
            <span className={styles.iconBadge}>
              <Icon name="video" size={16} />
            </span>
            <span className={styles.cameraStatus}>Recording</span>
          </div>
          <div className={styles.recordFooter}>
            <span className={styles.recordTime}>{props.elapsed}</span>
            <button type="button" className={styles.recordButton} aria-label="Stop recording">
              <Icon name="square" size={12} />
            </button>
          </div>
        </GlassWidgetShell>
      );
    }
    case "timezoneWidget": {
      const theme = props.theme ?? "light";
      return (
        <GlassWidgetShell className={className} size={props.size ?? "sm"} theme={theme}>
          <div className={styles.timezoneTop}>
            <div className={styles.timezoneLocation}>{props.location}</div>
            <div className={styles.timezoneTime}>{props.time}</div>
          </div>
          <div className={styles.dayTrack}>
            <span className={styles.dayFill} style={{ width: `${clampProgress(props.dayProgress ?? 58)}%` }} />
          </div>
          {props.offsetLabel && (
            <span
              className={cx(
                styles.offsetPill,
                props.offsetTone === "warning" ? styles.offsetWarning : styles.offsetSuccess,
              )}
            >
              {props.offsetLabel}
            </span>
          )}
        </GlassWidgetShell>
      );
    }
    case "rideShare": {
      return (
        <GlassWidgetShell className={className} size={props.size ?? "sm"} theme={props.theme ?? "light"}>
          <div className={styles.rideHead}>
            <span className={styles.rideBrand}>{props.provider ?? "Uber"}</span>
            <span className={styles.rideEta}>{props.eta}</span>
          </div>
          <div className={styles.carArt} aria-hidden="true">
            <span className={styles.carBody} />
          </div>
          <div className={styles.vehicleMeta}>
            {props.vehicle}
            {props.model && ` · ${props.model}`}
          </div>
        </GlassWidgetShell>
      );
    }
    case "charging": {
      const percent = clampProgress(props.percent);
      return (
        <GlassWidgetShell className={className} size={props.size ?? "sm"} theme={props.theme ?? "dark"}>
          <div className={styles.chargeHead}>
            <span className={cx(styles.iconBadge, styles.iconBadgeGreen)}>
              <Icon name="zap" size={16} />
            </span>
            <span>
              {percent}% · {props.timeLeft}
            </span>
          </div>
          <div className={styles.chargeBar}>
            <span className={styles.chargeFill} style={{ width: `${percent}%` }} />
          </div>
        </GlassWidgetShell>
      );
    }
    case "flightArrival": {
      const progress = clampProgress(props.progress ?? 68);
      return (
        <GlassWidgetShell className={className} size={props.size ?? "md"} theme={props.theme ?? "dark"}>
          <div className={styles.flightHeadline}>{props.headline}</div>
          <div className={styles.flightRoute}>
            <div>
              <div className={styles.flightCity}>{props.originCode ?? props.origin}</div>
              <div className={styles.flightCode}>{props.origin}</div>
            </div>
            <Icon name="plane" size={14} />
            <div style={{ textAlign: "right" }}>
              <div className={styles.flightCity}>{props.destinationCode ?? props.destination}</div>
              <div className={styles.flightCode}>{props.destination}</div>
            </div>
          </div>
          <div className={styles.flightTrack}>
            <span className={styles.flightFill} style={{ width: `${progress}%` }} />
            <span className={styles.flightPlane} style={{ left: `${progress}%` }}>
              <Icon name="plane" size={12} />
            </span>
          </div>
        </GlassWidgetShell>
      );
    }
    case "navigation": {
      return (
        <GlassWidgetShell className={className} size={props.size ?? "md"} theme={props.theme ?? "dark"}>
          <div className={styles.navTop}>
            <div>
              <div className={styles.navTurn}>{props.turnDistance}</div>
              <div className={styles.navEta}>ETA {props.eta}</div>
            </div>
            <RingGauge progress={props.progress ?? 58} size={64}>
              <div>
                <div className={styles.activityGoalLabel}>left</div>
                <div className={styles.scooterValue}>{props.remaining}</div>
              </div>
            </RingGauge>
          </div>
        </GlassWidgetShell>
      );
    }
    case "energyUsage": {
      const values = props.chartValues ?? [32, 48, 36, 52, 44];
      const max = Math.max(...values, 1);
      return (
        <GlassWidgetShell className={className} size={props.size ?? "md"} theme={props.theme ?? "light"}>
          <div className={styles.energyHead}>
            <span className={styles.energyPercent}>{props.percent}%</span>
            <Icon name="zap" size={18} />
          </div>
          <div className={styles.energyChart}>
            {values.map((value, index) => (
              <span key={index} className={styles.energyBar} style={{ height: `${Math.max(16, (value / max) * 100)}%` }} />
            ))}
          </div>
          {props.durationLabel && <div className={styles.energyLabel}>{props.durationLabel}</div>}
        </GlassWidgetShell>
      );
    }
    case "musicWidget": {
      const progress = clampProgress(props.progress ?? 42);
      return (
        <GlassWidgetShell className={className} size={props.size ?? "md"} theme={props.theme ?? "light"}>
          <div className={styles.musicRow}>
            <div className={styles.albumArt} aria-hidden="true" />
            <div className={styles.musicMeta}>
              <div className={styles.musicTitle}>{props.title}</div>
              <div className={styles.musicArtist}>{props.artist}</div>
              {props.source && (
                <div className={styles.musicSource}>
                  <Icon name="sparkles" size={10} />
                  {props.source}
                </div>
              )}
            </div>
          </div>
          <div className={styles.musicProgress}>
            <span className={styles.musicProgressFill} style={{ width: `${progress}%` }} />
          </div>
          <div className={styles.musicControls}>
            <button type="button" className={styles.controlBtn} aria-label="Shuffle">
              <Icon name="shuffle" size={14} />
            </button>
            <button type="button" className={styles.controlBtn} aria-label="Previous">
              <Icon name="skip-back" size={16} />
            </button>
            <button type="button" className={cx(styles.controlBtn, styles.playBtn)} aria-label={props.playing ? "Pause" : "Play"}>
              <Icon name={props.playing ? "pause" : "play"} size={16} />
            </button>
            <button type="button" className={styles.controlBtn} aria-label="Next">
              <Icon name="skip-forward" size={16} />
            </button>
            <button type="button" className={styles.controlBtn} aria-label="Repeat">
              <Icon name="repeat" size={14} />
            </button>
          </div>
        </GlassWidgetShell>
      );
    }
    case "scooterRide": {
      return (
        <GlassWidgetShell className={cx(styles.stretch, className)} size={props.size ?? "md"} theme={props.theme ?? "light"}>
          <div className={styles.scooterHead}>
            {props.date && <span className={styles.scooterDate}>{props.date}</span>}
            <Icon name="leaf" size={16} />
          </div>
          <div className={styles.scooterStats}>
            <div className={styles.scooterStat}>
              <span className={styles.scooterValue}>{props.distance}</span>
              <span className={styles.scooterLabel}>Distance</span>
            </div>
            <div className={styles.scooterStat}>
              <span className={styles.scooterValue}>{props.avgSpeed}</span>
              <span className={styles.scooterLabel}>Avg speed</span>
            </div>
            <div className={styles.scooterStat}>
              <span className={styles.scooterValue}>{props.calories}</span>
              <span className={styles.scooterLabel}>Calories</span>
            </div>
          </div>
        </GlassWidgetShell>
      );
    }
    case "activityOverview": {
      return (
        <GlassWidgetShell className={cx(styles.stretch, className)} size={props.size ?? "lg"} theme={props.theme ?? "light"}>
          <div className={styles.activityHero}>
            <div>
              <div className={styles.activityDistance}>{props.distance}</div>
            </div>
            <RingGauge progress={props.goalProgress ?? 44} size={72}>
              <div>
                <div className={styles.activityGoalLabel}>Goal</div>
                <div className={styles.scooterValue}>{props.goal}</div>
              </div>
            </RingGauge>
          </div>
          <div className={styles.activityStats}>
            <div className={styles.scooterStat}>
              <span className={styles.scooterValue}>{props.duration}</span>
              <span className={styles.scooterLabel}>Duration</span>
            </div>
            <div className={styles.scooterStat}>
              <span className={styles.scooterValue}>{props.avgSpeed}</span>
              <span className={styles.scooterLabel}>Avg speed</span>
            </div>
            <div className={styles.scooterStat}>
              <span className={styles.scooterValue}>{props.calories}</span>
              <span className={styles.scooterLabel}>Calories</span>
            </div>
          </div>
        </GlassWidgetShell>
      );
    }
    case "activityCalendar": {
      const weekdays = props.weekdayLabels ?? ["M", "T", "W", "T", "F", "S", "S"];
      return (
        <GlassWidgetShell className={className} size={props.size ?? "lg"} theme={props.theme ?? "dark"}>
          <div className={styles.calendarHead}>
            <span className={styles.calendarMonth}>{props.month}</span>
            {props.year && <span className={styles.subtitle}>{props.year}</span>}
          </div>
          <div className={styles.calendarWeekdays}>
            {weekdays.map((label, index) => (
              <span key={`${label}-${index}`}>{label}</span>
            ))}
          </div>
          <div className={styles.calendarGrid}>
            {props.days.map((day) => (
              <span
                key={day.day}
                className={cx(
                  styles.calendarDay,
                  day.tone === "high" && styles.calendarDayHigh,
                  day.tone === "milestone" && styles.calendarDayMilestone,
                  day.tone === "low" && styles.calendarDayLow,
                  (!day.tone || day.tone === "none") && styles.calendarDayNone,
                )}
              >
                {day.day}
              </span>
            ))}
          </div>
        </GlassWidgetShell>
      );
    }
    default:
      return null;
  }
}
