import type { ReactNode } from "react";
import { Blob } from "@/components/brand/Blob";
import { Doodle } from "@/components/brand/Doodle";
import { MarkerUnderline } from "@/components/brand/MarkerUnderline";
import { Reveal } from "@/components/brand/Reveal";
import type { Accent } from "@/content/types";

/**
 * Sahifa boşi: bitta H1 va qisqa kiriş. Sarlavha ustida hеç narsa yöq.
 * accent — şu sahifaning böyoği, blob va tagçiziqqa boradi.
 */

const TONE: Record<Accent, string> = {
  sun: "text-sun-soft",
  coral: "text-coral-soft",
  grass: "text-grass-soft",
  pink: "text-pink-soft",
  grape: "text-grape-soft",
  blue: "text-blue-soft",
};

export function PageHeader({
  title,
  titleAccent,
  lead,
  accent = "blue",
  children,
}: {
  title: string;
  /** Sarlavhaning tagi çizilgan sönggi sözi. */
  titleAccent?: string;
  lead?: string;
  accent?: Accent;
  children?: ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden pb-4 pt-12 sm:pt-16">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <Blob name="sky" tone={TONE[accent]} className="-right-[38%] -top-[30%] h-[26rem] w-[26rem] sm:-right-[28%] sm:-top-[46%] sm:h-[44rem] sm:w-[44rem]" />
        <Doodle name="spark" className="twinkle absolute right-[10%] top-[24%] h-6 w-6 text-sun" />
        <Doodle name="cloud" className="drift absolute left-[3%] top-[12%] h-12 w-12 text-blue-light/40" strokeWidth={2.2} />
      </div>

      <div className="page-w page-x">
        <Reveal pop>
          <h1 className="max-w-4xl text-[clamp(2.2rem,5.6vw,3.6rem)]">
            {titleAccent ? (
              <>
                {title}{" "}
                <MarkerUnderline accent={accent === "blue" ? "sun" : accent} delay={360}>
                  {titleAccent}
                </MarkerUnderline>
              </>
            ) : (
              title
            )}
          </h1>
        </Reveal>

        {lead ? (
          <Reveal delay={130}>
            <p className="mt-5 max-w-2xl text-[1.1rem] leading-relaxed text-ink-2">{lead}</p>
          </Reveal>
        ) : null}

        {children}
      </div>
    </section>
  );
}
