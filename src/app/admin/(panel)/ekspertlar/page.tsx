import type { Metadata } from "next";

import { PeopleListScreen } from "@/components/admin/PeopleScreens";
import { PEOPLE_COPY } from "@/lib/admin/copy-people";
import { adminDb } from "@/lib/admin/db";
import { requireAdmin } from "@/lib/admin/guard";

export const metadata: Metadata = { title: PEOPLE_COPY.kinds.expert.title };

export default async function ExpertsAdminPage() {
  const session = await requireAdmin("/admin/ekspertlar");
  return <PeopleListScreen kind="expert" db={adminDb(session.accessToken)} />;
}
