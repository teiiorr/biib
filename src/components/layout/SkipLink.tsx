interface SkipLinkProps {
  readonly label: string;
}

/** Klaviaturada birinchi fokus: asosiy qismga oʻtish. */
export function SkipLink({ label }: SkipLinkProps) {
  return (
    <a href="#content" className="skip-link sr-only-focusable t-label" data-testid="skip-link">
      {label}
    </a>
  );
}
