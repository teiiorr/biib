import type { Metadata } from "next";

import { PeopleListScreen } from "@/components/admin/PeopleScreens";
import { PEOPLE_COPY } from "@/lib/admin/copy-people";
import { adminDb } from "@/lib/admin/db";
import { requireAdmin } from "@/lib/admin/guard";

export const metadata: Metadata = { title: PEOPLE_COPY.kinds.leader.title };

export default async function LeadershipAdminPage() {
  const session = await requireAdmin("/admin/rahbariyat");
  return <PeopleListScreen kind="leader" db={adminDb(session.accessToken)} />;
}
