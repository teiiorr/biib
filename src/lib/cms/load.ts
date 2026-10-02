import "server-only";
import { cache } from "react";
import { unstable_cache } from "next/cache";

import { bundledSnapshot } from "@/content/bundled";
import { SNAPSHOT_VERSION, type ContentSnapshot } from "@/content/snapshot";
import { contentSource } from "./env";
import { fetchRemoteSnapshot, readBuildPin } from "./remote";

/** Kontentning yagona kesh tegi: admin saqlaganda updateTag(CMS_TAG) hamma sahifani eskirtiradi. */
export const CMS_TAG = "cms";
/* Versiya kalitda turadi: kesh deploydan deployga oʻtadi, shakl oʻzgarsa eski yozuv oʻqilmaydi. */
const KEY = ["cms-snapshot", String(SNAPSHOT_VERSION)];
/* unstable_cache sahifaning revalidate qiymatiga ham taʼsir qiladi, shu sabab maketdagi 3600 bilan bir xil. */
const OPTIONS = { tags: [CMS_TAG], revalidate: 3600 };
/* Maʼlumot qayerdan kelmasin (zaxira yoki yigʻish nusxasi), sahifaga cms tegi yopishadi va saqlash
   uni ham darhol yangilaydi. */
const tagPage = unstable_cache(async () => SNAPSHOT_VERSION, [...KEY, "tag"], OPTIONS);
const remote = unstable_cache(fetchRemoteSnapshot, KEY, OPTIONS);

/**
 * Bitta soʻrov (yoki yigʻishdagi bitta sahifa) davomida nusxa bir marta olinadi.
 * Manba CONTENT_SOURCE bilan tanlanadi (env.ts).
 */
export const loadSnapshot = cache(async (): Promise<ContentSnapshot> => {
  await tagPage();
  if (contentSource() === "bundled") return bundledSnapshot();
  /* Faqat yigʻish buyrugʻida qoʻyiladi (package.json build): ishlab turgan server uni koʻrmaydi. */
  const pin = process.env.CMS_BUILD_PIN;
  if (pin) return readBuildPin(pin);
  /* Xato ataylab otiladi: ISR oxirgi yaxshi sahifani beradi, yangi sahifada esa error.tsx chiqadi. */
  return remote();
});
