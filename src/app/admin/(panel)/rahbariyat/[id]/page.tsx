import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PersonEditScreen } from "@/components/admin/PeopleScreens";
import { PEOPLE_COPY } from "@/lib/admin/copy-people";
import { adminDb } from "@/lib/admin/db";
import { requireAdmin } from "@/lib/admin/guard";
import { UUID_RE } from "@/lib/admin/news/queries";

export const metadata: Metadata = { title: PEOPLE_COPY.kinds.leader.editTitle };

interface LeadershipEditPageProps {
  readonly params: Promise<{ id: string }>;
  readonly searchParams: Promise<{ saqlandi?: string | string[] }>;
}

export default async function LeadershipEditPage({
  params,
  searchParams,
}: LeadershipEditPageProps) {
  const { id } = await params;
  /* Yoʻl faqat uuid boʻlsa «next» ga qoʻyiladi: boshqa matn kirish sahifasiga olib bormaydi. */
  if (!UUID_RE.test(id)) notFound();
  const session = await requireAdmin(`/admin/rahbariyat/${id}`);
  const { saqlandi } = await searchParams;
  return (
    <PersonEditScreen
      kind="leader"
      db={adminDb(session.accessToken)}
      id={id}
      justSaved={saqlandi === "1"}
    />
  );
}
