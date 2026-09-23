"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

import {
  getAppearanceSnapshot,
  getServerAppearanceSnapshot,
  subscribeAppearance,
} from "@/lib/appearance/store";

import { playSound, type SoundName, type SoundOptions } from "./play";

export interface SoundApi {
  readonly enabled: boolean;
  readonly play: (name: SoundName, options?: SoundOptions) => void;
}

export function useSound(): SoundApi {
  const enabled = useSyncExternalStore(
    subscribeAppearance,
    () => getAppearanceSnapshot().appearance.sound,
    () => getServerAppearanceSnapshot().appearance.sound,
  );
  const play = useCallback((name: SoundName, options?: SoundOptions) => {
    playSound(name, options);
  }, []);
  return useMemo(() => ({ enabled, play }), [enabled, play]);
}
