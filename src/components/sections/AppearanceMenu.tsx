"use client";

import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { Icon } from "@/components/brand/Icon";
import { Menu, MenuContent, MenuTrigger } from "@/components/ui/Menu";
import {
  useContrastSetting,
  useGlassIntensity,
  useMotionSetting,
  useReducedTransparency,
  useTextSetting,
} from "@/hooks/use-appearance";
import { cn } from "@/lib/cn";

/**
 * Körinish va qulaylik paneli. Şaffoflik suruvçisi (iOS 27 uslubi) +
 * qulaylik tanlovlari: harakatni kamaytiriş, matn ölçami, kontrast.
 * Mavzu tanlovi yöq — brend faqat qorongʻi fonda yaşaydi (§16.2).
 *
 * Tizim sozlamasi hamişa ustun: "şaffoflikni kamaytiriş" yoqilgan
 * bölsa suruvçi öçadi, tizim kontrasti yoqilgan bölsa tumbler
 * qaytarib bölmaydigan holatda körsatiladi.
 */

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex min-h-11 items-center justify-between gap-4">
      <p className="text-callout text-label">{label}</p>
      {children}
    </div>
  );
}

function Toggle({
  checked,
  onChange,
  disabled,
  label,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  disabled?: boolean;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        "tap relative h-7 w-12 shrink-0 rounded-pill transition-colors duration-[var(--dur-base)]",
        checked ? "bg-[image:var(--metal)]" : "bg-fill-secondary",
        disabled && "opacity-40",
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "absolute top-0.5 h-6 w-6 rounded-pill bg-ivory shadow-[var(--shadow-contact)]",
          "transition-[left] duration-[var(--dur-base)] ease-[var(--ease-magnet)]",
          checked ? "left-[calc(100%-1.625rem)]" : "left-0.5",
        )}
      />
    </button>
  );
}

export function AppearanceMenu({ className }: { className?: string }) {
  const t = useTranslations("appearance");
  const [intensity, setIntensity] = useGlassIntensity();
  const reduced = useReducedTransparency();
  const [motionReduced, setMotion] = useMotionSetting();
  const [text, setText] = useTextSetting();
  const [contrastMore, contrastSystem, setContrast] = useContrastSetting();

  const effective = reduced ? 0 : intensity;
  const stopLabel =
    effective <= 0.2 ? t("glassDense") : effective >= 0.8 ? t("glassClear") : t("glassStandard");

  const sizes = [
    { value: "md", label: t("textDefault") },
    { value: "lg", label: t("textLarge") },
    { value: "xl", label: t("textXL") },
  ] as const;

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

      <MenuContent className="w-80 p-4">
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

        <div className="my-3 h-px bg-separator" />

        <p className="mb-1 text-caption text-label-secondary">{t("a11yHeading")}</p>

        <Row label={t("motionReduce")}>
          <Toggle checked={motionReduced} onChange={setMotion} label={t("motionReduce")} />
        </Row>

        <Row label={t("contrastMore")}>
          <Toggle
            checked={contrastMore}
            onChange={setContrast}
            disabled={contrastSystem}
            label={t("contrastMore")}
          />
        </Row>

        <div className="mt-1.5 flex flex-col gap-2">
          <p className="text-callout text-label">{t("textHeading")}</p>
          <div
            role="radiogroup"
            aria-label={t("textHeading")}
            className="grid grid-cols-3 gap-1 rounded-md bg-fill-secondary p-1"
          >
            {sizes.map((size) => (
              <button
                key={size.value}
                type="button"
                role="radio"
                aria-checked={text === size.value}
                onClick={() => setText(size.value)}
                className={cn(
                  "tap min-h-9 rounded-sm px-2 text-callout transition-colors duration-[var(--dur-fast)]",
                  text === size.value
                    ? "bg-elevated font-semibold text-label shadow-[inset_0_0_0_1px_var(--line-gold)]"
                    : "text-label-secondary hover:text-label",
                )}
              >
                {size.label}
              </button>
            ))}
          </div>
        </div>
      </MenuContent>
    </Menu>
  );
}
