import { notFound } from "next/navigation";

/* /admin ostidagi har qanday nomaʼlum yoʻl shu yerda tugaydi: [locale] ga yoki global 404 ga tushmaydi. */
export default function AdminMissingPage(): never {
  notFound();
}
