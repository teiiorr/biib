"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";
import { Icon } from "@/components/brand/Icon";
import { THEME_STORAGE_KEY } from "@/lib/theme";
import { cn } from "@/lib/cn";

type Resolved = "light" | "dark";

function systemTheme(): Resolved {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function storedChoice(): string | null {
  try {
    return localStorage.getItem(THEME_STORAGE_KEY);
  } catch {
    return null;
  }
}

/**
 * Haqiqiy manba — <html data-theme>. Tugma öz holatini şu yerdan öqiydi,
 * şuning uçun sarlavhadagi va podvaldagi ikki tugma özi mos turadi.
 */
function subscribe(onChange: () => void): () => void {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  return () => observer.disconnect();
}

function readTheme(): Resolved {
  return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
}

/**
 * ☀/🌙. Tanlov bölmasa tizim mavzusi kuzatiladi. Foydalanuvçi tanlovi
 * yana tizimnikiga tenglaşsa — "tizim" rejimiga özi qaytadi.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const t = useTranslations("theme");
  const resolved = useSyncExternalStore(subscribe, readTheme, () => "light" as Resolved);

  // Tanlov saqlanmagan bölsa, tizim mavzusi özgarganda ergaşamiz.
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const follow = () => {
      if (storedChoice()) return;
      document.documentElement.setAttribute("data-theme", systemTheme());
    };
    media.addEventListener("change", follow);
    return () => media.removeEventListener("change", follow);
  }, []);

  function toggle() {
    const next: Resolved = resolved === "dark" ? "light" : "dark";
    const root = document.documentElement;

    root.classList.add("theme-anim");
    window.setTimeout(() => root.classList.remove("theme-anim"), 320);
    root.setAttribute("data-theme", next);

    try {
      if (next === systemTheme()) localStorage.removeItem(THEME_STORAGE_KEY);
      else localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Şaxsiy rejimda xotira yopiq bölişi mumkin — mavzu baribir almaşdi.
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={resolved === "light" ? t("toDark") : t("toLight")}
      className={cn(
        "relative grid h-11 w-11 place-items-center rounded-btn border border-line",
        "text-blue-deep transition-colors duration-200 ease-[var(--ease-micro)]",
        "hover:border-line-strong hover:bg-blue-soft",
        "focus-visible:ring-4 focus-visible:ring-[var(--focus-ring)]",
        className,
      )}
    >
      <Icon
        name="sun"
        className={cn(
          "absolute h-[1.35rem] w-[1.35rem] transition-all duration-300 ease-[var(--ease-pop)]",
          resolved === "light" ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-50 opacity-0",
        )}
      />
      <Icon
        name="moon"
        className={cn(
          "absolute h-[1.35rem] w-[1.35rem] transition-all duration-300 ease-[var(--ease-pop)]",
          resolved === "dark" ? "rotate-0 scale-100 opacity-100" : "rotate-90 scale-50 opacity-0",
        )}
      />
    </button>
  );
}
