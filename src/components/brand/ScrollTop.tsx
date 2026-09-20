"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

/**
 * "Yuqoriga" tugmasi — skroll uzun bölgaç premium oltin tabletka
 * pastda-öngda paydo bölad. Faqat opacity/transform bilan körinadi;
 * skroll listener passiv, holat rAF siz ham arzon.
 */
export function ScrollTop({ label }: { label: string }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 480);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      aria-label={label}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={cn(
        "scroll-top tap fixed bottom-5 right-5 z-[var(--z-dock)] grid h-12 w-12 place-items-center rounded-pill",
        "bg-[image:var(--metal)] text-[#0a1622]",
        "shadow-[inset_0_0.5px_0_0_rgb(255_255_255/0.45),0_10px_28px_-10px_rgb(201_162_90/0.6)]",
        "transition-[opacity,transform,filter] duration-[var(--dur-base)] ease-[var(--ease-magnet)]",
        "hover:brightness-[1.06] active:scale-[0.94]",
        show ? "opacity-100" : "pointer-events-none translate-y-3 opacity-0",
      )}
    >
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-5 w-5">
        <path
          d="M12 19V6M6 12l6-6 6 6"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
