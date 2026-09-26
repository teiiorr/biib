/* scripts/images.mjs yaratgan: oldindan tayyorlangan rasmlar. Qoʻlda tahrir qilinmaydi. */
export interface PreparedImage {
  readonly width: number;
  readonly height: number;
  /** /img/<nom>: fayllar <base>-<kenglik>.avif va .webp */
  readonly base: string;
  readonly widths: readonly number[];
  readonly blur?: string;
  /** Oʻrtacha yorugʻlik baland: oyna ustida yorugʻ ohang (data-tone="light"). */
  readonly bright?: true;
}

export const PREPARED_IMAGES: Readonly<Record<string, PreparedImage>> = {
  "/brand/logo-hero.png": {
    width: 408,
    height: 408,
    base: "/img/logo-hero",
    widths: [40, 80, 120, 240, 408],
  },
  "/brand/upop-logo.png": {
    width: 900,
    height: 703,
    base: "/img/upop-logo",
    widths: [240, 360, 480, 720, 900],
  },
  "/brand/news-taqdimot-01.jpg": {
    width: 800,
    height: 533,
    base: "/img/news-taqdimot-01",
    widths: [256, 384, 640, 800],
    blur: "data:image/webp;base64,UklGRkwAAABXRUJQVlA4IEAAAAAQAgCdASoQAAsAA4BaJbACdAD0Z0a65jzAAP7qMIt7A/5Gv69r1Y0L/W6cQ2zeBEjBJNi/Sq0ooqY8DIbenQAA",
  },
  "/brand/news-taqdimot-02.jpg": {
    width: 800,
    height: 533,
    base: "/img/news-taqdimot-02",
    widths: [400, 800],
    blur: "data:image/webp;base64,UklGRk4AAABXRUJQVlA4IEIAAAAQAgCdASoQAAsAA4BaJYwC7ADw1ZcbhS4AAP6tlsTBjb806Qol1yJHyweO0aQuVEbrywlrPPjdtW7hamr0DmlAAAA=",
  },
  "/brand/news-taqdimot-03.jpg": {
    width: 800,
    height: 533,
    base: "/img/news-taqdimot-03",
    widths: [400, 800],
    blur: "data:image/webp;base64,UklGRkgAAABXRUJQVlA4IDwAAACwAQCdASoQAAsAA4BaJZwAAXTt0zAAAP7s+wIxY7qp7ZCs3VMu8jFSXKJg6m0eXaarhKIe/4zIJWAAAAA=",
  },
  "/brand/news-taqdimot-04.jpg": {
    width: 800,
    height: 533,
    base: "/img/news-taqdimot-04",
    widths: [400, 800],
    blur: "data:image/webp;base64,UklGRlQAAABXRUJQVlA4IEgAAACwAQCdASoQAAsAA4BaJQBOgBS7CcQAAP7BRpVAXYrg/vgk4rZfWvSBHDyBQ4QNmG3GMd4rT4vtOF/Rx2MguiS0Y6BljZgAAAA=",
  },
  "/brand/news-taqdimot-05.jpg": {
    width: 800,
    height: 533,
    base: "/img/news-taqdimot-05",
    widths: [400, 800],
    blur: "data:image/webp;base64,UklGRkAAAABXRUJQVlA4IDQAAADQAQCdASoQAAsAA4BaJYgC7ACdngvCYACdtOND6M+VDcn8xGPLm4xjFxCjRaj3oNExULgA",
  },
  "/brand/news-taqdimot-06.jpg": {
    width: 800,
    height: 533,
    base: "/img/news-taqdimot-06",
    widths: [400, 800],
    blur: "data:image/webp;base64,UklGRkwAAABXRUJQVlA4IEAAAADwAQCdASoQAAsAA4BaJZACdAENW1JGsAAA/oPMwYQ6EM5w2/jUhn5Lqr48qD1t9eti2iv234Qnz3UOAa2BTwgA",
  },
  "/brand/news-taqdimot-07.jpg": {
    width: 800,
    height: 533,
    base: "/img/news-taqdimot-07",
    widths: [400, 800],
    blur: "data:image/webp;base64,UklGRk4AAABXRUJQVlA4IEIAAADwAQCdASoQAAsAA4BaJQBdgBRxRrLl9AAA2+UD/W5bjQLxp3JzCyxlz6OLbYk0h9HPXXHNY8PSDQ2AWA+0/l19AAA=",
  },
  "/brand/news-taqdimot-08.jpg": {
    width: 800,
    height: 533,
    base: "/img/news-taqdimot-08",
    widths: [400, 800],
    blur: "data:image/webp;base64,UklGRlYAAABXRUJQVlA4IEoAAAAQAgCdASoQAAsAA4BaJZACsADRkUuiKQUAAP7tJakfpcroTBi/mRztv8jq7LZc28OP0r+pTacFJpwW21Ejp403QpTZDBQwYxIAAA==",
  },
  "/brand/news-taqdimot-09.jpg": {
    width: 800,
    height: 533,
    base: "/img/news-taqdimot-09",
    widths: [400, 800],
    blur: "data:image/webp;base64,UklGRlAAAABXRUJQVlA4IEQAAACQAQCdASoQAAsAA4BaJQBOgA6tfoAA/uk6EHmjjGsZic8BmssEnHFLV2bCqlq+/7LHs5pGitX71t5JyYN2WSwCqSAAAA==",
  },
  "/brand/news-taqdimot-10.jpg": {
    width: 800,
    height: 533,
    base: "/img/news-taqdimot-10",
    widths: [400, 800],
    blur: "data:image/webp;base64,UklGRkYAAABXRUJQVlA4IDoAAADQAQCdASoQAAsAA4BaJYwAAj1my6Zg8AD+jA93LoGyIngWo6jE6g4NkNqoNJFdm1Ru2SiO/ypcAAAA",
  },
  "/brand/news-upop-stage.jpg": {
    width: 1344,
    height: 752,
    base: "/img/news-upop-stage",
    widths: [256, 384, 640, 960, 1344],
    blur: "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAADwAQCdASoQAAkAA4BaJYwCdAD0ia5kv/AA/veCbPUFZXLdV7bWtA4MJmhtj6AA",
  },
  "/brand/news-korgazma.jpg": {
    width: 1024,
    height: 688,
    base: "/img/news-korgazma",
    widths: [256, 384, 640, 1024],
    blur: "data:image/webp;base64,UklGRkQAAABXRUJQVlA4IDgAAADQAQCdASoQAAsAA4BaJQBOgCHYndorwAD+5Tt2GnNu/MAE3nQO1BIB33w1bylH69dTZFzIjIAAAA==",
  },
  "/brand/news-multfilm.jpg": {
    width: 1024,
    height: 688,
    base: "/img/news-multfilm",
    widths: [256, 384, 640, 1024],
    blur: "data:image/webp;base64,UklGRlAAAABXRUJQVlA4IEQAAAAQAgCdASoQAAsAA4BaJZACdAEO/yEiLy1AAP7xnK8q9LaqHiiwOQNb9/W2mWpANpsNasl9EcK2rlEufBbGp2+qmsAAAA==",
  },
  "/brand/news-seminar.jpg": {
    width: 1024,
    height: 688,
    base: "/img/news-seminar",
    widths: [256, 384, 640, 1024],
    blur: "data:image/webp;base64,UklGRkYAAABXRUJQVlA4IDoAAADwAQCdASoQAAsAA4BaJZgCdAELLdLK1gAA+U4J6uczy4v6Kx1Engfop5EyyUXbVXoMphP3nWxqVwgA",
  },
  "/brand/news-teatr.jpg": {
    width: 1024,
    height: 688,
    base: "/img/news-teatr",
    widths: [256, 384, 640, 1024],
    blur: "data:image/webp;base64,UklGRkAAAABXRUJQVlA4IDQAAACwAQCdASoQAAsAA4BaJYwAAlxEt0L4AP74Vk+rDo9CZm/iUo7vGsWvgMFAFG4TvGwigAAA",
  },
  "/brand/leader-chair.jpg": {
    width: 1200,
    height: 1500,
    base: "/img/leader-chair",
    widths: [320, 480, 640, 960],
    blur: "data:image/webp;base64,UklGRoYAAABXRUJQVlA4IHoAAACwBACdASoQABQAPu1iqU2ppaQiMAgBMB2JbACdL144IkChMAK5TTBdeA2VtHXYAP4VFfrO9Iq/OMuFxM2CY7LAGN1Kd+thzL27BQvBBGuTS54iQ+RPROX/Y/Et6+uh8PIQ9wJyT9N7EJVIcyl0iv5gqY1HwJVCkIAAAA==",
  },
  "/brand/leader-director.jpg": {
    width: 1200,
    height: 1800,
    base: "/img/leader-director",
    widths: [320, 480, 640, 960],
    blur: "data:image/webp;base64,UklGRmoAAABXRUJQVlA4IF4AAADwAwCdASoQABgAPu1iqU2ppaQiMAgBMB2JZwDImCHfToMg/WtZd3YAAP7tluno/DIMYr4IkP1yg72F/GzLVa0S2OfcWZc5StJ3SJenrqk18y9d0SVyz/iWyPF+AAAA",
    bright: true,
  },
  "/brand/partner-uzbekgidroenergo.png": {
    width: 1000,
    height: 550,
    base: "/img/partner-uzbekgidroenergo",
    widths: [240, 480, 720],
  },
};
