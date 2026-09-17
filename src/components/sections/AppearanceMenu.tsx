"use client";

import { useTranslations } from "next-intl";
import { Icon } from "@/components/brand/Icon";
import { Menu, MenuContent, MenuTrigger } from "@/components/ui/Menu";
import { useGlassIntensity, useReducedTransparency } from "@/hooks/use-appearance";
import { cn } from "@/lib/cn";

/**
 * iOS 27 dagi şaffoflik suruvçisi. Mavzu tanlovi yöq — brend faqat
 * qorongʻi fonda yaşaydi (§16.2).
 *
 * Tizimda "şaffoflikni kamaytiriş" yoqilgan bölsa, suruvçi eng zich
 * holatda körsatiladi va öçiriladi: tizim tanlovi ustun.
 */
export function AppearanceMenu({ className }: { className?: string }) {
  const t = useTranslations("appearance");
  const [intensity, setIntensity] = useGlassIntensity();
  const reduced = useReducedTransparency();

  const effective = reduced ? 0 : intensity;
  const stopLabel =
    effective <= 0.2 ? t("glassDense") : effective >= 0.8 ? t("glassClear") : t("glassStandard");

  return (
    <Menu>
      <MenuTrigger
        aria-label={t("label")}
        className={cn(
          "tap grid h-10 w-10 place-items-center rounded-sm text-label-secondary",
          "transition-colors duration-[var(--dur-fast)] hover:bg-fill-secondary hover:text-label",
          "data-[state=open]:bg-fill-secondary data-[state=open]:text-label",
          className,
        )}
      >
        <Icon name="sliders" className="h-[1.15rem] w-[1.15rem]" />
      </MenuTrigger>

      <MenuContent className="w-72 p-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-baseline justify-between gap-3">
            <p className="text-caption text-label-secondary">{t("glassHeading")}</p>
            <p className="shrink-0 text-caption text-accent-text">{stopLabel}</p>
          </div>

          <input
            type="range"
            className="slider"
            min={0}
            max={1}
            step={0.1}
            value={effective}
            disabled={reduced}
            aria-label={t("glassHeading")}
            aria-valuetext={stopLabel}
            onChange={(event) => setIntensity(Number(event.target.value))}
          />

          <div className="flex justify-between text-caption text-label-secondary">
            <span>{t("glassDense")}</span>
            <span>{t("glassClear")}</span>
          </div>

          {reduced ? (
            <p className="mt-1 text-footnote text-label-secondary">{t("systemOverride")}</p>
          ) : null}
        </div>
      </MenuContent>
    </Menu>
  );
}
