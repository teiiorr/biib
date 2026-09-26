"use client";

import { useState, useTransition } from "react";

import { GlassDropdownMenu } from "@/components/glass/GlassDropdownMenu";
import { Button } from "@/components/ui/Button";
import { fill } from "@/i18n/format";
import { pathFor } from "@/i18n/routes";
import { deleteNews } from "@/lib/admin/actions/news";
import { NEWS_COPY } from "@/lib/admin/copy-news";

import { AdminIcon } from "./AdminIcon";
import { ConfirmDialog } from "./ConfirmDialog";

interface NewsRowActionsProps {
  readonly id: string;
  readonly slug: string;
  readonly title: string;
  /** Oʻchirishda kutilgan updated_at: boshqa oynada oʻzgargan yozuv oʻchirilmaydi. */
  readonly updatedAt: string;
}

const T = NEWS_COPY.list;

/** Qator menyusi: tahrirlash, saytda ochish (yangi oynada), oʻchirish (tasdiq bilan). */
export function NewsRowActions({ id, slug, title, updatedAt }: NewsRowActionsProps) {
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function remove(): void {
    startTransition(async () => {
      const result = await deleteNews(id, updatedAt);
      if (result.ok) setConfirming(false);
      else setError(result.message);
    });
  }

  return (
    <>
      <GlassDropdownMenu
        label={fill(T.menu, { title })}
        trigger={
          <Button
            variant="glass"
            size="40"
            iconOnly
            aria-label={fill(T.menu, { title })}
            graphic={<AdminIcon name="more" size={16} />}
          />
        }
        items={[
          {
            id: "edit",
            label: T.edit,
            href: `/admin/yangiliklar/${id}`,
            icon: <AdminIcon name="pencil" />,
          },
          {
            id: "open",
            label: T.open,
            onSelect: () => window.open(pathFor("uz", "newsItem", slug), "_blank", "noopener"),
            icon: <AdminIcon name="external" />,
          },
          {
            id: "delete",
            label: T.remove,
            onSelect: () => {
              setError(null);
              setConfirming(true);
            },
            icon: <AdminIcon name="trash" />,
          },
        ]}
      />
      <ConfirmDialog
        open={confirming}
        onOpenChange={setConfirming}
        title={T.deleteTitle}
        text={fill(T.deleteText, { title })}
        confirmLabel={T.remove}
        confirmGraphic={<AdminIcon name="trash" size={20} />}
        onConfirm={remove}
        pending={pending}
        error={error}
        danger
      />
    </>
  );
}
