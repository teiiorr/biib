"use client";

import { useEffect, useEffectEvent, useState, type RefObject } from "react";

/**
 * Sichqoncha bilan fayl tashlash maydoni. Tinglovchilar DOM ga toʻgʻridan-toʻgʻri: bu faqat qoʻshimcha
 * yoʻl, asosiysi (klaviatura va teginish) oddiy fayl tanlagich.
 */
export function useFileDrop(
  ref: RefObject<HTMLElement | null>,
  onFiles: (files: readonly File[]) => void,
): boolean {
  const [over, setOver] = useState(false);
  const deliver = useEffectEvent((files: readonly File[]) => onFiles(files));

  useEffect(() => {
    const zone = ref.current;
    if (!zone) return;
    const enter = (event: DragEvent) => {
      event.preventDefault();
      setOver(true);
    };
    const leave = () => setOver(false);
    const drop = (event: DragEvent) => {
      event.preventDefault();
      setOver(false);
      deliver([...(event.dataTransfer?.files ?? [])]);
    };
    zone.addEventListener("dragover", enter);
    zone.addEventListener("dragleave", leave);
    zone.addEventListener("drop", drop);
    return () => {
      zone.removeEventListener("dragover", enter);
      zone.removeEventListener("dragleave", leave);
      zone.removeEventListener("drop", drop);
    };
  }, [ref]);

  return over;
}
