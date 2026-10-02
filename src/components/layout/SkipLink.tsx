interface SkipLinkProps {
  readonly label: string;
}

/** Klaviatura bilan kirganda birinchi fokus shu havolaga tushadi. */
export function SkipLink({ label }: SkipLinkProps) {
  return (
    <a href="#content" className="skip-link sr-only-focusable t-label" data-testid="skip-link">
      {label}
    </a>
  );
}
