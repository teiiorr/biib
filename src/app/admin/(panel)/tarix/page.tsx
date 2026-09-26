import type { Metadata } from "next";

import { AdminPlaceholder } from "@/components/admin/AdminPlaceholder";
import { ADMIN_COPY } from "@/lib/admin/copy";
import { requireAdmin } from "@/lib/admin/guard";

export const metadata: Metadata = { title: ADMIN_COPY.pages.history };

export default async function HistoryAdminPage() {
  await requireAdmin("/admin/tarix");
  return <AdminPlaceholder title={ADMIN_COPY.pages.history} />;
}
