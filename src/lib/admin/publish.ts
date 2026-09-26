import "server-only";

import { revalidatePath, updateTag } from "next/cache";
import { after } from "next/server";

import { LOCALES } from "@/i18n/locales";
import { isNewsSlug, pathFor } from "@/i18n/routes";
import { CMS_TAG } from "@/lib/cms/load";
import { absoluteUrl } from "@/lib/site";

export interface PublishChange {
  /** Yangi, eski va oʻchirilgan maqola sluglari: ularning keshdagi 404 i ham tozalanadi. */
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
 * Faqat server amali ichida. cms tegi hamma sahifani va maʼlumot keshini darhol eskirtiradi; maqola
 * yoʻllari alohida: hali yigʻilmagan yoki oʻchirilgan slug uchun keshdagi 404 ham qolmasin.
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
  /* Birinchi tashrifchi kutib qolmasin; xatolar eʼtiborsiz — sahifa baribir oʻzi yangilanadi. */
  if (process.env.VERCEL_ENV === "production" && warm.length) after(() => warmPages(warm));
}

/** Yangilik saqlanganda isitiladigan oʻzbekcha sahifalar: bosh sahifa, roʻyxat va maqolaning oʻzi. */
export function newsWarmPaths(slug: string): readonly string[] {
  return [pathFor("uz", "home"), pathFor("uz", "news"), pathFor("uz", "newsItem", slug)];
}
