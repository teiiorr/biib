"use client";

import { useLazyView } from "@/components/sections/errors/LazyView";

const load = () =>
  import("@/components/sections/errors/NotFoundView").then((mod) => mod.NotFoundView);

/** Til params orqali kelmaydi: uni brauzer aniqlaydi, matn esa layout bergan JSON maʼlumotidan. */
export default function NotFound() {
  const { View } = useLazyView(load);
  /* Komponent yuklanguncha joy band turadi, aks holda futer yuqoriga sakrab, keyin qaytib tushadi. */
  return View ? <View /> : <div className="container-site error-view error-view-pending" />;
}
