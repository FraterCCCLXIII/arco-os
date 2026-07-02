import type { CurrentWeather, ForecastDay, WeatherLocation } from "longformer-ui";

export const weatherLocations: WeatherLocation[] = [
  { id: "sf", name: "San Francisco", region: "California" },
  { id: "nyc", name: "New York", region: "New York" },
  { id: "lon", name: "London", region: "United Kingdom" },
];

export const weatherCurrent: CurrentWeather = {
  tempF: 62,
  condition: "Partly cloudy",
  highF: 68,
  lowF: 54,
  humidity: 72,
  windMph: 8,
  uvIndex: 4,
  hourlyTemps: [58, 59, 61, 63, 65, 67, 68, 67, 65, 63, 61, 59],
};

export const weatherForecast: ForecastDay[] = [
  { id: "d1", day: "Today", condition: "Partly cloudy", highF: 68, lowF: 54, icon: "sun" },
  { id: "d2", day: "Friday", condition: "Sunny", highF: 71, lowF: 56, icon: "sun" },
  { id: "d3", day: "Saturday", condition: "Fog", highF: 63, lowF: 52, icon: "cloud" },
  { id: "d4", day: "Sunday", condition: "Light rain", highF: 59, lowF: 50, icon: "zap" },
  { id: "d5", day: "Monday", condition: "Clear", highF: 66, lowF: 53, icon: "sun" },
  { id: "d6", day: "Tuesday", condition: "Breezy", highF: 64, lowF: 51, icon: "cloud" },
  { id: "d7", day: "Wednesday", condition: "Sunny", highF: 70, lowF: 55, icon: "sun" },
];
