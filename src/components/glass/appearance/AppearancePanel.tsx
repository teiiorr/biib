"use client";

import type { Dictionary } from "@/i18n/dictionaries";
import { fill } from "@/i18n/format";
import { useAppearance } from "@/lib/appearance/context";
import type { ThemeChoice } from "@/lib/appearance/types";

import { GlassSlider } from "../GlassSlider";
import { GlassSwitch } from "../GlassSwitch";
import { SegmentedControl } from "../SegmentedControl";

export interface AppearancePanelProps {
  readonly dict: Dictionary["appearance"];
}

/** Koʻrinish paneli: Mavzu, Shaffoflik, Zichlik, Harakat, Ovoz, Asliga qaytarish. */
export function AppearancePanel({ dict }: AppearancePanelProps) {
  const { appearance, reducedTransparency, set, setTheme, reset } = useAppearance();
  const valueText = (v: number) => fill(dict.valueText, { value: v });

  return (
    <div className="appearance-panel" data-testid="appearance-panel">
      <div className="appearance-group">
        <span className="t-label text-material-ink" id="appearance-theme-label">
          {dict.theme.label}
        </span>
        <SegmentedControl<ThemeChoice>
          value={appearance.theme}
          label={dict.theme.label}
          options={[
            { value: "light", label: dict.theme.light },
            { value: "dark", label: dict.theme.dark },
            { value: "system", label: dict.theme.system },
          ]}
          onValueChange={(value, origin) => setTheme(value, origin)}
        />
      </div>

      <div className="appearance-group">
        <label className="t-label text-material-ink" htmlFor="slider-transparency">
          {dict.transparency}
        </label>
        <div data-testid="slider-transparency">
          <GlassSlider
            id="slider-transparency"
            label={dict.transparency}
            value={appearance.transparency}
            onValueChange={(v) => set({ transparency: v })}
            valueText={valueText}
            disabled={reducedTransparency}
          />
        </div>
        <div className="slider-ends t-micro" aria-hidden="true">
          <span>{dict.transparencyFrom}</span>
          <span>{dict.transparencyTo}</span>
        </div>
      </div>

      <div className="appearance-group">
        <label className="t-label text-material-ink" htmlFor="slider-density">
          {dict.density}
        </label>
        <div data-testid="slider-density">
          <GlassSlider
            id="slider-density"
            label={dict.density}
            value={appearance.density}
            onValueChange={(v) => set({ density: v })}
            valueText={valueText}
            disabled={reducedTransparency}
          />
        </div>
        <div className="slider-ends t-micro" aria-hidden="true">
          <span>{dict.densityFrom}</span>
          <span>{dict.densityTo}</span>
        </div>
        {reducedTransparency ? (
          <p className="t-micro appearance-note" role="status">
            {dict.reducedTransparency}
          </p>
        ) : null}
      </div>

      <GlassSwitch
        checked={appearance.motion}
        onCheckedChange={(v) => set({ motion: v })}
        label={dict.motion}
        hint={dict.motionHint}
      />
      <GlassSwitch
        checked={appearance.tapSound}
        onCheckedChange={(v) => set({ tapSound: v })}
        label={dict.sound}
        hint={dict.soundHint}
      />

      <button type="button" className="appearance-reset t-label" onClick={reset}>
        {dict.reset}
      </button>
    </div>
  );
}
