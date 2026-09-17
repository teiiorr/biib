"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
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
    <section className="section">
      <div className="page">
        <div className="read">
          <h1 className="text-title1">{t("title")}</h1>
          <p className="mt-4 text-body text-label-secondary">{t("lead")}</p>
          <div className="mt-8 flex justify-end">
            <Button size="lg" onClick={reset}>
              {t("retry")}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
