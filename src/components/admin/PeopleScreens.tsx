import { notFound, redirect } from "next/navigation";

import { Heading } from "@/components/ui/Heading";
import { LinkButton } from "@/components/ui/LinkButton";
import { Text } from "@/components/ui/Text";
import type { PersonKind } from "@/content/types";
import { PEOPLE_COPY } from "@/lib/admin/copy-people";
import type { AdminDb } from "@/lib/admin/db";
import { mediaByIds, recentMedia } from "@/lib/admin/news/queries";
import { emptyPersonDraft, personDraftFromAdmin } from "@/lib/admin/people/draft";
import { PERSON_KINDS } from "@/lib/admin/people/kinds";
import { listPeople, loadPerson } from "@/lib/admin/people/queries";

import { AdminIcon } from "./AdminIcon";
import { PeopleList } from "./PeopleList";
import { PersonEditor } from "./PersonEditor";

interface ScreenProps {
  readonly kind: PersonKind;
  readonly db: AdminDb;
}

/** Roʻyxat sahifasi: qoʻshish tugmasi, bosh sahifa haqida izoh va tartiblanadigan roʻyxat. */
export async function PeopleListScreen({ kind, db }: ScreenProps) {
  const rows = await listPeople(db, kind);
  const K = PEOPLE_COPY.kinds[kind];
  return (
    <section className="admin-page">
      <Heading level={1}>{K.title}</Heading>
      <div className="admin-actions">
        <LinkButton
          href={`${PERSON_KINDS[kind].admin}/yangi`}
          variant="primary"
          graphic={<AdminIcon name="plus" size={20} />}
        >
          {K.add}
        </LinkButton>
      </div>
      {rows.length ? (
        <>
          <div className="admin-hints">
            <Text size="small" tone="ink-2">
              {K.home}
            </Text>
            {rows.length > 1 ? (
              <Text size="small" tone="ink-2">
                {PEOPLE_COPY.list.order}
              </Text>
            ) : null}
          </div>
          <PeopleList kind={kind} rows={rows} />
        </>
      ) : (
        <Text tone="ink-2" align="center">
          {K.empty}
        </Text>
      )}
    </section>
  );
}

/** Yangi odam: boʻsh tahrir oynasi, saqlangach oʻz sahifasiga oʻtiladi. */
export async function PersonCreateScreen({ kind, db }: ScreenProps) {
  const library = await recentMedia(db);
  return (
    <section className="admin-page admin-page-wide">
      <Heading level={1}>{PEOPLE_COPY.kinds[kind].createTitle}</Heading>
      <PersonEditor
        kind={kind}
        id={null}
        personKey={null}
        initial={emptyPersonDraft()}
        updatedAt={null}
        justSaved={false}
        library={library}
      />
    </section>
  );
}

interface EditScreenProps extends ScreenProps {
  readonly id: string;
  readonly justSaved: boolean;
}

/** Mavjud odam: boshqa boʻlimdagi (rahbar ↔ ekspert) id oʻz boʻlimiga yoʻnaltiriladi. */
export async function PersonEditScreen({ kind, db, id, justSaved }: EditScreenProps) {
  const loaded = await loadPerson(db, id);
  if (!loaded) notFound();
  const { data, updatedAt } = loaded;
  if (data.kind !== kind) redirect(`${PERSON_KINDS[data.kind].admin}/${id}`);
  const [media, library] = await Promise.all([
    mediaByIds(db, data.photoId ? [data.photoId] : []),
    recentMedia(db),
  ]);
  return (
    <section className="admin-page admin-page-wide">
      <Heading level={1}>{PEOPLE_COPY.kinds[kind].editTitle}</Heading>
      <PersonEditor
        key={id}
        kind={kind}
        id={id}
        personKey={data.key ?? null}
        initial={personDraftFromAdmin(data, media)}
        updatedAt={updatedAt}
        justSaved={justSaved}
        library={library}
      />
    </section>
  );
}
