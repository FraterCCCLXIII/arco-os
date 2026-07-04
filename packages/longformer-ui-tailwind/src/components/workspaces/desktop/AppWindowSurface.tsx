import { GeneratedSurface } from "../generated-ui/GeneratedSurface";
import type { GeneratedSurfaceSchema } from "../generated-ui/types";
import styles from "./AppWindowSurface.tailwind";

export interface AppWindowSurfaceProps {
  schema: GeneratedSurfaceSchema;
}

/** Standard scrollable body for desktop app windows — renders a generated UI schema. */
export function AppWindowSurface({ schema }: AppWindowSurfaceProps) {
  return (
    <div className={styles.root}>
      <div className={styles.page}>
        <GeneratedSurface schema={schema} />
      </div>
    </div>
  );
}
