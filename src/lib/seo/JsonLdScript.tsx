interface JsonLdProps {
  readonly data: Record<string, unknown> | ReadonlyArray<Record<string, unknown>> | null;
}

/** HTML ichida xavfsiz: < va & belgilarini unicode koʻrinishiga oʻtkazadi. */
function serialize(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c").replace(/&/g, "\\u0026");
}

export function JsonLd({ data }: JsonLdProps) {
  if (!data) return null;
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serialize(data) }} />
  );
}
