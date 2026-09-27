import type { Metadata } from "next";

import { PersonCreateScreen } from "@/components/admin/PeopleScreens";
import { PEOPLE_COPY } from "@/lib/admin/copy-people";
import { adminDb } from "@/lib/admin/db";
import { requireAdmin } from "@/lib/admin/guard";

export const metadata: Metadata = { title: PEOPLE_COPY.kinds.expert.createTitle };

export default async function ExpertsCreatePage() {
  const session = await requireAdmin("/admin/ekspertlar/yangi");
  return <PersonCreateScreen kind="expert" db={adminDb(session.accessToken)} />;
}
