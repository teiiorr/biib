import type { Metadata } from "next";

import { PartnerCreateScreen } from "@/components/admin/PartnerScreens";
import { PEOPLE_COPY } from "@/lib/admin/copy-people";
import { adminDb } from "@/lib/admin/db";
import { requireAdmin } from "@/lib/admin/guard";

export const metadata: Metadata = { title: PEOPLE_COPY.partners.createTitle };

export default async function PartnerCreatePage() {
  const session = await requireAdmin("/admin/hamkorlar/yangi");
  return <PartnerCreateScreen db={adminDb(session.accessToken)} />;
}
