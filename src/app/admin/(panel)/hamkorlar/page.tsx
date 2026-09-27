import type { Metadata } from "next";

import { PartnersListScreen } from "@/components/admin/PartnerScreens";
import { PEOPLE_COPY } from "@/lib/admin/copy-people";
import { adminDb } from "@/lib/admin/db";
import { requireAdmin } from "@/lib/admin/guard";

export const metadata: Metadata = { title: PEOPLE_COPY.partners.title };

export default async function PartnersAdminPage() {
  const session = await requireAdmin("/admin/hamkorlar");
  return <PartnersListScreen db={adminDb(session.accessToken)} />;
}
