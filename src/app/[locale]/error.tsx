"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Doodle } from "@/components/brand/Doodle";
import { Button } from "@/components/ui/Button";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("error");

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="section-y">
      <div className="page-w page-x flex flex-col items-start gap-6">
        <Doodle name="zigzag" className="h-14 w-14 text-coral" strokeWidth={2.4} />
        <h1 className="text-[clamp(2rem,5vw,3rem)]">{t("title")}</h1>
        <p className="max-w-xl text-[1.08rem] text-ink-2">{t("lead")}</p>
        <Button size="lg" onClick={reset}>
          {t("retry")}
        </Button>
      </div>
    </section>
  );
}
