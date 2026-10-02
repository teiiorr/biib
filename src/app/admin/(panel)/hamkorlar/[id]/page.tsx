import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PartnerEditScreen } from "@/components/admin/PartnerScreens";
import { PEOPLE_COPY } from "@/lib/admin/copy-people";
import { adminDb } from "@/lib/admin/db";
import { requireAdmin } from "@/lib/admin/guard";
import { UUID_RE } from "@/lib/admin/news/queries";

export const metadata: Metadata = { title: PEOPLE_COPY.partners.editTitle };

interface PartnerEditPageProps {
  readonly params: Promise<{ id: string }>;
  readonly searchParams: Promise<{ saqlandi?: string | string[] }>;
}

export default async function PartnerEditPage({ params, searchParams }: PartnerEditPageProps) {
  const { id } = await params;
  /* Yoʻl faqat uuid boʻlsa «next» parametriga yoziladi: kirish sahifasiga ixtiyoriy matn uzatilmaydi. */
  if (!UUID_RE.test(id)) notFound();
  const session = await requireAdmin(`/admin/hamkorlar/${id}`);
  const { saqlandi } = await searchParams;
  return (
    <PartnerEditScreen db={adminDb(session.accessToken)} id={id} justSaved={saqlandi === "1"} />
  );
}
