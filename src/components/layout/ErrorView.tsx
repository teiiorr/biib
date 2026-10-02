import type { ReactNode } from "react";

import { Heading } from "@/components/ui/Heading";

import { Container } from "./Container";

interface ErrorViewProps {
  readonly title: string;
  readonly actions: ReactNode;
}

/** Harakatlar oʻng tomonda: saytdagi barcha tugmalar qatori shu tartibda. */
export function ErrorView({ title, actions }: ErrorViewProps) {
  return (
    <Container className="error-view">
      <Heading level={1}>{title}</Heading>
      <div className="error-view-actions">{actions}</div>
    </Container>
  );
}
