import type { ReactNode } from "react";

import { Heading } from "@/components/ui/Heading";

import { Container } from "./Container";

interface ErrorViewProps {
  readonly title: string;
  readonly actions: ReactNode;
}

/**
 * 404 va xato sahifalari: bezaksiz tipografik tuzilma — markazda katta oltin sarlavha, ostida tavsif
 * yoʻq (egasining talabi), harakatlar chiziq ustida oʻngda (tugmalar qatori butun saytda oʻng tomonda).
 */
export function ErrorView({ title, actions }: ErrorViewProps) {
  return (
    <Container className="error-view">
      <Heading level={1}>{title}</Heading>
      <div className="error-view-actions">{actions}</div>
    </Container>
  );
}
