import type { Metadata } from "next";

import { AdminIcon } from "@/components/admin/AdminIcon";
import { HealthCard } from "@/components/admin/HealthCard";
import { JournalTable } from "@/components/admin/JournalTable";
import { Heading } from "@/components/ui/Heading";
import { LinkButton } from "@/components/ui/LinkButton";
import { ADMIN_COPY } from "@/lib/admin/copy";
import { adminDb } from "@/lib/admin/db";
import { requireAdmin } from "@/lib/admin/guard";
import { siteHealth } from "@/lib/admin/health";
import { loadJournal } from "@/lib/admin/journal";

export const metadata: Metadata = { title: ADMIN_COPY.pages.dashboard };

const D = ADMIN_COPY.dashboard;

export default async function DashboardPage() {
  const session = await requireAdmin("/admin");
  const db = adminDb(session.accessToken);
  const [health, journal] = await Promise.all([
    siteHealth(db),
    loadJournal(db, 10).catch(() => []),
  ]);
  return (
    <section className="admin-page">
      <Heading level={1}>{ADMIN_COPY.pages.dashboard}</Heading>
      <div className="admin-actions">
        <LinkButton href="/admin/yangiliklar" variant="glass" icon="news">
          {D.allNews}
        </LinkButton>
        <LinkButton
          href="/admin/yangiliklar/yangi"
          variant="primary"
          graphic={<AdminIcon name="plus" size={20} />}
        >
          {D.addNews}
        </LinkButton>
      </div>
      <HealthCard health={health} />
      <section className="admin-section" aria-labelledby="admin-recent-title">
        <h2 id="admin-recent-title" className="t-h3 text-ink">
          {D.recent}
        </h2>
        <JournalTable rows={journal} />
        <div className="admin-actions">
          <LinkButton href="/admin/jurnal" variant="glass" icon="clock">
            {D.allJournal}
          </LinkButton>
        </div>
      </section>
    </section>
  );
}
