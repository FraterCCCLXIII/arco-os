export type DesignCardVariant =
  | "flight"
  | "order"
  | "glucose"
  | "delivery"
  | "espresso"
  | "iss"
  | "workout"
  | "race"
  | "transit"
  | "heartRate"
  | "sleep"
  | "subwayNav"
  | "wishlist"
  | "weeklyRings"
  | "podcast"
  | "weather"
  | "network"
  | "sportsScore"
  | "billing"
  | "activityGoals"
  | "airpods"
  | "laundry"
  | "stockQuote"
  | "stockActivity"
  | "amazonBuy"
  | "amazonActions"
  | "priceAlert"
  | "statusSpendings"
  | "statusCrypto";

export interface DesignCardFlight {
  variant: "flight";
  origin: string;
  destination: string;
  departureTime?: string;
  arrivalTime?: string;
  status: string;
  progress?: number;
}

export interface DesignCardOrder {
  variant: "order";
  status: string;
  eta: string;
  progress?: number;
  driverName?: string;
  callLabel?: string;
  messageLabel?: string;
}

export interface DesignCardGlucose {
  variant: "glucose";
  value: string;
  unit?: string;
  trend?: "up" | "down" | "flat";
  chartValues?: number[];
  labels?: string[];
}

export interface DesignCardDelivery {
  variant: "delivery";
  statusLabel?: string;
  status: string;
  eta: string;
}

export interface DesignCardEspresso {
  variant: "espresso";
  title?: string;
  timer: string;
  chartValues?: number[];
  stopLabel?: string;
}

export interface DesignCardIss {
  variant: "iss";
  title?: string;
  countdown: string;
}

export interface DesignCardWorkout {
  variant: "workout";
  elapsed: string;
  distance: string;
  chartValues?: number[];
}

export interface DesignCardRace {
  variant: "race";
  sector: string;
  progress?: number;
}

export interface DesignCardTransitStop {
  label: string;
  active?: boolean;
}

export interface DesignCardTransit {
  variant: "transit";
  stops: DesignCardTransitStop[];
}

export interface DesignCardHeartRate {
  variant: "heartRate";
  value: string;
  unit?: string;
  chartValues?: number[];
}

export interface DesignCardSleepSegment {
  label: string;
  values: number[];
}

export interface DesignCardSleep {
  variant: "sleep";
  duration: string;
  delta?: string;
  segments?: DesignCardSleepSegment[];
  goalAt?: number;
}

export interface DesignCardSubwayNav {
  variant: "subwayNav";
  headline: string;
  stationCount?: string;
  stopCount?: number;
  activeStop?: number;
}

export interface DesignCardWishlist {
  variant: "wishlist";
  kicker?: string;
  title: string;
  price: string;
  discount?: string;
  progress?: number;
}

export interface DesignCardWeeklyRing {
  label: string;
  progress?: number;
  active?: boolean;
}

export interface DesignCardWeeklyRings {
  variant: "weeklyRings";
  tags?: { label: string; tone?: "success" | "neutral" }[];
  rings: DesignCardWeeklyRing[];
}

export interface DesignCardPodcast {
  variant: "podcast";
  date?: string;
  title: string;
  show: string;
  progress?: number;
  speed?: string;
  duration?: string;
}

export interface DesignCardWeather {
  variant: "weather";
  city: string;
  temperature: string;
  aqi?: string;
  wind?: string;
  chartValues?: number[];
}

export interface DesignCardNetworkStat {
  value: string;
  direction?: "up" | "down";
}

export interface DesignCardNetwork {
  variant: "network";
  stats: DesignCardNetworkStat[];
  downloadProgress?: number;
  uploadProgress?: number;
  chartValues?: number[];
  chartLabels?: string[];
}

export interface DesignCardSportsScore {
  variant: "sportsScore";
  homeTeam: string;
  awayTeam: string;
  homeScore: string;
  awayScore: string;
  homeColor?: string;
  awayColor?: string;
  league?: string;
}

export interface DesignCardBillingBar {
  label: string;
  value: number;
  tone?: "accent" | "danger" | "neutral";
}

export interface DesignCardBilling {
  variant: "billing";
  kicker?: string;
  countdown?: string;
  amount: string;
  bars?: DesignCardBillingBar[];
}

export interface DesignCardActivityGoal {
  label?: string;
  progress?: number;
  completed?: boolean;
}

export interface DesignCardActivityGoals {
  variant: "activityGoals";
  goals: DesignCardActivityGoal[];
}

export interface DesignCardAirpods {
  variant: "airpods";
  feature?: string;
  featureValue?: string;
  leftBattery?: number;
  rightBattery?: number;
}

export interface DesignCardLaundry {
  variant: "laundry";
  program: string;
  timer: string;
  phase?: string;
  phaseProgress?: number;
  phaseTimer?: string;
  temp?: string;
  spin?: string;
}

export interface DesignCardStockQuote {
  variant: "stockQuote";
  symbol: string;
  company: string;
  brandColor?: string;
  brandMark?: string;
  updated?: string;
  price: string;
  change?: string;
  changePercent?: string;
  changeDirection?: "up" | "down";
  chartValues?: number[];
}

export interface DesignCardStockActivity {
  variant: "stockActivity";
  symbol: string;
  company: string;
  brandColor?: string;
  brandMark?: string;
  updated?: string;
  chartValues?: number[];
  chartLabels?: string[];
  activeIndices?: number[];
}

export interface DesignCardAmazonBuy {
  variant: "amazonBuy";
  symbol?: string;
  company?: string;
  buyLabel?: string;
}

export interface DesignCardAmazonActions {
  variant: "amazonActions";
  symbol?: string;
  company?: string;
  buyLabel?: string;
}

export interface DesignCardPriceAlert {
  variant: "priceAlert";
  company: string;
  alertLabel?: string;
  brandColor?: string;
  brandMark?: string;
  progress?: number;
}

export interface DesignCardStatusSpendings {
  variant: "statusSpendings";
  time?: string;
  location?: string;
  label?: string;
  amount: string;
  batteryPercent?: number;
}

export interface DesignCardStatusCrypto {
  variant: "statusCrypto";
  time?: string;
  symbol: string;
  name?: string;
  change: string;
  changeDirection?: "up" | "down";
  brandColor?: string;
  batteryPercent?: number;
}

export type DesignCardProps = (
  | DesignCardFlight
  | DesignCardOrder
  | DesignCardGlucose
  | DesignCardDelivery
  | DesignCardEspresso
  | DesignCardIss
  | DesignCardWorkout
  | DesignCardRace
  | DesignCardTransit
  | DesignCardHeartRate
  | DesignCardSleep
  | DesignCardSubwayNav
  | DesignCardWishlist
  | DesignCardWeeklyRings
  | DesignCardPodcast
  | DesignCardWeather
  | DesignCardNetwork
  | DesignCardSportsScore
  | DesignCardBilling
  | DesignCardActivityGoals
  | DesignCardAirpods
  | DesignCardLaundry
  | DesignCardStockQuote
  | DesignCardStockActivity
  | DesignCardAmazonBuy
  | DesignCardAmazonActions
  | DesignCardPriceAlert
  | DesignCardStatusSpendings
  | DesignCardStatusCrypto
) & {
  className?: string;
  size?: "sm" | "md" | "lg";
};
