import "server-only";
import { cache } from "react";

import { bundledSnapshot } from "@/content/bundled";
import type { ContentSnapshot } from "@/content/snapshot";

/**
 * Sahifalar uchun yagona kontent manbai: bitta soʻrov (yoki yigʻishdagi bitta sahifa) davomida nusxa
 * bir marta olinadi. Hozircha faqat repodagi nusxa; tashqi manba keyin shu funksiya ichida ulanadi,
 * sahifa va komponentlar oʻzgarmaydi.
 */
export const loadSnapshot = cache(async (): Promise<ContentSnapshot> => bundledSnapshot());
