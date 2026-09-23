"use client";

import * as RadioGroup from "@radix-ui/react-radio-group";

import type { Dictionary } from "@/i18n/dictionaries";
import { fill } from "@/i18n/format";
import { useAppearance } from "@/lib/appearance/context";
import type { Design, ThemeChoice } from "@/lib/appearance/types";

import { GlassSlider } from "../GlassSlider";
import { GlassSwitch } from "../GlassSwitch";
import { SegmentedControl } from "../SegmentedControl";
import { DesignPreview } from "./DesignPreview";

export interface AppearancePanelProps {
  readonly dict: Dictionary["appearance"];
}

const DESIGNS: readonly Design[] = ["atlas", "birlashma"];

/** Koʻrinish paneli: Dizayn, Mavzu, Shaffoflik, Zichlik, Harakat, Ovoz, Asliga qaytarish. */
export function AppearancePanel({ dict }: AppearancePanelProps) {
  const { appearance, reducedTransparency, set, setTheme, switchDesign, reset } = useAppearance();
  const designName = (d: Design) => (d === "atlas" ? dict.designAtlas : dict.designBirlashma);
  const designHint = (d: Design) =>
    d === "atlas" ? dict.designAtlasHint : dict.designBirlashmaHint;
  const valueText = (v: number) => fill(dict.valueText, { value: v });

  return (
    <div className="appearance-panel" data-testid="appearance-panel">
      <fieldset className="appearance-group">
        <legend className="t-label text-material-ink">{dict.design}</legend>
        <RadioGroup.Root
          className="design-cards"
          value={appearance.design}
          onValueChange={(v) => switchDesign(v as Design)}
          aria-label={dict.design}
        >
          {DESIGNS.map((d) => (
            <RadioGroup.Item
              key={d}
              value={d}
              className="design-card"
              data-testid={`design-${d}`}
              aria-describedby={`design-hint-${d}`}
            >
              <DesignPreview design={d} alt={fill(dict.previewAlt, { design: designName(d) })} />
              <span className="design-card-text">
                <span className="t-label text-trim">{designName(d)}</span>
                <span id={`design-hint-${d}`} className="t-micro design-card-hint">
                  {designHint(d)}
                </span>
              </span>
            </RadioGroup.Item>
          ))}
        </RadioGroup.Root>
      </fieldset>

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
        checked={appearance.sound}
        onCheckedChange={(v) => set({ sound: v })}
        label={dict.sound}
        hint={dict.soundHint}
      />

      <button type="button" className="appearance-reset t-label" onClick={reset}>
        {dict.reset}
      </button>
    </div>
  );
}
