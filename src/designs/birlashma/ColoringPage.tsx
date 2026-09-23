"use client";

import * as RadioGroup from "@radix-ui/react-radio-group";
import { useRef, useState } from "react";

import type { Dictionary } from "@/i18n/dictionaries";
import { fill } from "@/i18n/format";
import { playSound } from "@/lib/sound";

import { COLORING_REGIONS, COLORING_STROKES } from "./coloring-scene";

const PAINTS = ["--art-2", "--art-6", "--art-3", "--art-1", "--art-5", "--art-4"] as const;

interface ColoringPageProps {
  readonly dict: Dictionary["home"]["coloring"];
  readonly className?: string;
}

/**
 * Boʻyash sahifasi (25.4.9): boʻyoqni tanlang, boʻlakka bosing. Klaviatura: rasm bitta tab toʻxtash,
 * strelkalar boʻlaklar orasida yuradi (roving tabindex), Enter boʻyaydi. Holat faqat xotirada.
 */
export function ColoringPage({ dict, className }: ColoringPageProps) {
  const [paint, setPaint] = useState(0);
  const [fills, setFills] = useState<Record<string, number>>({});
  const [focused, setFocused] = useState(0);
  const svgRef = useRef<SVGSVGElement | null>(null);

  const apply = (id: string): void => {
    setFills((prev) => ({ ...prev, [id]: paint }));
    playSound("xylophone", { note: paint });
  };

  const onKey = (event: React.KeyboardEvent<SVGSVGElement>): void => {
    const n = COLORING_REGIONS.length;
    let next = focused;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (focused + 1) % n;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (focused - 1 + n) % n;
    else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      const region = COLORING_REGIONS[focused];
      if (region) apply(region.id);
      return;
    } else return;
    event.preventDefault();
    setFocused(next);
    const target = svgRef.current?.querySelector<SVGElement>(
      `[data-region="${COLORING_REGIONS[next]?.id}"]`,
    );
    target?.focus();
  };

  return (
    <div className={className ? `coloring ${className}` : "coloring"}>
      <RadioGroup.Root
        className="coloring-palette"
        value={String(paint)}
        onValueChange={(v) => setPaint(Number(v))}
        aria-label={dict.palette}
        orientation="horizontal"
      >
        {PAINTS.map((token, i) => (
          <RadioGroup.Item
            key={token}
            value={String(i)}
            className="coloring-paint"
            aria-label={dict.paints[i] ?? token}
            style={{ background: `var(${token})` }}
          />
        ))}
      </RadioGroup.Root>
      <svg
        ref={svgRef}
        viewBox="0 0 400 300"
        className="coloring-canvas"
        role="group"
        aria-label={dict.canvasLabel}
        onKeyDown={onKey}
      >
        <title>{dict.canvasLabel}</title>
        {COLORING_REGIONS.map((region, i) => {
          const fillIndex = fills[region.id];
          return (
            <path
              key={region.id}
              d={region.d}
              data-region={region.id}
              className="coloring-region"
              tabIndex={i === focused ? 0 : -1}
              role="button"
              aria-label={fill(dict.region, { index: i + 1 })}
              aria-pressed={fillIndex !== undefined}
              style={{
                fill: fillIndex === undefined ? "var(--surface-2)" : `var(${PAINTS[fillIndex]})`,
              }}
              onClick={() => {
                setFocused(i);
                apply(region.id);
              }}
              onFocus={() => setFocused(i)}
            />
          );
        })}
        <path d={COLORING_STROKES} className="coloring-lines" fill="none" />
      </svg>
      <div className="coloring-actions">
        <button
          type="button"
          className="ui-button t-label"
          data-size="48"
          data-variant="glass"
          onClick={() => setFills({})}
        >
          {dict.clear}
        </button>
        <p className="t-small text-ink-3">{dict.hint}</p>
      </div>
    </div>
  );
}
