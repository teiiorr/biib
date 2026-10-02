import "server-only";

import { revalidatePath, updateTag } from "next/cache";
import { after } from "next/server";

import { LOCALES } from "@/i18n/locales";
import { isNewsSlug, pathFor } from "@/i18n/routes";
import { CMS_TAG } from "@/lib/cms/load";
import { absoluteUrl } from "@/lib/site";

export interface PublishChange {
  /** Yangi, eski va oʻchirilgan maqola sluglari: keshdagi 404 sahifasi ham tozalanadi. */
  readonly slugs?: readonly (string | null | undefined)[];
  /** Saqlashdan keyin darhol isitiladigan sahifalar (faqat ishlab chiqarishda). */
  readonly warm?: readonly string[];
}

const WARM_PARALLEL = 4;
const WARM_TIMEOUT_MS = 10_000;

async function warmPages(paths: readonly string[]): Promise<void> {
  for (let i = 0; i < paths.length; i += WARM_PARALLEL) {
    await Promise.allSettled(
      paths.slice(i, i + WARM_PARALLEL).map((path) =>
        fetch(absoluteUrl(path), {
          cache: "no-store",
          signal: AbortSignal.timeout(WARM_TIMEOUT_MS),
        }),
      ),
    );
  }
}

/**
 * Faqat server amali ichida chaqiriladi. cms tegi hamma sahifa va maʼlumot keshini eskirtiradi.
 * Maqola yoʻllari alohida tozalanadi, aks holda yangi yoki oʻchirilgan slug uchun keshda eski 404 qoladi.
 */
export function publish(change: PublishChange = {}): void {
  updateTag(CMS_TAG);
  const slugs = new Set(
    (change.slugs ?? []).filter((slug): slug is string => !!slug && isNewsSlug(slug)),
  );
  for (const slug of slugs) {
    for (const locale of LOCALES) revalidatePath(pathFor(locale, "newsItem", slug));
  }
  const warm = change.warm ?? [];
  /* Birinchi tashrifchi kutib qolmasin. Xato boʻlsa ham farqi yoʻq: sahifa baribir oʻzi yangilanadi. */
  if (process.env.VERCEL_ENV === "production" && warm.length) after(() => warmPages(warm));
}

export function newsWarmPaths(slug: string): readonly string[] {
  return [pathFor("uz", "home"), pathFor("uz", "news"), pathFor("uz", "newsItem", slug)];
}
