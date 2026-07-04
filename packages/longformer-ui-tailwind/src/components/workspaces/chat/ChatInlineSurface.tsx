import { Icon } from "../../../icons";
import { GeneratedSurface } from "../generated-ui/GeneratedSurface";
import type { GeneratedSurfaceSchema } from "../generated-ui/types";
import styles from "./ChatInlineSurface.tailwind";

export interface ChatInlineSurfaceProps {
  schema: GeneratedSurfaceSchema;
  /** Optional chrome label shown above the generated UI panel. */
  label?: string;
  /** When true, render without the bordered panel wrapper. */
  plain?: boolean;
}

/** Agent-generated UI embedded inside a chat thread — wraps GeneratedSurface with chat-native styling. */
export function ChatInlineSurface({ schema, label, plain }: ChatInlineSurfaceProps) {
  const body = (
    <div className={plain ? undefined : styles.inner}>
      <GeneratedSurface schema={schema} />
    </div>
  );

  if (plain) {
    return <div className={styles.surfacePlain}>{body}</div>;
  }

  return (
    <div className={styles.surface} role="group" aria-label={label ?? "Generated UI"}>
      {label && (
        <div className={styles.label}>
          <span className={styles.labelIcon} aria-hidden="true">
            <Icon name="sparkles" size={12} />
          </span>
          {label}
        </div>
      )}
      {body}
    </div>
  );
}
