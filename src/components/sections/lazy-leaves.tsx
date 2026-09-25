"use client";

import dynamic from "next/dynamic";

/*
 * Sakkiz boʻlim bitta [section] marshrutida: oddiy import bilan aloqa formasi, video va dialog kodi
 * hamma boʻlim sahifasining birinchi yuklanishiga kirardi (≈ 12 KB gzip). Bu barglar alohida chunk:
 * server HTML ni odatdagidek chizadi, chunk faqat barg chizilgan sahifada (past ustuvorlik preload bilan)
 * olinadi va barg shu chunk kelganda gidratsiya boʻladi.
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
