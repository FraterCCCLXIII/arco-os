import { useEffect, useState } from "react";
import { Icon } from "../../../icons";
import { Button } from "../../primitives/Button";
import { Input } from "../../primitives/Input";
import { cx } from "../../../utils/cx";
import type { SettingsWallpaperPreset } from "./types";
import styles from "./SettingsWallpaperPanel.tailwind";

export interface SettingsWallpaperPanelProps {
  presets: SettingsWallpaperPreset[];
  activeUrl: string;
  onSelect: (url: string) => void;
}

/** Desktop wallpaper picker — preset grid plus optional custom image URL. */
export function SettingsWallpaperPanel({ presets, activeUrl, onSelect }: SettingsWallpaperPanelProps) {
  const [customUrl, setCustomUrl] = useState(activeUrl);
  const presetUrls = new Set(presets.map((preset) => preset.url));
  const usingCustom = !presetUrls.has(activeUrl);

  useEffect(() => {
    setCustomUrl(activeUrl);
  }, [activeUrl]);

  function applyCustomUrl() {
    const trimmed = customUrl.trim();
    if (trimmed) onSelect(trimmed);
  }

  return (
    <div className={styles.panel}>
      <p className={styles.intro}>
        Choose a background for simulated desktops — macOS, Windows, iOS, Android, and Chrome OS shells all use
        this wallpaper.
      </p>

      <div className={styles.grid} role="listbox" aria-label="Wallpaper presets">
        {presets.map((preset) => {
          const selected = activeUrl === preset.url;
          return (
            <button
              key={preset.id}
              type="button"
              role="option"
              aria-selected={selected}
              className={cx(styles.option, selected && styles.optionActive)}
              onClick={() => onSelect(preset.url)}
            >
              <span
                className={styles.preview}
                style={{ backgroundImage: `url("${preset.url}")` }}
                aria-hidden="true"
              >
                {selected && (
                  <span className={styles.check} aria-hidden="true">
                    <Icon name="check" size={14} />
                  </span>
                )}
              </span>
              <span className={styles.label}>{preset.label}</span>
              {preset.credit && <span className={styles.credit}>{preset.credit}</span>}
            </button>
          );
        })}
      </div>

      <div className={styles.custom}>
        <div className={styles.customLabel}>Custom image URL</div>
        <div className={styles.customRow}>
          <Input
            value={customUrl}
            onChange={(event) => setCustomUrl(event.target.value)}
            placeholder="https://…"
            aria-label="Custom wallpaper URL"
            wrapperClassName={styles.customInput}
            onKeyDown={(event) => {
              if (event.key === "Enter") applyCustomUrl();
            }}
          />
          <Button variant="secondary" size="md" onClick={applyCustomUrl}>
            Apply
          </Button>
        </div>
        {usingCustom && (
          <span className={styles.credit}>Using a custom wallpaper not in the preset list.</span>
        )}
      </div>
    </div>
  );
}
