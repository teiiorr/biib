import type { Metadata } from "next";

import { NewsEditor } from "@/components/admin/NewsEditor";
import { Heading } from "@/components/ui/Heading";
import { NEWS_COPY } from "@/lib/admin/copy-news";
import { adminDb } from "@/lib/admin/db";
import { todayInTashkent } from "@/lib/admin/format";
import { requireAdmin } from "@/lib/admin/guard";
import { emptyDraft } from "@/lib/admin/news/draft";
import { recentMedia } from "@/lib/admin/news/queries";

export const metadata: Metadata = { title: NEWS_COPY.editor.createTitle };

export default async function NewsCreatePage() {
  const session = await requireAdmin("/admin/yangiliklar/yangi");
  const library = await recentMedia(adminDb(session.accessToken));
  return (
    <section className="admin-page admin-page-wide">
      <Heading level={1}>{NEWS_COPY.editor.createTitle}</Heading>
      <NewsEditor
        id={null}
        initial={emptyDraft(todayInTashkent())}
        updatedAt={null}
        savedStatus={null}
        justSaved={false}
        library={library}
      />
    </section>
  );
}
