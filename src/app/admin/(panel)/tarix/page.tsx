import type { Metadata } from "next";

import { MilestonesEditor } from "@/components/admin/MilestonesEditor";
import { Heading } from "@/components/ui/Heading";
import { ADMIN_COPY } from "@/lib/admin/copy";
import { adminDb } from "@/lib/admin/db";
import { requireAdmin } from "@/lib/admin/guard";
import { rowFromStored } from "@/lib/admin/org/milestones";
import { listMilestones } from "@/lib/admin/org/queries";

export const metadata: Metadata = { title: ADMIN_COPY.pages.history };

export default async function HistoryAdminPage() {
  const session = await requireAdmin("/admin/tarix");
  const stored = await listMilestones(adminDb(session.accessToken));
  return (
    <section className="admin-page">
      <Heading level={1}>{ADMIN_COPY.pages.history}</Heading>
      <MilestonesEditor initial={{ rows: stored.map(rowFromStored) }} />
    </section>
  );
}
