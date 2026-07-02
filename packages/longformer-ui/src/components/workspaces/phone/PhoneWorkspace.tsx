import { useEffect, useMemo, useState } from "react";
import { Icon, type IconName } from "../../../icons";
import { cx } from "../../../utils/cx";
import { Avatar } from "../../primitives/Avatar";
import {
  DIAL_PAD_KEYS,
  DIAL_PAD_LETTERS,
  type DialPadKey,
  type PhoneContact,
} from "../contacts/types";
import type { PhoneCallControls, PhoneCallPhase } from "./types";
import styles from "./PhoneWorkspace.module.css";

export interface PhoneWorkspaceProps {
  dialValue: string;
  onDialChange: (value: string) => void;
  contacts?: PhoneContact[];
  activeContact?: PhoneContact;
  phase?: PhoneCallPhase;
  defaultPhase?: PhoneCallPhase;
  onPhaseChange?: (phase: PhoneCallPhase) => void;
  className?: string;
}

const ACTIVE_CONTROLS: { icon: IconName; label: string; key: keyof PhoneCallControls }[] = [
  { icon: "mic", label: "Mute", key: "muted" },
  { icon: "hash", label: "Keypad", key: "onHold" },
  { icon: "volume", label: "Speaker", key: "speaker" },
  { icon: "plus", label: "Add call", key: "onHold" },
  { icon: "video", label: "Video", key: "video" },
  { icon: "pause", label: "Hold", key: "onHold" },
];

const OUTGOING_CONTROLS: { icon: IconName; label: string }[] = [
  { icon: "message-square", label: "Message" },
  { icon: "video", label: "Video call" },
  { icon: "volume", label: "Speaker" },
];

function normalizePhone(value: string): string {
  return value.replace(/\D/g, "");
}

function formatElapsed(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

/** Soft-neumorphic phone app with dialer, outgoing, and active call screens. */
export function PhoneWorkspace({
  dialValue,
  onDialChange,
  contacts = [],
  activeContact,
  phase: controlledPhase,
  defaultPhase = "dialer",
  onPhaseChange,
  className,
}: PhoneWorkspaceProps) {
  const [internalPhase, setInternalPhase] = useState<PhoneCallPhase>(defaultPhase);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [controls, setControls] = useState<PhoneCallControls>({});

  const phase = controlledPhase ?? internalPhase;

  const matchedContact = useMemo(() => {
    if (activeContact) return activeContact;
    const normalizedDial = normalizePhone(dialValue);
    if (!normalizedDial) return undefined;
    return contacts.find((contact) => normalizePhone(contact.phone) === normalizedDial);
  }, [activeContact, contacts, dialValue]);

  const displayName =
    phase === "dialer"
      ? dialValue || "Enter number"
      : (matchedContact?.name ?? dialValue) || "Unknown caller";
  const statusLabel =
    phase === "dialer"
      ? dialValue
        ? "Ready to call"
        : "Dial a number"
      : phase === "outgoing"
        ? "Calling..."
        : formatElapsed(elapsedSeconds);

  function setPhase(next: PhoneCallPhase) {
    if (onPhaseChange) onPhaseChange(next);
    else setInternalPhase(next);
  }

  function appendKey(key: DialPadKey) {
    onDialChange(dialValue + key);
  }

  function startCall() {
    if (!dialValue.trim()) return;
    setElapsedSeconds(0);
    setControls({});
    setPhase("outgoing");
  }

  function acceptCall() {
    setElapsedSeconds(0);
    setPhase("active");
  }

  function endCall() {
    setElapsedSeconds(0);
    setControls({});
    setPhase("dialer");
  }

  function toggleControl(key: keyof PhoneCallControls) {
    setControls((current) => ({ ...current, [key]: !current[key] }));
  }

  useEffect(() => {
    if (phase !== "active") return undefined;

    const timer = window.setInterval(() => {
      setElapsedSeconds((current) => current + 1);
    }, 1000);

    return () => window.clearInterval(timer);
  }, [phase]);

  return (
    <div className={cx(styles.workspace, className)} aria-label="Phone">
      <header className={styles.header}>
        {phase !== "dialer" && matchedContact && (
          <div className={styles.avatarWrap}>
            <Avatar
              className={styles.avatar}
              name={matchedContact.name}
              src={matchedContact.avatarSrc}
              size="lg"
            />
          </div>
        )}
        <div className={styles.primaryLabel}>{displayName}</div>
        <div className={styles.secondaryLabel}>{statusLabel}</div>
      </header>

      <div className={styles.body}>
        {phase === "dialer" && (
          <div className={styles.keypad} role="group" aria-label="Dial pad">
            {DIAL_PAD_KEYS.flat().map((key, index) =>
              key ? (
                <button
                  key={key}
                  type="button"
                  className={cx("lf-focusable", styles.key)}
                  aria-label={key}
                  onClick={() => appendKey(key)}
                >
                  <span className={styles.keyDigit}>{key}</span>
                  {DIAL_PAD_LETTERS[key] && (
                    <span className={styles.keyLetters}>{DIAL_PAD_LETTERS[key]}</span>
                  )}
                </button>
              ) : (
                <span key={`spacer-${index}`} className={styles.keySpacer} />
              ),
            )}
          </div>
        )}

        {phase === "outgoing" && (
          <div className={styles.inlineControls}>
            {OUTGOING_CONTROLS.map((control) => (
              <button
                key={control.label}
                type="button"
                className={cx("lf-focusable", styles.controlButton)}
                aria-label={control.label}
              >
                <Icon name={control.icon} size={20} />
              </button>
            ))}
          </div>
        )}

        {phase === "active" && (
          <div className={styles.controlsGrid}>
            {ACTIVE_CONTROLS.map((control) => (
              <button
                key={control.label}
                type="button"
                className={cx(
                  "lf-focusable",
                  styles.controlButton,
                  controls[control.key] && styles.controlButtonActive,
                )}
                aria-label={control.label}
                aria-pressed={Boolean(controls[control.key])}
                onClick={() => toggleControl(control.key)}
              >
                <Icon name={control.icon} size={20} />
              </button>
            ))}
          </div>
        )}
      </div>

      <footer
        className={cx(
          styles.footer,
          phase === "active" && styles.footerSingle,
        )}
      >
        {phase === "dialer" && (
          <>
            <button
              type="button"
              className={cx("lf-focusable", styles.actionButton, styles.actionAccept)}
              aria-label="Call"
              disabled={!dialValue.trim()}
              onClick={startCall}
            >
              <span className={styles.actionIcon}>
                <Icon name="phone-call" size={24} />
              </span>
            </button>
            <button
              type="button"
              className={cx("lf-focusable", styles.actionButton, styles.actionDecline)}
              aria-label="Clear number"
              disabled={!dialValue.trim()}
              onClick={() => onDialChange("")}
            >
              <span className={cx(styles.actionIcon, styles.actionIconDecline)}>
                <Icon name="phone-call" size={24} />
              </span>
            </button>
          </>
        )}

        {phase === "outgoing" && (
          <>
            <button
              type="button"
              className={cx("lf-focusable", styles.actionButton, styles.actionAccept)}
              aria-label="Accept call"
              onClick={acceptCall}
            >
              <span className={styles.actionIcon}>
                <Icon name="phone-call" size={24} />
              </span>
            </button>
            <button
              type="button"
              className={cx("lf-focusable", styles.actionButton, styles.actionDecline)}
              aria-label="Decline call"
              onClick={endCall}
            >
              <span className={cx(styles.actionIcon, styles.actionIconDecline)}>
                <Icon name="phone-call" size={24} />
              </span>
            </button>
          </>
        )}

        {phase === "active" && (
          <button
            type="button"
            className={cx("lf-focusable", styles.actionButton, styles.actionEnd)}
            aria-label="End call"
            onClick={endCall}
          >
            <span className={cx(styles.actionIcon, styles.actionIconDecline)}>
              <Icon name="phone-call" size={24} />
            </span>
          </button>
        )}
      </footer>
    </div>
  );
}

export type { PhoneCallControls, PhoneCallPhase } from "./types";
export type { PhoneContact } from "../contacts/types";
