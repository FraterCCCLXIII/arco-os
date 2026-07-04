export interface WeatherLocation {
  id: string;
  name: string;
  region: string;
}

export interface CurrentWeather {
  tempF: number;
  condition: string;
  highF: number;
  lowF: number;
  humidity: number;
  windMph: number;
  uvIndex: number;
  /** Hourly temps for a sparkline, e.g. [62, 65, 68, 71]. */
  hourlyTemps: number[];
}

export interface ForecastDay {
  id: string;
  day: string;
  condition: string;
  highF: number;
  lowF: number;
  icon: "sun" | "moon" | "cloud" | "zap";
}
