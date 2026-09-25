"use client";

import { useLazyView } from "@/components/sections/errors/LazyView";

const load = () =>
  import("@/components/sections/errors/NotFoundView").then((mod) => mod.NotFoundView);

/** Til segmenti not-found ga params sifatida kelmaydi: koʻrinish tilni brauzerda oʻqiydi, matn layout JSON idan. */
export default function NotFound() {
  const { View } = useLazyView(load);
  /* Koʻrinish chunki kelguncha joy saqlanadi: futer yuqoriga sakrab, keyin qaytib tushmaydi. */
  return View ? <View /> : <div className="container-site error-view error-view-pending" />;
}
