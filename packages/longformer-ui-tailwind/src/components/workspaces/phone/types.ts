export type PhoneCallPhase = "dialer" | "outgoing" | "active";

export interface PhoneCallControls {
  muted?: boolean;
  speaker?: boolean;
  video?: boolean;
  onHold?: boolean;
}
