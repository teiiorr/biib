import { cn } from "@/lib/cn";

import { Breadcrumbs, type BreadcrumbItem } from "@/components/ui/Breadcrumbs";
import { Heading } from "@/components/ui/Heading";

import { Container } from "./Container";
import { Section } from "./Section";

interface PageHeroProps {
  readonly title: string;
  readonly breadcrumbs?: readonly BreadcrumbItem[];
  readonly breadcrumbsLabel?: string;
  /** Rasmiy sahifalarda sarlavha bezaksiz, tinch lojuvard lentada turadi. */
  readonly band?: boolean;
  readonly titleId?: string;
  readonly className?: string;
}

/** Nonushoq yoʻli va oltin h1 bir oʻqda, markazda turadi; sarlavha ostida tavsif berilmaydi. */
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
