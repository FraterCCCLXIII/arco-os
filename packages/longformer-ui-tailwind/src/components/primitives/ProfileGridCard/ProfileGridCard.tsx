import { cx } from "../../../utils/cx";
import { Icon } from "../../../icons";
import { Card } from "../Card";
import styles from "./ProfileGridCard.tailwind";

export interface ProfileGridItem {
  username: string;
  dateLabel: string;
  avatarName?: string;
  avatarSrc?: string;
  avatarColor?: string;
}

export interface ProfileGridCardProps {
  profiles?: ProfileGridItem[];
  columns?: 2 | 3 | 4;
  className?: string;
}

export const DEFAULT_PROFILE_GRID: ProfileGridItem[] = [
  { username: "StarrySky_07", dateLabel: "Jan 15, 2026", avatarName: "Starry Sky", avatarColor: "#f97316" },
  { username: "WaffleWarrior", dateLabel: "Jan 6, 2026", avatarName: "Waffle Warrior", avatarColor: "#ec4899" },
  { username: "CriticalHit99", dateLabel: "Dec 28, 2025", avatarName: "Critical Hit", avatarColor: "#38bdf8" },
  { username: "lunavia_27", dateLabel: "Dec 23, 2025", avatarName: "Lunavia", avatarColor: "#22c55e" },
  { username: "DataBloom_21", dateLabel: "Dec 18, 2025", avatarName: "Data Bloom", avatarColor: "#a855f7" },
  { username: "SlowComet", dateLabel: "Dec 15, 2025", avatarName: "Slow Comet", avatarColor: "#eab308" },
];

function initialsFor(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/** Recent profiles grid — avatar tiles with username and joined date. */
export function ProfileGridCard({
  profiles = DEFAULT_PROFILE_GRID,
  columns = 3,
  className,
}: ProfileGridCardProps) {
  return (
    <Card padding="lg" className={cx(styles.card, className)}>
      <div className={styles.grid} style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
        {profiles.map((profile) => {
          const avatarLabel = profile.avatarName ?? profile.username;

          return (
            <div key={profile.username} className={styles.profileTile}>
              <span
                className={styles.avatar}
                style={{ background: profile.avatarColor ?? "var(--lf-surface-3)" }}
                role="img"
                aria-label={avatarLabel}
              >
                {profile.avatarSrc ? (
                  <img className={styles.avatarImage} src={profile.avatarSrc} alt="" />
                ) : (
                  initialsFor(avatarLabel)
                )}
              </span>
              <div className={styles.username}>{profile.username}</div>
              <div className={styles.dateRow}>
                <Icon name="clock" size={12} />
                <span>{profile.dateLabel}</span>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
