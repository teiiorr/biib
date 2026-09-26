import type { Metadata } from "next";

import { AdminIcon } from "@/components/admin/AdminIcon";
import { JournalTable } from "@/components/admin/JournalTable";
import { Heading } from "@/components/ui/Heading";
import { LinkButton } from "@/components/ui/LinkButton";
import { ADMIN_COPY } from "@/lib/admin/copy";
import { adminDb } from "@/lib/admin/db";
import { requireAdmin } from "@/lib/admin/guard";
import { loadJournal } from "@/lib/admin/journal";

export const metadata: Metadata = { title: ADMIN_COPY.pages.journal };

const PAGE = 50;

interface JournalPageProps {
  readonly searchParams: Promise<{ oldin?: string | string[] }>;
}

export default async function JournalPage({ searchParams }: JournalPageProps) {
  const session = await requireAdmin("/admin/jurnal");
  const { oldin } = await searchParams;
  const before = typeof oldin === "string" && /^\d{1,15}$/.test(oldin) ? Number(oldin) : null;
  const rows = await loadJournal(adminDb(session.accessToken), PAGE, before);
  const last = rows.at(-1);
  return (
    <section className="admin-page">
      <Heading level={1}>{ADMIN_COPY.pages.journal}</Heading>
      <JournalTable rows={rows} />
      <div className="admin-actions">
        {before ? (
          <LinkButton href="/admin/jurnal" variant="glass" icon="arrow-up">
            {ADMIN_COPY.journal.newest}
          </LinkButton>
        ) : null}
        {rows.length === PAGE && last ? (
          <LinkButton
            href={`/admin/jurnal?oldin=${last.id}`}
            variant="glass"
            graphic={<AdminIcon name="arrow-down" size={20} />}
          >
            {ADMIN_COPY.journal.older}
          </LinkButton>
        ) : null}
      </div>
    </section>
  );
}
