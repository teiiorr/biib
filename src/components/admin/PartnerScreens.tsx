import { notFound } from "next/navigation";

import { Heading } from "@/components/ui/Heading";
import { LinkButton } from "@/components/ui/LinkButton";
import { Text } from "@/components/ui/Text";
import { fill } from "@/i18n/format";
import { PEOPLE_COPY } from "@/lib/admin/copy-people";
import type { AdminDb } from "@/lib/admin/db";
import { mediaByIds, recentMedia } from "@/lib/admin/news/queries";
import { emptyPartnerDraft, partnerDraftFromAdmin } from "@/lib/admin/partners/draft";
import { listPartners, loadPartner } from "@/lib/admin/partners/queries";

import { AdminIcon } from "./AdminIcon";
import { PartnerEditor } from "./PartnerEditor";
import { PartnersList } from "./PartnersList";

const P = PEOPLE_COPY.partners;

/**
 * Hamkorlar roʻyxati. Izohdagi son selectConfirmedPartners bilan bir xil sanaladi (tasdiqlangan, nomli
 * va logotipli): bosh sahifadagi maydon oltitadan boshlab chiqadi.
 */
export async function PartnersListScreen({ db }: { readonly db: AdminDb }) {
  const rows = await listPartners(db);
  const ready = rows.filter((row) => row.status === "confirmed" && row.name && row.logo).length;
  return (
    <section className="admin-page">
      <Heading level={1}>{P.title}</Heading>
      <div className="admin-actions">
        <LinkButton
          href="/admin/hamkorlar/yangi"
          variant="primary"
          graphic={<AdminIcon name="plus" size={20} />}
        >
          {P.add}
        </LinkButton>
      </div>
      <div className="admin-hints">
        <Text size="small" tone="ink-2">
          {fill(P.home, { n: ready })}
        </Text>
        {rows.length > 1 ? (
          <Text size="small" tone="ink-2">
            {P.order}
          </Text>
        ) : null}
      </div>
      {rows.length ? (
        <PartnersList rows={rows} />
      ) : (
        <Text tone="ink-2" align="center">
          {P.empty}
        </Text>
      )}
    </section>
  );
}

export async function PartnerCreateScreen({ db }: { readonly db: AdminDb }) {
  const library = await recentMedia(db);
  return (
    <section className="admin-page admin-page-wide">
      <Heading level={1}>{P.createTitle}</Heading>
      <PartnerEditor
        id={null}
        initial={emptyPartnerDraft()}
        updatedAt={null}
        justSaved={false}
        library={library}
      />
    </section>
  );
}

interface PartnerEditScreenProps {
  readonly db: AdminDb;
  readonly id: string;
  readonly justSaved: boolean;
}

export async function PartnerEditScreen({ db, id, justSaved }: PartnerEditScreenProps) {
  const loaded = await loadPartner(db, id);
  if (!loaded) notFound();
  const { data, updatedAt } = loaded;
  const [media, library] = await Promise.all([
    mediaByIds(db, data.logoId ? [data.logoId] : []),
    recentMedia(db),
  ]);
  return (
    <section className="admin-page admin-page-wide">
      <Heading level={1}>{P.editTitle}</Heading>
      <PartnerEditor
        key={id}
        id={id}
        initial={partnerDraftFromAdmin(data, media)}
        updatedAt={updatedAt}
        justSaved={justSaved}
        library={library}
      />
    </section>
  );
}
