import { useState } from "react";
import { Icon } from "../../../icons";
import { Button } from "../../primitives/Button";
import { Input } from "../../primitives/Input";
import { cx } from "../../../utils/cx";
import type { LifeModuleId, LifePlanningWorkspaceData } from "./types";
import styles from "./AiCoachView.module.css";

export interface AiCoachViewProps {
  data: LifePlanningWorkspaceData;
  onNavigateModule?: (moduleId: LifeModuleId) => void;
}

const MODULE_LABELS: Record<LifeModuleId, string> = {
  health: "Health",
  mind: "Mind",
  finances: "Finances",
  housing: "Housing",
  investments: "Investments",
  retirement: "Retirement",
};

/** AI life coach — conversational guidance, recommendations, and weekly focus. */
export function AiCoachView({ data, onNavigateModule }: AiCoachViewProps) {
  const { aiCoach } = data;
  const [composerValue, setComposerValue] = useState("");

  return (
    <div className={styles.view}>
      <div className={styles.chatPanel}>
        <header className={styles.chatHeader}>
          <h1 className={styles.chatTitle}>
            <Icon name="sparkles" size={20} />
            AI Life Coach
          </h1>
          <p className={styles.chatSubtitle}>{aiCoach.greeting}</p>
        </header>

        <div className={styles.messages} role="log" aria-label="Coach conversation">
          {aiCoach.messages.map((message) => (
            <div
              key={message.id}
              className={cx(styles.message, message.role === "user" && styles.messageUser)}
            >
              <span
                className={cx(
                  styles.messageAvatar,
                  message.role === "user" && styles.messageAvatarUser,
                )}
              >
                <Icon name={message.role === "assistant" ? "sparkles" : "users"} size={14} />
              </span>
              <div>
                <div
                  className={cx(
                    styles.messageBubble,
                    message.role === "assistant"
                      ? styles.messageBubbleAssistant
                      : styles.messageBubbleUser,
                  )}
                >
                  {message.content}
                </div>
                <div className={styles.messageMeta}>{message.timestamp}</div>
                {message.relatedModule && (
                  <button
                    type="button"
                    className={styles.messageModuleTag}
                    onClick={() => onNavigateModule?.(message.relatedModule!)}
                  >
                    {MODULE_LABELS[message.relatedModule]}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className={styles.composer}>
          <Input
            placeholder="Ask your coach anything about your goals..."
            value={composerValue}
            onChange={(event) => setComposerValue(event.target.value)}
            startSlot={<Icon name="sparkles" size={16} />}
            endSlot={
              <Button type="button" variant="primary" size="sm" iconOnly aria-label="Send">
                <Icon name="send" size={14} />
              </Button>
            }
          />
          <p className={styles.composerHint}>
            Your coach has context across all {data.modules.length} life modules
          </p>
        </div>
      </div>

      <aside className={styles.sidePanel}>
        <section className={styles.sideSection}>
          <h2 className={styles.sideSectionTitle}>This Week&apos;s Focus</h2>
          <div className={styles.focusCard}>
            <p className={styles.focusText}>{aiCoach.weeklyFocus}</p>
          </div>
        </section>

        <section className={styles.sideSection}>
          <h2 className={styles.sideSectionTitle}>Recommendations</h2>
          {aiCoach.recommendations.map((rec) => (
            <div key={rec.id} className={styles.recommendation}>
              <div className={styles.recommendationHead}>
                <span className={styles.recommendationTitle}>{rec.title}</span>
                <span
                  className={cx(
                    styles.priorityBadge,
                    rec.priority === "high"
                      ? styles.priorityHigh
                      : rec.priority === "medium"
                        ? styles.priorityMedium
                        : styles.priorityLow,
                  )}
                >
                  {rec.priority}
                </span>
              </div>
              <p className={styles.recommendationText}>{rec.description}</p>
              {rec.actionLabel && (
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => onNavigateModule?.(rec.moduleId)}
                >
                  {rec.actionLabel}
                </Button>
              )}
            </div>
          ))}
        </section>

        <section className={styles.sideSection}>
          <h2 className={styles.sideSectionTitle}>Quick Links</h2>
          <div className={styles.moduleQuickLinks}>
            {data.modules.map((module) => (
              <button
                key={module.id}
                type="button"
                className={styles.moduleChip}
                onClick={() => onNavigateModule?.(module.id)}
              >
                <Icon name={module.icon} size={12} />
                {module.label}
              </button>
            ))}
          </div>
        </section>
      </aside>
    </div>
  );
}
