import { useState } from "react";
import { Icon, type IconName } from "../../../icons";
import { ScrollArea } from "../../primitives/ScrollArea";
import { StatCard } from "../../primitives/StatCard";
import { ListItem } from "../../primitives/ListItem";
import { Chip } from "../../primitives/Chip";
import type { CurrentWeather, ForecastDay, WeatherLocation } from "./types";
import styles from "./WeatherWorkspace.module.css";

export interface WeatherWorkspaceProps {
  locations: WeatherLocation[];
  current: CurrentWeather;
  forecast: ForecastDay[];
  activeLocationId?: string;
  defaultActiveLocationId?: string;
  onSelectLocation?: (id: string) => void;
}

const FORECAST_ICON: Record<ForecastDay["icon"], IconName> = {
  sun: "sun",
  moon: "moon",
  cloud: "globe",
  zap: "zap",
};

/** Simple weather app with current conditions, stats, and a multi-day forecast. */
export function WeatherWorkspace({
  locations,
  current,
  forecast,
  activeLocationId: controlledActiveLocationId,
  defaultActiveLocationId,
  onSelectLocation,
}: WeatherWorkspaceProps) {
  const [internalActiveLocationId, setInternalActiveLocationId] = useState(
    defaultActiveLocationId ?? locations[0]?.id,
  );

  const activeLocationId = controlledActiveLocationId ?? internalActiveLocationId;
  const activeLocation =
    locations.find((location) => location.id === activeLocationId) ?? locations[0];

  function handleSelectLocation(id: string) {
    if (onSelectLocation) onSelectLocation(id);
    else setInternalActiveLocationId(id);
  }

  return (
    <div className={styles.workspace}>
      <div className={styles.header}>
        <div className={styles.locationRow}>
          <Icon name="sun" size={20} />
          <div>
            <div className={styles.locationName}>{activeLocation?.name ?? "Weather"}</div>
            {activeLocation?.region && (
              <div className={styles.locationRegion}>{activeLocation.region}</div>
            )}
          </div>
        </div>

        {locations.length > 1 && (
          <div className={styles.locationChips}>
            {locations.map((location) => (
              <Chip
                key={location.id}
                active={location.id === activeLocationId}
                onClick={() => handleSelectLocation(location.id)}
              >
                {location.name}
              </Chip>
            ))}
          </div>
        )}

        <div className={styles.hero}>
          <div>
            <div className={styles.currentTemp}>{current.tempF}°</div>
            <div className={styles.condition}>{current.condition}</div>
            <div className={styles.highLow}>
              H {current.highF}° · L {current.lowF}°
            </div>
          </div>
          <Icon name="sun" size={48} />
        </div>
      </div>

      <ScrollArea className={styles.scroll}>
        <div className={styles.content}>
          <div>
            <div className={styles.sectionTitle}>Details</div>
            <div className={styles.stats}>
              <StatCard
                icon="globe"
                label="Humidity"
                value={`${current.humidity}%`}
                tone="accent"
                visualization={{ type: "ring", percent: current.humidity }}
                caption="Comfortable"
              />
              <StatCard
                icon="plane"
                label="Wind"
                value={`${current.windMph} mph`}
                tone="neutral"
                caption="Light breeze"
              />
              <StatCard
                icon="sun"
                label="UV Index"
                value={current.uvIndex}
                tone="warning"
                caption={current.uvIndex >= 6 ? "High" : "Moderate"}
              />
            </div>
          </div>

          <div>
            <div className={styles.sectionTitle}>Hourly</div>
            <div className={styles.hourlyCard}>
              <StatCard
                icon="clock"
                label="Next 12 hours"
                value={`${current.hourlyTemps[current.hourlyTemps.length - 1]}°`}
                tone="accent"
                visualization={{ type: "bars", values: current.hourlyTemps }}
                caption="Warming through afternoon"
              />
            </div>
          </div>

          <div>
            <div className={styles.sectionTitle}>7-day forecast</div>
            <div className={styles.forecastList}>
              {forecast.map((day) => (
                <ListItem
                  key={day.id}
                  leading={
                    <span className={styles.forecastIcon}>
                      <Icon name={FORECAST_ICON[day.icon]} size={14} />
                    </span>
                  }
                  label={day.day}
                  description={day.condition}
                  trailing={
                    <span>
                      {day.highF}° / {day.lowF}°
                    </span>
                  }
                />
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}

export type { CurrentWeather, ForecastDay, WeatherLocation } from "./types";
