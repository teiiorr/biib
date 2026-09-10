import type { ReactNode } from "react";
import { MarkerUnderline } from "@/components/brand/MarkerUnderline";
import { Reveal } from "@/components/brand/Reveal";
import type { Accent } from "@/content/types";

/**
 * Sahifa boşi: bitta H1 va qisqa kiriş. Sarlavha ustida hеç narsa yöq.
 * accent — şu sahifaning böyoği, blob va tagçiziqqa boradi.
 */

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
