"use client";

import { startTransition, useEffect } from "react";

import { keepSession } from "@/lib/admin/actions/auth";

/* Token 60 daqiqa yashaydi: 45 daqiqada yangilansa, uzun tahrir yarmida sessiya uzilmaydi. */
const INTERVAL_MS = 45 * 60 * 1000;
/* Oynalar orasida tez-tez almashilganda har safar serverga soʻrov ketmasin. */
const MIN_GAP_MS = 60 * 1000;

/** Token faqat tugashiga oz qolganda yangilanadi, aks holda server hech narsa yozmaydi va sahifa qayta chizilmaydi. */
export function SessionKeeper(): null {
  useEffect(() => {
    let last = Date.now();
    const keep = () => {
      last = Date.now();
      startTransition(async () => {
        await keepSession();
      });
    };
    const timer = window.setInterval(keep, INTERVAL_MS);
    const onVisible = () => {
      if (document.visibilityState === "visible" && Date.now() - last > MIN_GAP_MS) keep();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);
  return null;
}
