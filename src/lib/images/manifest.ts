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
  "/brand/mark.png": {
    width: 640,
    height: 640,
    base: "/img/mark",
    widths: [40, 80, 120, 192],
  },
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
  "/brand/upop-scene.jpg": {
    width: 1920,
    height: 1085,
    base: "/img/upop-scene",
    widths: [640, 960, 1280, 1920],
    blur: "data:image/webp;base64,UklGRkQAAABXRUJQVlA4IDgAAADwAQCdASoQAAkAA4BaJQBOgCHdFKKaswAA/vGEDZFaP4WkldApTH7fyJdJfsJtS1A+YNp6swAAAA==",
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
