import { cx } from "../../../utils/cx";
import styles from "./Avatar.tailwind";

export type AvatarSize = "sm" | "md" | "lg";
export type AvatarStatus = "online" | "away" | "offline";

export interface AvatarProps {
  name: string;
  src?: string;
  size?: AvatarSize;
  status?: AvatarStatus;
  className?: string;
}

function initialsFor(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function Avatar({ name, src, size = "md", status, className }: AvatarProps) {
  return (
    <span className={cx(styles.avatar, styles[size], className)} role="img" aria-label={name}>
      {src ? <img className={styles.image} src={src} alt="" /> : initialsFor(name)}
      {status && <span className={cx(styles.status, styles[status])} aria-hidden="true" />}
    </span>
  );
}
