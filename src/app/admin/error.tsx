"use client";

import { unstable_isUnrecognizedActionError } from "next/navigation";

import { AdminStatus } from "@/components/admin/AdminStatus";
import { Button } from "@/components/ui/Button";
import { LinkButton } from "@/components/ui/LinkButton";
import { ADMIN_COPY } from "@/lib/admin/copy";

interface AdminErrorProps {
  readonly error: Error & { digest?: string };
  readonly retry: () => void;
}

const E = ADMIN_COPY.errors;

/**
 * Yangi yigʻishdan keyin ochiq qolgan oyna eski server amalini chaqiradi va u topilmaydi: bunda faqat
 * toʻliq qayta yuklash yordam beradi. Boshqa xatoda segment qayta chiziladi.
 */
export default function AdminError({ error, retry }: AdminErrorProps) {
  const stale = unstable_isUnrecognizedActionError(error);
  return (
    <AdminStatus
      title={stale ? E.staleTitle : E.generic}
      text={stale ? E.stale : E.genericText}
      actions={
        <>
          <LinkButton href="/admin" variant="glass" icon="arrow-left">
            {E.backHome}
          </LinkButton>
          <Button variant="primary" onClick={stale ? () => window.location.reload() : retry}>
            {stale ? E.reload : E.retry}
          </Button>
        </>
      }
    />
  );
}
