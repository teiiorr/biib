"use client";

import { createContext, useContext } from "react";
import { INITIAL_PREFS, type MotionPrefs } from "@/lib/motion/prefs";

export const MotionContext = createContext<MotionPrefs>(INITIAL_PREFS);

/** ready=false: brauzer sozlamalari hali oʻqilmagan. */
export function useMotionPrefs(): MotionPrefs {
  return useContext(MotionContext);
}
