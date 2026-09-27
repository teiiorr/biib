import type { Metadata } from "next";

import { PersonCreateScreen } from "@/components/admin/PeopleScreens";
import { PEOPLE_COPY } from "@/lib/admin/copy-people";
import { adminDb } from "@/lib/admin/db";
import { requireAdmin } from "@/lib/admin/guard";

export const metadata: Metadata = { title: PEOPLE_COPY.kinds.leader.createTitle };

export default async function LeadershipCreatePage() {
  const session = await requireAdmin("/admin/rahbariyat/yangi");
  return <PersonCreateScreen kind="leader" db={adminDb(session.accessToken)} />;
}
