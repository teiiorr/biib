import { notFound } from "next/navigation";

/* /admin ostidagi nomaʼlum yoʻl shu yerda qoladi, [locale] yoki global 404 sahifasiga tushmaydi. */
export default function AdminMissingPage(): never {
  notFound();
}
