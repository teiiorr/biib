import { Container } from "@/components/layout/Container";
import { Reveal } from "@/components/motion/Reveal";

export interface MissionCopy {
  /** Faqat aria-label uchun: sarlavha ustida koʻrinadigan yorliq qoʻyilmaydi. */
  readonly label: string;
  readonly statement: string;
}

interface MissionSectionProps {
  readonly copy: MissionCopy;
}

/** Qahramon sahnasining davomi: xiralashgan kadr ustidan bitta sokin jumla koʻtariladi. */
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
