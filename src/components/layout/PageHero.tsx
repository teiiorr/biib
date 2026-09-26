import { cn } from "@/lib/cn";

import { Breadcrumbs, type BreadcrumbItem } from "@/components/ui/Breadcrumbs";
import { Heading } from "@/components/ui/Heading";

import { Container } from "./Container";
import { Section } from "./Section";

interface PageHeroProps {
  readonly title: string;
  readonly breadcrumbs?: readonly BreadcrumbItem[];
  readonly breadcrumbsLabel?: string;
  /** Rasmiy sahifalar: sarlavha tinch lojuvard lentada, bezaksiz. */
  readonly band?: boolean;
  readonly titleId?: string;
  readonly className?: string;
}

/**
 * Sahifa boshi: markazda nonushoq yoʻli va bitta katta oltin h1 (display-l). Sarlavha ostida
 * tavsif yoʻq (egasining talabi); nonushoq ham markazda, ikkalasi bir oʻqda turadi.
 */
export function PageHero({
  title,
  breadcrumbs,
  breadcrumbsLabel,
  band = false,
  titleId = "page-title",
  className,
}: PageHeroProps) {
  return (
    <Section
      {...(band ? { tone: "dark" as const } : {})}
      rhythm={band ? "band" : "hero"}
      labelledBy={titleId}
      className={cn("relative", band && "navy-band page-hero-band", className)}
    >
      <Container className="page-hero relative">
        {breadcrumbs && breadcrumbsLabel ? (
          <Breadcrumbs items={breadcrumbs} label={breadcrumbsLabel} align="center" />
        ) : null}
        <Heading level={1} id={titleId}>
          {title}
        </Heading>
      </Container>
    </Section>
  );
}
