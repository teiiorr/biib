import { Container } from "@/components/layout/Container";
import { Reveal } from "@/components/motion/Reveal";

export interface MissionCopy {
  /** Boʻlim nomi (aria-label): sarlavha ustida koʻrinadigan yorliq yoʻq (§8 XIV). */
  readonly label: string;
  readonly statement: string;
}

interface MissionSectionProps {
  readonly copy: MissionCopy;
}

/**
 * Missiya: qahramon sahnasining ikkinchi yarmi — xiralashgan kadr ustidan koʻtariladigan bitta sokin
 * jumla. Egasining talabi bilan kamtar oʻlchamda (h4), markazda, oddiy siyoh rangida.
 */
export function MissionSection({ copy }: MissionSectionProps) {
  return (
    <section
      className="section-pad home-mission"
      data-audit=""
      data-tone="dark"
      aria-label={copy.label}
    >
      <Container>
        <Reveal as="p" className="t-h4 text-ink home-mission-statement">
          {copy.statement}
        </Reveal>
      </Container>
    </section>
  );
}
