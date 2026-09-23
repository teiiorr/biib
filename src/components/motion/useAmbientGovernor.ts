"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import {
  registerAmbient,
  type AmbientHandlers,
  type AmbientKind,
} from "@/lib/motion/ambient-governor";

/**
 * Elementni ambient reyestrga qoʻshadi: viewportda bir turdan faqat eng koʻrinadigani ishlaydi.
 * Qaytadi: shu element hozir faolmi. pause/resume ichida sikl toʻxtatiladi/davom etadi.
 */
export function useAmbientGovernor(
  ref: RefObject<Element | null>,
  kind: AmbientKind,
  handlers: AmbientHandlers,
): boolean {
  const [active, setActive] = useState(false);
  const handlersRef = useRef(handlers);
  useEffect(() => {
    handlersRef.current = handlers;
  });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    return registerAmbient(el, kind, {
      pause: () => {
        setActive(false);
        handlersRef.current.pause();
      },
      resume: () => {
        setActive(true);
        handlersRef.current.resume();
      },
    });
  }, [ref, kind]);

  return active;
}
