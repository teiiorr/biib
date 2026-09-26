import type { Metadata } from "next";

import { AdminIcon } from "@/components/admin/AdminIcon";
import { NewsTable } from "@/components/admin/NewsTable";
import { Heading } from "@/components/ui/Heading";
import { LinkButton } from "@/components/ui/LinkButton";
import { Text } from "@/components/ui/Text";
import { ADMIN_COPY } from "@/lib/admin/copy";
import { NEWS_COPY } from "@/lib/admin/copy-news";
import { adminDb } from "@/lib/admin/db";
import { requireAdmin } from "@/lib/admin/guard";
import { listNews } from "@/lib/admin/news/queries";

export const metadata: Metadata = { title: ADMIN_COPY.pages.news };

/* Oʻn ikkitadan koʻp boʻlsa roʻyxat uzun: sahifalarga boʻlish keyingi dizayn vazifasi. */
const LONG_LIST = 12;

export default async function NewsAdminPage() {
  const session = await requireAdmin("/admin/yangiliklar");
  const rows = await listNews(adminDb(session.accessToken));
  return (
    <section className="admin-page">
      <Heading level={1}>{ADMIN_COPY.pages.news}</Heading>
      <div className="admin-actions">
        <LinkButton
          href="/admin/yangiliklar/yangi"
          variant="primary"
          graphic={<AdminIcon name="plus" size={20} />}
        >
          {NEWS_COPY.list.add}
        </LinkButton>
      </div>
      {rows.length > LONG_LIST ? (
        <Text size="small" tone="ink-2">
          {NEWS_COPY.list.many}
        </Text>
      ) : null}
      {rows.length ? (
        <NewsTable rows={rows} />
      ) : (
        <Text tone="ink-2" align="center">
          {NEWS_COPY.list.empty}
        </Text>
      )}
    </section>
  );
}
