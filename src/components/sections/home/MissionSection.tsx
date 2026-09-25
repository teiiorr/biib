import { Container } from "@/components/layout/Container";
import { Reveal } from "@/components/motion/Reveal";
import { ZardoziText } from "@/components/ornament/ZardoziText";

export interface MissionCopy {
  /** Boʻlim nomi (aria-label): sarlavha ustida koʻrinadigan yorliq yoʻq (§8 XIV). */
  readonly label: string;
  /** "{{soʻz}}" belgili jumla: koʻpi bilan uchta zardoʻzi. */
  readonly statement: string;
}

interface MissionSectionProps {
  readonly copy: MissionCopy;
}

/**
 * Missiya: qahramon sahnasining ikkinchi yarmi — yopishqoq, xiralashayotgan kadr ustidan koʻtariladi
 * (lojuvard ostlik bilan). Jumla reveal-rise bilan koʻtariladi, belgilangan soʻzlar ostida zardoʻzi
 * koʻrinishga kirganda doira ritmida tikiladi.
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
        <Reveal className="home-mission-text">
          <p className="t-display-l home-mission-statement gold-pour">
            <ZardoziText text={copy.statement} lines={2} draw="view" className="mission-words" />
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
