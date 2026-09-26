"use client";

import { startTransition, useEffect } from "react";

import { keepSession } from "@/lib/admin/actions/auth";

/* Kirish tokeni 60 daqiqa yashaydi: 45 daqiqada bir yangilanadi, uzun tahrir yarmida uzilmaydi. */
const INTERVAL_MS = 45 * 60 * 1000;
/* Oynaga qaytilganda tez-tez almashinuv har safar serverga bormasin. */
const MIN_GAP_MS = 60 * 1000;

/**
 * Ochiq panelning sessiyasini ushlab turadi. Server amali token tugashiga oz qolganda uni yangilaydi,
 * aks holda hech narsa yozmaydi (sahifa qayta chizilmaydi). Hech narsa chizmaydi.
 */
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
