import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { NewsEditor } from "@/components/admin/NewsEditor";
import { Heading } from "@/components/ui/Heading";
import { NEWS_COPY } from "@/lib/admin/copy-news";
import { adminDb } from "@/lib/admin/db";
import { requireAdmin } from "@/lib/admin/guard";
import { draftFromAdmin } from "@/lib/admin/news/draft";
import { loadNews, mediaByIds, recentMedia, UUID_RE } from "@/lib/admin/news/queries";

export const metadata: Metadata = { title: NEWS_COPY.editor.editTitle };

interface NewsEditPageProps {
  readonly params: Promise<{ id: string }>;
  readonly searchParams: Promise<{ saqlandi?: string | string[] }>;
}

export default async function NewsEditPage({ params, searchParams }: NewsEditPageProps) {
  const { id } = await params;
  /* Yoʻl faqat uuid boʻlsa «next» ga qoʻyiladi: boshqa matn kirish sahifasiga olib bormaydi. */
  if (!UUID_RE.test(id)) notFound();
  const session = await requireAdmin(`/admin/yangiliklar/${id}`);
  const db = adminDb(session.accessToken);
  const loaded = await loadNews(db, id);
  if (!loaded) notFound();
  const { data, updatedAt } = loaded;
  const [media, library] = await Promise.all([
    mediaByIds(db, [
      ...(data.cover.mediaId ? [data.cover.mediaId] : []),
      ...data.photos.map((photo) => photo.mediaId),
    ]),
    recentMedia(db),
  ]);
  const { saqlandi } = await searchParams;
  return (
    <section className="admin-page admin-page-wide">
      <Heading level={1}>{NEWS_COPY.editor.editTitle}</Heading>
      <NewsEditor
        key={id}
        id={id}
        initial={draftFromAdmin(data, media)}
        updatedAt={updatedAt}
        savedStatus={data.status}
        justSaved={saqlandi === "1"}
        library={library}
      />
    </section>
  );
}
