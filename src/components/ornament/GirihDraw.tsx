"use client";

import type { ReactNode } from "react";
import { DrawOnView, type DrawMode } from "./DrawOnView";

export interface GirihDrawProps {
  readonly children: ReactNode;
  readonly mode?: DrawMode;
  readonly className?: string;
}

/** Girih tasmalarini 1 px oltin bilan skrollda chizadi (§11.3). */
export function GirihDraw({ children, mode = "scrub", className }: GirihDrawProps) {
  return (
    <DrawOnView mode={mode} duration={1.6} {...(className === undefined ? {} : { className })}>
      {children}
    </DrawOnView>
  );
}
