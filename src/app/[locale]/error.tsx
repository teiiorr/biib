"use client";

import { ErrorPageView } from "@/components/sections/errors/ErrorPageView";

interface ErrorProps {
  readonly error: Error & { digest?: string };
  readonly reset: () => void;
}

export default function ErrorPage({ reset }: ErrorProps) {
  return <ErrorPageView retry={reset} />;
}
