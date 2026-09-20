import type { ReactNode } from "react";
import { GoldText } from "@/components/brand/GoldText";
import { Reveal } from "@/components/brand/Reveal";
import { Aura } from "@/components/brand/Texture";

/**
 * Sahifa boşi: bitta H1 va qisqa kiriş. Kiker yöq.
 * Sarlavha oltin — sahifadagi yagona şunday urgʻu (§16.4).
 */
export function PageHeader({
  title,
  lead,
  children,
}: {
  title: string;
  lead?: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden">
      <Aura className="-right-[26%] -top-[58%] w-[min(72vw,620px)]" />

      <Reveal as="header" className="page relative pb-6 pt-10 text-center md:pt-16">
        <h1 className="text-title1 md:text-display">
          <GoldText>{title}</GoldText>
        </h1>
        {lead ? (
          <p className="read mx-auto mt-4 text-body text-label-secondary">{lead}</p>
        ) : null}
        {children}
      </Reveal>
    </section>
  );
}
