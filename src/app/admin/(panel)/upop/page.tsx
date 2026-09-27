import type { Metadata } from "next";

import { UpopEditor } from "@/components/admin/UpopEditor";
import { Heading } from "@/components/ui/Heading";
import { ADMIN_COPY } from "@/lib/admin/copy";
import { adminDb } from "@/lib/admin/db";
import { requireAdmin } from "@/lib/admin/guard";
import { projectMediaFiles } from "@/lib/admin/org/media-queries";
import { loadProject } from "@/lib/admin/org/queries";

export const metadata: Metadata = { title: ADMIN_COPY.pages.upop };

export default async function UpopAdminPage() {
  const session = await requireAdmin("/admin/upop");
  const db = adminDb(session.accessToken);
  const [project, files] = await Promise.all([loadProject(db), projectMediaFiles(db)]);
  return (
    <section className="admin-page admin-page-wide">
      <Heading level={1}>{ADMIN_COPY.pages.upop}</Heading>
      <UpopEditor data={project.data} version={project.version} files={files} />
    </section>
  );
}
