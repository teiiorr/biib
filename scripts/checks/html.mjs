/* Olingan HTML dan SEO belgilarini ajratish: DOM emas, chidamli regexlar. */
const decode = (text) =>
  text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'");

export function attr(tag, name) {
  const match = tag.match(new RegExp(`\\s${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, "i"));
  return match ? decode(match[1] ?? match[2] ?? match[3] ?? "") : null;
}

export function openingTags(html, tagName) {
  return [...html.matchAll(new RegExp(`<${tagName}(?=[\\s>/])[^>]*>`, "gi"))].map((m) => m[0]);
}

export function title(html) {
  const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return match ? decode(match[1]).replace(/\s+/g, " ").trim() : null;
}

export function metaContent(html, key) {
  for (const tag of openingTags(html, "meta")) {
    if (attr(tag, "name") === key || attr(tag, "property") === key) return attr(tag, "content");
  }
  return null;
}

export function links(html) {
  return openingTags(html, "link").map((tag) => ({
    rel: attr(tag, "rel"),
    href: attr(tag, "href"),
    hreflang: attr(tag, "hreflang"),
  }));
}

export function htmlLang(html) {
  const tag = openingTags(html, "html")[0];
  return tag ? attr(tag, "lang") : null;
}

export function countTag(html, tagName) {
  return openingTags(html, tagName).length;
}

export function isNoindex(html) {
  return /noindex/i.test(metaContent(html, "robots") ?? "");
}

export function jsonLd(html) {
  const out = [];
  for (const m of html.matchAll(
    /<script[^>]*type\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
  )) {
    try {
      const data = JSON.parse(m[1]);
      const items = Array.isArray(data) ? data : data["@graph"] ? data["@graph"] : [data];
      out.push(...items.map((item) => ({ data: item })));
    } catch (error) {
      out.push({ error: error instanceof Error ? error.message : String(error) });
    }
  }
  return out;
}

export function pathOf(url) {
  try {
    const u = new URL(url);
    return u.pathname.replace(/\/$/, "") || "/";
  } catch {
    return url;
  }
}

/** Sahifadagi absolyut manzil ishlab chiqarish domenida boʻladi; lokal serverga qayta yoʻnaltiriladi. */
export function toLocal(url, baseUrl) {
  try {
    const u = new URL(url);
    return baseUrl + u.pathname + u.search;
  } catch {
    return url.startsWith("/") ? baseUrl + url : url;
  }
}

export async function fetchText(url, options = {}) {
  const response = await fetch(url, { redirect: "manual", ...options });
  const text = await response.text();
  return {
    status: response.status,
    headers: response.headers,
    text,
    location: response.headers.get("location"),
  };
}

/* Chegaralangan parallel bajarish: 70 sahifa uchun serverni bosib qoʻymaslik. */
export async function mapLimit(items, limit, fn) {
  const results = new Array(items.length);
  let next = 0;
  const worker = async () => {
    while (next < items.length) {
      const index = next++;
      results[index] = await fn(items[index], index);
    }
  };
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}
