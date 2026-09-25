"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import type { CSSProperties, HTMLAttributes, ReactNode, Ref } from "react";

import { useAppearance } from "@/lib/appearance/context";
import { cx } from "@/lib/cx";
import { whenIdle } from "@/lib/idle";

import {
  RADIUS_EXPRESSION,
  SurfaceContext,
  innerRadius,
  useParentSurface,
  type SurfaceFrame,
  type SurfaceRadius,
} from "./surface-context";
import { useSurfaceTone } from "./useSurfaceTone";

export type SurfaceMaterial = "auto" | "oyna" | "kalka";
export type SurfaceVariant = "regular" | "clear" | "tinted";
export type SurfacePadding = 0 | 4 | 8 | 12 | 16 | 24;
export type SurfaceTag = "div" | "span" | "button" | "nav" | "header" | "section" | "aside" | "a";
export type { SurfaceRadius };

export interface SurfaceLight {
  /** Foizda, sirt kengligi va balandligiga nisbatan. */
  readonly x: number;
  readonly y: number;
}

export interface SurfaceOwnProps {
  readonly material?: SurfaceMaterial;
  readonly variant?: SurfaceVariant;
  /** Matnli sirt: --g-tint-text pastki chegarasi bilan. */
  readonly text?: boolean;
  readonly as?: SurfaceTag;
  readonly radius?: SurfaceRadius;
  /** Ichki padding (px); nested sirtlar shundan konsentrik radius oladi. */
  readonly padding?: SurfacePadding;
  readonly light?: SurfaceLight;
  /** Ostidagi boʻlimlarning data-tone qiymatini oʻqib, oʻz ohangini moslaydi. */
  readonly adaptiveTone?: boolean;
  readonly refraction?: boolean;
  /** Kalka: qirqilgan qogʻoz cheti (sheet va panelda sukut boʻyicha yoqiq). */
  readonly deckle?: boolean;
  /** Kalka: bitta skotch tasmasi. */
  readonly tape?: boolean;
  readonly className?: string;
  readonly style?: CSSProperties;
  readonly children?: ReactNode;
  readonly ref?: Ref<HTMLElement>;
}

export type SurfaceProps = SurfaceOwnProps &
  Omit<HTMLAttributes<HTMLElement>, keyof SurfaceOwnProps> & {
    readonly type?: "button" | "submit";
    readonly href?: string;
    readonly disabled?: boolean;
  };

function assignRef(ref: Ref<HTMLElement> | undefined, node: HTMLElement | null): void {
  if (!ref) return;
  if (typeof ref === "function") ref(node);
  else ref.current = node;
}

export function Surface({
  material = "auto",
  variant = "regular",
  text = false,
  as = "div",
  radius = "panel",
  padding = 0,
  light,
  adaptiveTone = false,
  refraction = true,
  deckle,
  tape = false,
  className,
  style,
  children,
  ref,
  ...rest
}: SurfaceProps) {
  const parent = useParentSurface();
  const { appearance } = useAppearance();
  const resolved: "oyna" | "kalka" =
    material === "auto" ? (appearance.design === "birlashma" ? "kalka" : "oyna") : material;
  const isOyna = resolved === "oyna";

  const localRef = useRef<HTMLElement | null>(null);
  const setRef = useCallback(
    (node: HTMLElement | null) => {
      localRef.current = node;
      assignRef(ref, node);
    },
    [ref],
  );

  /* Ohang birinchi kadrdan kerak (qorongʻi qahramon ustida yorliq oq). Yaltiroq nuqta va sinish esa
     bezak: alohida chunk, sahifa yuklanib boʻshaganda ulanadi (birinchi yuklanish JS ida emas). */
  useSurfaceTone(localRef, adaptiveTone);
  useEffect(() => {
    const element = localRef.current;
    if (!element || !isOyna) return;
    let dispose: (() => void) | null = null;
    let cancelled = false;
    const cancelIdle = whenIdle(() => {
      void import("./surface-effects").then(({ mountSurfaceEffects }) => {
        if (!cancelled) dispose = mountSurfaceEffects(element, { refraction });
      });
    }, 1500);
    return () => {
      cancelled = true;
      cancelIdle();
      dispose?.();
    };
  }, [isOyna, refraction]);

  const frame = useMemo<SurfaceFrame>(
    () => ({ radius: parent ? innerRadius(parent) : RADIUS_EXPRESSION[radius], padding }),
    [parent, radius, padding],
  );

  const vars: Record<string, string> = {
    "--surface-radius": frame.radius,
    "--surface-padding": `${padding}px`,
  };
  if (padding > 0) vars.padding = `${padding}px`;
  if (light) {
    vars["--light-x"] = `${light.x}%`;
    vars["--light-y"] = `${light.y}%`;
  }

  const Tag = as;
  const isSheetLike = radius !== "control";
  const showPaper = resolved === "kalka";

  return (
    <SurfaceContext.Provider value={frame}>
      <Tag
        {...rest}
        ref={setRef}
        className={cx("surface material", className)}
        style={{ ...(vars as CSSProperties), ...style }}
        data-material={material}
        data-variant={variant}
        data-text={text ? "true" : undefined}
        data-radius={radius}
      >
        {showPaper ? (
          <span
            className="surface-paper"
            data-deckle={(deckle ?? isSheetLike) ? "true" : "false"}
            aria-hidden="true"
          />
        ) : null}
        {showPaper ? <span className="surface-fiber" aria-hidden="true" /> : null}
        {showPaper && tape ? <span className="surface-tape" aria-hidden="true" /> : null}
        {children}
      </Tag>
    </SurfaceContext.Provider>
  );
}
