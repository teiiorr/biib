"use client";

import { useLazyView } from "@/components/sections/errors/LazyView";

interface ErrorProps {
  readonly error: Error & { digest?: string };
  readonly reset: () => void;
}

const load = () =>
  import("@/components/sections/errors/ErrorPageView").then((mod) => mod.ErrorPageView);

export default function ErrorPage({ reset }: ErrorProps) {
  const { View } = useLazyView(load);
  /* Koʻrinish chunki kelguncha joy saqlanadi: futer yuqoriga sakrab, keyin qaytib tushmaydi. */
  return View ? (
    <View retry={reset} />
  ) : (
    <div className="container-site error-view error-view-pending" />
  );
}
