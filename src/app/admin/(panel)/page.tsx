import type { Metadata } from "next";

import { AdminIcon } from "@/components/admin/AdminIcon";
import { Heading } from "@/components/ui/Heading";
import { LinkButton } from "@/components/ui/LinkButton";
import { Text } from "@/components/ui/Text";
import { ADMIN_COPY } from "@/lib/admin/copy";
import { requireAdmin } from "@/lib/admin/guard";

export const metadata: Metadata = { title: ADMIN_COPY.pages.dashboard };

const NEWS = ADMIN_COPY.dashboard.news;

/** Boshqaruv: hozircha asosiy ish — yangiliklar; sayt holati va jurnal keyingi bosqichda qoʻshiladi. */
export default async function DashboardPage() {
  await requireAdmin("/admin");
  return (
    <section className="admin-page">
      <Heading level={1}>{ADMIN_COPY.pages.dashboard}</Heading>
      <div className="admin-cards">
        <article className="admin-card" aria-labelledby="admin-card-news">
          <div className="admin-card-head">
            <span className="admin-card-icon">
              <AdminIcon name="news" size={24} />
            </span>
            <h2 id="admin-card-news" className="t-h3 text-ink">
              {NEWS.title}
            </h2>
          </div>
          <Text tone="ink-2">{NEWS.text}</Text>
          <div className="admin-actions">
            <LinkButton href="/admin/yangiliklar" icon="arrow-right" iconPosition="end">
              {NEWS.action}
            </LinkButton>
          </div>
        </article>
      </div>
    </section>
  );
}
