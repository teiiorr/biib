import type { Metadata } from "next";

import { AdminPlaceholder } from "@/components/admin/AdminPlaceholder";
import { ADMIN_COPY } from "@/lib/admin/copy";
import { requireAdmin } from "@/lib/admin/guard";

export const metadata: Metadata = { title: ADMIN_COPY.pages.texts };

export default async function TextsAdminPage() {
  await requireAdmin("/admin/matnlar");
  return <AdminPlaceholder title={ADMIN_COPY.pages.texts} />;
}
