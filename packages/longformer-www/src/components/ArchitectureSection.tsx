import { architectureLayers } from "../content/site-content";
import shared from "../styles/shared.module.css";
import styles from "./ArchitectureSection.module.css";

export function ArchitectureSection() {
  return (
    <section id="architecture" className={styles.section}>
      <div className={shared.sectionHeader}>
        <p className={shared.sectionEyebrow}>Architecture</p>
        <h2 className={shared.sectionTitle}>
          Not a dashboard.{" "}
          <span className={shared.sectionTitleMuted}>
            A shell that composes engines into one integrated experience.
          </span>
        </h2>
      </div>

      <div className={shared.card}>
        <div className={styles.stack}>
          {architectureLayers.map((layer, index) => (
            <div key={layer.label} className={styles.layer}>
              <div className={styles.layerIndex}>{index + 1}</div>
              <div>
                <h3 className={styles.layerLabel}>{layer.label}</h3>
                <p className={styles.layerDetail}>{layer.detail}</p>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.callout}>
          <p className={styles.calloutTitle}>Longformer composes — it does not replace</p>
          <p className={styles.calloutBody}>
            OpenClaw gateway for agent orchestration. OpenHands agent-canvas for
            code sandboxes. OpenUI for streamed and generated interfaces. Optional
            Odysseus services for productivity and memory — each engine keeps its
            runtime; Longformer owns presentation and focus.
          </p>
          <p className={styles.calloutMeta}>
            See <code>Project-planning.md</code> in the UI Experiments repo root.
          </p>
        </div>
      </div>
    </section>
  );
}
