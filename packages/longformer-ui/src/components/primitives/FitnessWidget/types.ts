export type FitnessWidgetVariant =
  | "workoutPhoto"
  | "hiking"
  | "running"
  | "gymStreak"
  | "heartRate"
  | "progressTracker"
  | "musicPlayer"
  | "stepsStreak"
  | "weather"
  | "weightTracker";

export interface FitnessWidgetWorkoutPhoto {
  variant: "workoutPhoto";
  totalTime: string;
  totalTimeLabel?: string;
  imageUrl?: string;
}

export interface FitnessWidgetHiking {
  variant: "hiking";
  label?: string;
  distance: string;
  unit?: string;
  actionLabel?: string;
}

export interface FitnessWidgetRunning {
  variant: "running";
  date?: string;
  label?: string;
  distance: string;
  unit?: string;
  actionLabel?: string;
}

export interface FitnessWidgetGymStreak {
  variant: "gymStreak";
  title?: string;
  completed: number;
  total: number;
  /** 7 weekday labels, e.g. M T W T F S S */
  weekdays?: string[];
  /** Flat grid of booleans — completed dots, row-major (weeks × 7) */
  dots: boolean[];
}

export interface FitnessWidgetHeartRate {
  variant: "heartRate";
  title?: string;
  date?: string;
  average: number;
  rangeMin: number;
  rangeMax: number;
  chartValues: number[];
  chartLabels?: string[];
}

export interface FitnessWidgetProgressTracker {
  variant: "progressTracker";
  title?: string;
  /** Row labels (days), e.g. MON … SUN */
  rows: string[];
  /** Column labels (habits), e.g. GYM, HIKING */
  columns: string[];
  /** Flat grid of booleans — completed cells, row-major */
  cells: boolean[];
}

export interface FitnessWidgetMusicPlayer {
  variant: "musicPlayer";
  title: string;
  artist: string;
  progress?: number;
  playing?: boolean;
  upNext?: { title: string; artist: string; swatch?: string }[];
}

export interface FitnessWidgetStepsStreak {
  variant: "stepsStreak";
  stepsLabel?: string;
  steps: string;
  streakLabel?: string;
  streak: string;
}

export interface FitnessWidgetWeatherDay {
  label: string;
  high: string;
  low: string;
  icon?: "sun" | "cloud" | "partly-cloudy";
}

export interface FitnessWidgetWeather {
  variant: "weather";
  temperature: string;
  high: string;
  low: string;
  location: string;
  condition: string;
  forecast: FitnessWidgetWeatherDay[];
}

export interface FitnessWidgetWeightTracker {
  variant: "weightTracker";
  tabs?: string[];
  activeTab?: string;
  change?: string;
  /** Y-axis baseline label (e.g. 89) */
  baseline: number;
  /** Threshold shown as dashed red line (e.g. 92) */
  threshold: number;
  /** Chart maximum for scale (defaults above threshold) */
  max?: number;
  values: number[];
}

export type FitnessWidgetProps = (
  | FitnessWidgetWorkoutPhoto
  | FitnessWidgetHiking
  | FitnessWidgetRunning
  | FitnessWidgetGymStreak
  | FitnessWidgetHeartRate
  | FitnessWidgetProgressTracker
  | FitnessWidgetMusicPlayer
  | FitnessWidgetStepsStreak
  | FitnessWidgetWeather
  | FitnessWidgetWeightTracker
) & {
  className?: string;
  bleed?: boolean;
};
