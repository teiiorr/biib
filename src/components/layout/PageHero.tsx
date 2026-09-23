import type { ReactNode } from "react";

import { Breadcrumbs, type BreadcrumbItem } from "@/components/ui/Breadcrumbs";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";

import { Container } from "./Container";
import { Section } from "./Section";

interface PageHeroProps {
  readonly title: string;
  readonly lead?: string;
  readonly breadcrumbs?: readonly BreadcrumbItem[];
  readonly breadcrumbsLabel?: string;
  /** Rasmiy sahifalar: kundal paneli va boshqa bezak shu yerga keladi. */
  readonly art?: ReactNode;
  readonly tone?: "light" | "dark";
  readonly titleId?: string;
  readonly children?: ReactNode;
}

/** Sahifa boshi: bitta h1, qisqa kirish, non-ushoq yoʻl. */
export function PageHero({
  title,
  lead,
  breadcrumbs,
  breadcrumbsLabel,
  art,
  tone = "light",
  titleId = "page-title",
  children,
}: PageHeroProps) {
  return (
    <Section tone={tone} labelledBy={titleId} className="relative">
      {art}
      <Container className="page-hero relative">
        {breadcrumbs && breadcrumbsLabel ? (
          <Breadcrumbs items={breadcrumbs} label={breadcrumbsLabel} />
        ) : null}
        <Heading level={1} size="h1" id={titleId}>
          {title}
        </Heading>
        {lead ? (
          <Text as="p" size="body-l" tone="ink-2" className="page-hero-lead">
            {lead}
          </Text>
        ) : null}
        {children}
      </Container>
    </Section>
  );
}
