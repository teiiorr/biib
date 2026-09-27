import type { Metadata } from "next";

import { MediaLibrary } from "@/components/admin/MediaLibrary";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { ADMIN_COPY } from "@/lib/admin/copy";
import { SYSTEM_COPY } from "@/lib/admin/copy-system";
import { adminDb } from "@/lib/admin/db";
import { requireAdmin } from "@/lib/admin/guard";
import { listLibrary } from "@/lib/admin/media/library";

import "@/styles/admin-library.css";

export const metadata: Metadata = { title: ADMIN_COPY.pages.media };

/** Media: hamma rasm va video, ishlatilish soni bilan; yuklash va ishlatilmaganini oʻchirish. */
export default async function MediaAdminPage() {
  const session = await requireAdmin("/admin/media");
  const items = await listLibrary(adminDb(session.accessToken));
  return (
    <section className="admin-page admin-page-wide">
      <Heading level={1}>{ADMIN_COPY.pages.media}</Heading>
      <Text tone="ink-2" measure>
        {SYSTEM_COPY.media.intro}
      </Text>
      <MediaLibrary items={items} />
    </section>
  );
}
