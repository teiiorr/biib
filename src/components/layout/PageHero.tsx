import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

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
  /** Sarlavha yonidagi dizaynga xos bezak (masalan Birlashma gazeta nomi). */
  readonly art?: ReactNode;
  /** Rasmiy sahifalar: sarlavha tinch lojuvard lentada (Birlashmada doska), bezaksiz. */
  readonly band?: boolean;
  readonly titleId?: string;
  readonly className?: string;
  readonly children?: ReactNode;
}

/** Sahifa boshi: bitta h1, qisqa kirish, non-ushoq yoʻl. */
export function PageHero({
  title,
  lead,
  breadcrumbs,
  breadcrumbsLabel,
  art,
  band = false,
  titleId = "page-title",
  className,
  children,
}: PageHeroProps) {
  return (
    <Section
      tone={band ? "dark" : "light"}
      rhythm={band ? "band" : "hero"}
      labelledBy={titleId}
      className={cn("relative", band && "navy-band page-hero-band", className)}
    >
      <Container className="page-hero relative">
        {breadcrumbs && breadcrumbsLabel ? (
          <Breadcrumbs items={breadcrumbs} label={breadcrumbsLabel} />
        ) : null}
        {/* Bezak toʻr ichida: sahifa chetiga (x = 0) yopishib qolmaydi. */}
        {art}
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
