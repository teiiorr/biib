import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PersonEditScreen } from "@/components/admin/PeopleScreens";
import { PEOPLE_COPY } from "@/lib/admin/copy-people";
import { adminDb } from "@/lib/admin/db";
import { requireAdmin } from "@/lib/admin/guard";
import { UUID_RE } from "@/lib/admin/news/queries";

export const metadata: Metadata = { title: PEOPLE_COPY.kinds.expert.editTitle };

interface ExpertsEditPageProps {
  readonly params: Promise<{ id: string }>;
  readonly searchParams: Promise<{ saqlandi?: string | string[] }>;
}

export default async function ExpertsEditPage({ params, searchParams }: ExpertsEditPageProps) {
  const { id } = await params;
  /* Yoʻl faqat uuid boʻlsa «next» parametriga yoziladi: kirish sahifasiga ixtiyoriy matn uzatilmaydi. */
  if (!UUID_RE.test(id)) notFound();
  const session = await requireAdmin(`/admin/ekspertlar/${id}`);
  const { saqlandi } = await searchParams;
  return (
    <PersonEditScreen
      kind="expert"
      db={adminDb(session.accessToken)}
      id={id}
      justSaved={saqlandi === "1"}
    />
  );
}
