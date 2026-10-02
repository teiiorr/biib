"use client";

import { useState, useTransition } from "react";

import { Button } from "@/components/ui/Button";
import { FormMessage } from "@/components/ui/FormMessage";
import { refreshSite } from "@/lib/admin/actions/site";
import { ADMIN_COPY } from "@/lib/admin/copy";

import { AdminIcon } from "./AdminIcon";

const H = ADMIN_COPY.health;

/** Bazada qoʻlda qilingan oʻzgarish ham hamma sahifaga darhol chiqishi uchun. */
export function RefreshSiteButton() {
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<"ok" | "failed" | null>(null);
  return (
    <div className="admin-refresh">
      <div className="admin-actions">
        <Button
          variant="glass"
          size="48"
          loading={pending}
          graphic={<AdminIcon name="refresh" size={20} />}
          onClick={() =>
            startTransition(async () => {
              const response = await refreshSite().catch(() => null);
              setResult(response?.ok ? "ok" : "failed");
            })
          }
        >
          {pending ? H.refreshing : H.refresh}
        </Button>
      </div>
      <FormMessage tone={result === "failed" ? "error" : "success"}>
        {result === "ok" ? H.refreshed : result === "failed" ? H.failed : null}
      </FormMessage>
    </div>
  );
}
