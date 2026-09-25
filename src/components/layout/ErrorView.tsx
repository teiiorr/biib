import type { ReactNode } from "react";

import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";

import { Container } from "./Container";

interface ErrorViewProps {
  readonly title: string;
  readonly text: string;
  readonly art?: ReactNode;
  readonly actions: ReactNode;
}

/** 404 va xato sahifalari uchun umumiy tuzilma: bezak, sarlavha, matn, harakatlar. */
export function ErrorView({ title, text, art, actions }: ErrorViewProps) {
  return (
    <Container className="error-view">
      {/* Oʻram qoladi: SVG qator qutisida turadi, toʻr bandiga aylansa balandligi oʻzgarardi. */}
      {art ? <div>{art}</div> : null}
      <Heading level={1} size="h1">
        {title}
      </Heading>
      <Text as="p" size="body-l" tone="ink-2" measure>
        {text}
      </Text>
      <div className="flex flex-wrap justify-end gap-3">{actions}</div>
    </Container>
  );
}
