export type GlassWidgetVariant =
  | "wifi"
  | "habits"
  | "gateInfo"
  | "audioRecording"
  | "analogClock"
  | "cameraRecording"
  | "timezoneWidget"
  | "rideShare"
  | "charging"
  | "flightArrival"
  | "navigation"
  | "energyUsage"
  | "musicWidget"
  | "scooterRide"
  | "activityOverview"
  | "activityCalendar";

export interface GlassWidgetWifi {
  variant: "wifi";
  title?: string;
  network: string;
  enabled?: boolean;
}

export interface GlassWidgetHabits {
  variant: "habits";
  label: string;
  remaining?: string;
  progress?: number;
}

export interface GlassWidgetGateInfo {
  variant: "gateInfo";
  gate: string;
  status: string;
  countdown: string;
}

export interface GlassWidgetAudioRecording {
  variant: "audioRecording";
  elapsed: string;
  waveform?: number[];
  recording?: boolean;
}

export interface GlassWidgetAnalogClock {
  variant: "analogClock";
  hours?: number;
  minutes?: number;
}

export interface GlassWidgetCameraRecording {
  variant: "cameraRecording";
  elapsed: string;
  recording?: boolean;
}

export interface GlassWidgetTimezone {
  variant: "timezoneWidget";
  location: string;
  time: string;
  dayProgress?: number;
  offsetLabel?: string;
  offsetTone?: "success" | "warning";
}

export interface GlassWidgetRideShare {
  variant: "rideShare";
  provider?: string;
  eta: string;
  vehicle: string;
  model?: string;
}

export interface GlassWidgetCharging {
  variant: "charging";
  percent: number;
  timeLeft: string;
}

export interface GlassWidgetFlightArrival {
  variant: "flightArrival";
  headline: string;
  origin: string;
  originCode?: string;
  destination: string;
  destinationCode?: string;
  progress?: number;
}

export interface GlassWidgetNavigation {
  variant: "navigation";
  turnDistance: string;
  eta: string;
  remaining: string;
  progress?: number;
}

export interface GlassWidgetEnergyUsage {
  variant: "energyUsage";
  percent: number;
  durationLabel?: string;
  chartValues?: number[];
}

export interface GlassWidgetMusic {
  variant: "musicWidget";
  title: string;
  artist: string;
  source?: string;
  progress?: number;
  playing?: boolean;
}

export interface GlassWidgetScooterRide {
  variant: "scooterRide";
  date?: string;
  distance: string;
  avgSpeed: string;
  calories: string;
}

export interface GlassWidgetActivityOverview {
  variant: "activityOverview";
  distance: string;
  goal: string;
  goalProgress?: number;
  duration: string;
  avgSpeed: string;
  calories: string;
}

export type GlassWidgetCalendarDayTone = "none" | "low" | "high" | "milestone";

export interface GlassWidgetCalendarDay {
  day: number;
  tone?: GlassWidgetCalendarDayTone;
}

export interface GlassWidgetActivityCalendar {
  variant: "activityCalendar";
  month: string;
  year?: string;
  days: GlassWidgetCalendarDay[];
  weekdayLabels?: string[];
}

export type GlassWidgetProps = (
  | GlassWidgetWifi
  | GlassWidgetHabits
  | GlassWidgetGateInfo
  | GlassWidgetAudioRecording
  | GlassWidgetAnalogClock
  | GlassWidgetCameraRecording
  | GlassWidgetTimezone
  | GlassWidgetRideShare
  | GlassWidgetCharging
  | GlassWidgetFlightArrival
  | GlassWidgetNavigation
  | GlassWidgetEnergyUsage
  | GlassWidgetMusic
  | GlassWidgetScooterRide
  | GlassWidgetActivityOverview
  | GlassWidgetActivityCalendar
) & {
  className?: string;
  size?: "sm" | "md" | "lg";
  theme?: import("./GlassWidgetShell").GlassWidgetTheme;
};
