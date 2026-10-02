"use client";

import dynamic from "next/dynamic";

/*
 * Sakkiz boʻlim bitta [section] marshrutida: oddiy importda forma, video va dialog kodi har bir
 * boʻlim sahifasiga qoʻshilardi (≈ 12 KB gzip). Shu sabab barglar alohida boʻlakda keladi.
 */
export const ContactFormLeaf = dynamic(() =>
  import("./contacts/ContactForm").then((mod) => mod.ContactForm),
);
export const CopyButtonLeaf = dynamic(() =>
  import("@/components/ui/CopyButton").then((mod) => mod.CopyButton),
);
export const PersonDialogLeaf = dynamic(() =>
  import("./experts/PersonDialog").then((mod) => mod.PersonDialog),
);
export const InViewVideoLeaf = dynamic(() =>
  import("./projects/InViewVideo").then((mod) => mod.InViewVideo),
);
export const ClickToPlayVideoLeaf = dynamic(() =>
  import("@/components/media/ClickToPlayVideo").then((mod) => mod.ClickToPlayVideo),
);
