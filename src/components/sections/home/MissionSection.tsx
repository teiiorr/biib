import { Container } from "@/components/layout/Container";
import { Reveal } from "@/components/motion/Reveal";
import { ZardoziText } from "@/components/ornament/ZardoziText";

export interface MissionCopy {
  /** Boʻlim nomi (aria-label): sarlavha ustida koʻrinadigan yorliq yoʻq (§8 XIV). */
  readonly label: string;
  /** "{{soʻz}}" belgili jumla: koʻpi bilan uchta zardoʻzi. */
  readonly statement: string;
  /** Birlashma: hoshiyadagi qoʻlyozma eslatma. */
  readonly note: string;
}

interface MissionSectionProps {
  readonly copy: MissionCopy;
}

/**
 * Missiya: Atlasda qahramon sahnasining ikkinchi yarmi — yopishqoq, xiralashayotgan kadr ustidan
 * koʻtariladi (lojuvard ostlik bilan); Birlashmada albom varagʻi. Jumla reveal-rise bilan koʻtariladi,
 * belgilangan soʻzlar ostida zardoʻzi koʻrinishga kirganda doira ritmida tikiladi.
 */
export function MissionSection({ copy }: MissionSectionProps) {
  return (
    <section
      className="section-pad home-mission"
      data-audit=""
      data-tone="light"
      data-tone-atlas="dark"
      aria-label={copy.label}
    >
      <Container>
        <Reveal className="home-mission-text">
          <p className="t-display-l home-mission-statement gold-pour">
            <ZardoziText text={copy.statement} lines={2} draw="view" className="mission-words" />
          </p>
          <p
            className="t-note text-ink-3 home-mission-note birlashma:block hidden"
            aria-hidden="true"
          >
            {copy.note}
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
