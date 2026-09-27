import type { Metadata } from "next";

import { ContactsEditor } from "@/components/admin/ContactsEditor";
import { Heading } from "@/components/ui/Heading";
import { ADMIN_COPY } from "@/lib/admin/copy";
import { adminDb } from "@/lib/admin/db";
import { requireAdmin } from "@/lib/admin/guard";
import { draftFromContacts } from "@/lib/admin/org/contacts";
import { contactsVersion, loadContacts, loadSocials } from "@/lib/admin/org/queries";

export const metadata: Metadata = { title: ADMIN_COPY.pages.contacts };

export default async function ContactsAdminPage() {
  const session = await requireAdmin("/admin/aloqa");
  const db = adminDb(session.accessToken);
  const [contacts, socials] = await Promise.all([loadContacts(db), loadSocials(db)]);
  return (
    <section className="admin-page">
      <Heading level={1}>{ADMIN_COPY.pages.contacts}</Heading>
      <ContactsEditor
        initial={draftFromContacts(contacts.data, socials.data)}
        version={contactsVersion(contacts.version, socials.data)}
      />
    </section>
  );
}
