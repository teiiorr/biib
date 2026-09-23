import { expect, test } from "@playwright/test";

import { designsFromEnv, primeAppearance, settle } from "./helpers/appearance";
import { PAGE_TYPES, pagePath } from "./helpers/pages";
import { checkId, recordCheck, summarize } from "./helpers/results";

const designs = designsFromEnv();
const FRAME_BUDGET_MS = 16.7;

/* G7 (kadrlar): Chromium, CPU 4× sekinlashtirilgan, skript skroll; ≥95% kadr < 16.7 ms, uzun vazifa yoʻq. */
test.describe("G7 kadr byudjeti", () => {
  test.skip(({ browserName }) => browserName !== "chromium", "faqat Chromium (CDP)");
  for (const design of designs) {
    for (const type of PAGE_TYPES) {
      test(`${design} ${type}`, async ({ page, context }, testInfo) => {
        const cdp = await context.newCDPSession(page);
        await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
        await primeAppearance(page, { design, theme: "light" });
        await page.goto(pagePath("uz", type));
        await settle(page);
        await page.waitForTimeout(600);
        const result = await page.evaluate(async (budget) => {
          const deltas: number[] = [];
          const longTasks: number[] = [];
          const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) longTasks.push(entry.duration);
          });
          try {
            observer.observe({ type: "longtask", buffered: false });
          } catch {
            /* Firefox/WebKit longtask ni bilmaydi; Chromium da ishlaydi. */
          }
          const max = document.documentElement.scrollHeight - window.innerHeight;
          const start = performance.now();
          let last = start;
          await new Promise<void>((resolve) => {
            const step = (now: number) => {
              deltas.push(now - last);
              last = now;
              const t = Math.min(1, (now - start) / 3000);
              window.scrollTo(0, max * (1 - Math.cos(Math.PI * t)) * 0.5);
              if (t < 1) requestAnimationFrame(step);
              else resolve();
            };
            requestAnimationFrame(step);
          });
          observer.disconnect();
          const gl = (() => {
            const c = document.createElement("canvas");
            const ctx = c.getContext("webgl2");
            const info = ctx?.getExtension("WEBGL_debug_renderer_info");
            return info && ctx ? String(ctx.getParameter(info.UNMASKED_RENDERER_WEBGL)) : "yoʻq";
          })();
          const under = deltas.filter((d) => d <= budget + 0.5).length;
          return {
            frames: deltas.length,
            ratio: deltas.length ? under / deltas.length : 1,
            longTasks: longTasks.filter((d) => d > 50),
            gl,
          };
        }, FRAME_BUDGET_MS);
        const software = /swiftshader|llvmpipe|software/i.test(result.gl);
        const failures: string[] = [];
        if (result.ratio < 0.95)
          failures.push(
            `kadrlar: ${(result.ratio * 100).toFixed(1)}% < 95% (${result.frames} kadr)`,
          );
        if (result.longTasks.length)
          failures.push(
            `uzun vazifalar: ${result.longTasks.map((d) => Math.round(d)).join(", ")} ms`,
          );
        const detail = `${(result.ratio * 100).toFixed(1)}% kadr byudjetda, GPU: ${result.gl}${software ? " (dasturiy render: WebGL kadrlari oʻlchanmaydi, rAF boʻshliqlari hisobga olindi)" : ""}`;
        await recordCheck(testInfo, "G7", {
          id: checkId(testInfo, "frames", design, type),
          status: failures.length ? "fail" : "pass",
          detail: failures.length ? `${summarize(failures)} · ${detail}` : detail,
        });
        expect(failures).toEqual([]);
      });
    }
  }
});
