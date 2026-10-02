import type { Metadata } from "next";

import { GalleryEditor } from "@/components/admin/GalleryEditor";
import { Heading } from "@/components/ui/Heading";
import { ADMIN_COPY } from "@/lib/admin/copy";
import { adminDb } from "@/lib/admin/db";
import { requireAdmin } from "@/lib/admin/guard";
import { slotsFromShots } from "@/lib/admin/org/gallery";
import { galleryLibrary, galleryMediaByIds } from "@/lib/admin/org/media-queries";
import { loadShots } from "@/lib/admin/org/queries";
import { emptyLocalized } from "@/lib/admin/text/locales";

export const metadata: Metadata = { title: ADMIN_COPY.pages.gallery };

export default async function UpopGalleryAdminPage() {
  const session = await requireAdmin("/admin/upop/galereya");
  const db = adminDb(session.accessToken);
  const [shots, library] = await Promise.all([loadShots(db), galleryLibrary(db)]);
  const { media, images } = await galleryMediaByIds(
    db,
    shots.data.flatMap((s) => [s.mediaId, ...(s.posterId ? [s.posterId] : [])]),
  );
  /* Media yozuvi topilmagan joy boʻsh koʻrinadi va saqlangach galereyadan chiqadi. */
  const slots = slotsFromShots(shots.data, (shot) => {
    const item = media.get(shot.mediaId);
    if (!item) return null;
    return {
      media: item,
      poster: shot.posterId ? (images.get(shot.posterId) ?? null) : null,
      frame: shot.frame,
      motion: shot.motion,
      alt: shot.alt ?? emptyLocalized(),
    };
  });
  return (
    <section className="admin-page admin-page-wide">
      <Heading level={1}>{ADMIN_COPY.pages.gallery}</Heading>
      <GalleryEditor initial={slots} version={shots.version ?? ""} library={library} />
    </section>
  );
}
