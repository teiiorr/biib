/*
 * Bosish ovozlari: egasining doira yozuvidan kesilgan eng yaxshi oltita zarba (toʻrt «dum», ikki «tak»)
 * bitta faylda (public/sounds/doira-taps.mp3, 24 KB, scripts/doira-tap.mts): 0.7 s lik kataklar, har biri
 * 50 ms jimlikdan boshlanadi. Har bosishda boshqa zarba — aralashtirilgan navbat: oltovi tugamaguncha
 * takrorlanmaydi, navbat chegarasida ham ketma-ket bir xil zarba yoʻq. Fayl boʻsh vaqtda oldindan olinadi,
 * birinchi bosishda dekodlanadi.
 */

type AudioContextCtor = typeof AudioContext;

interface Engine {
  readonly ctx: AudioContext;
  /** Zarba shu yerga tushadi; undan keyin cheklagich. */
  readonly out: GainNode;
  silentPlayed: boolean;
}

const SAMPLE_URL = "/sounds/doira-taps.mp3";
/* scripts/doira-tap.mts bilan bir xil: katak uzunligi, zarbalar soni. Katak boshidan 30 ms keyin
   oʻynaladi — 50 ms jimlik MP3 dekoder siljishini (±25 ms) koʻtaradi, zarba boshi kesilmaydi. */
const SLOT = 0.7;
const TAPS = 6;
const OFFSET = 0.03;
const PLAY = 0.62;
const MIN_GAP_MS = 60;
const MAX_VOICES = 6;
/* Dekodlash kechiksa zarba kech kelmaydi: bosishdan 350 ms oʻtgan boʻlsa jim qoladi. */
const LATE_MS = 350;

let engine: Engine | null = null;
let bytes: Promise<ArrayBuffer | null> | null = null;
let buffer: Promise<AudioBuffer | null> | null = null;
let lastAt = -Infinity;
let voices = 0;
let bag: number[] = [];
let lastTap = -1;

/* Aralashtirilgan navbat (Fisher–Yates); yangi navbat oldingi oxirgi zarba bilan boshlanmaydi. */
function nextTap(): number {
  if (bag.length === 0) {
    bag = Array.from({ length: TAPS }, (_, i) => i);
    for (let i = bag.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [bag[i], bag[j]] = [bag[j] ?? i, bag[i] ?? j];
    }
    if (bag[bag.length - 1] === lastTap) bag.reverse();
  }
  lastTap = bag.pop() ?? 0;
  return lastTap;
}

function ctor(): AudioContextCtor | undefined {
  if (typeof window === "undefined") return undefined;
  const w = window as Window & { webkitAudioContext?: AudioContextCtor };
  return window.AudioContext ?? w.webkitAudioContext;
}

function createEngine(): Engine | null {
  const Ctor = ctor();
  if (!Ctor) return null;
  let ctx: AudioContext;
  try {
    ctx = new Ctor({ latencyHint: "interactive" });
  } catch {
    try {
      ctx = new Ctor();
    } catch {
      return null;
    }
  }
  /* Ketma-ket tez bosishlarda ham signal kesilmasligi uchun cheklagich. */
  const limiter = ctx.createDynamicsCompressor();
  limiter.threshold.value = -10;
  limiter.knee.value = 4;
  limiter.ratio.value = 12;
  limiter.attack.value = 0.002;
  limiter.release.value = 0.15;
  limiter.connect(ctx.destination);
  const out = ctx.createGain();
  out.gain.value = 0.8;
  out.connect(limiter);
  return { ctx, out, silentPlayed: false };
}

function ensureEngine(): Engine | null {
  if (engine && engine.ctx.state === "closed") {
    /* Yopilgan kontekstda onended kelmaydi: hisoblagich va bufer yangi kontekst bilan noldan. */
    engine = null;
    buffer = null;
    voices = 0;
  }
  engine ??= createEngine();
  return engine;
}

/* iOS "interrupted" va Chrome "suspended" holatlari shu yerda, harakat ichida tiklanadi. */
function wake(): Engine | null {
  const e = ensureEngine();
  if (!e) return null;
  const state = e.ctx.state as string;
  /* Eski webkitAudioContext resume() dan Promise qaytarmaydi. */
  if (state !== "running") Promise.resolve(e.ctx.resume()).catch(() => undefined);
  if (!e.silentPlayed) {
    /* Eski iOS kontekstni faqat harakat ichida chalingan bufer bilan ochadi. */
    const silent = e.ctx.createBufferSource();
    silent.buffer = e.ctx.createBuffer(1, 1, 22050);
    silent.connect(e.ctx.destination);
    silent.start(0);
    e.silentPlayed = true;
  }
  return e;
}

/** Fayl baytlari (7.5 KB) oldindan: birinchi bosishda tarmoq kutilmaydi. */
export function preloadTap(): void {
  bytes ??= fetch(SAMPLE_URL)
    .then((response) => (response.ok ? response.arrayBuffer() : null))
    .catch(() => null);
}

/* Eski Safari decodeAudioData ni faqat callback bilan beradi, yangilari Promise qaytaradi. */
function decode(ctx: AudioContext, data: ArrayBuffer): Promise<AudioBuffer> {
  return new Promise((resolve, reject) => {
    const result = ctx.decodeAudioData(data, resolve, reject) as Promise<AudioBuffer> | undefined;
    if (result && typeof result.then === "function") result.then(resolve, reject);
  });
}

function sample(e: Engine): Promise<AudioBuffer | null> {
  preloadTap();
  buffer ??= (bytes ?? Promise.resolve(null)).then((data) =>
    data ? decode(e.ctx, data.slice(0)).catch(() => null) : null,
  );
  return buffer;
}

/** Bosish hodisasi ichida sinxron chaqiriladi: Safari va Chrome ovozni faqat foydalanuvchi harakati ichida ochadi. */
export function primeAudio(): void {
  const e = wake();
  if (e) void sample(e);
}

function strike(e: Engine, data: AudioBuffer): void {
  const source = e.ctx.createBufferSource();
  source.buffer = data;
  /* Har zarbada ±1.5 % tabiiy farq: bir xil zarba ham ikkinchi marta aynan takrorlanmaydi. */
  const rate = 1 + (Math.random() - 0.5) * 0.03;
  source.playbackRate.value = rate;
  source.connect(e.out);
  voices += 1;
  source.onended = () => {
    voices -= 1;
    source.disconnect();
  };
  source.start(0, nextTap() * SLOT + OFFSET, PLAY / rate);
}

/** Bitta doira zarbasi, har safar boshqasi. */
export function playTap(): void {
  const now = performance.now();
  if (now - lastAt < MIN_GAP_MS || voices >= MAX_VOICES) return;
  const e = wake();
  if (!e) return;
  lastAt = now;
  void Promise.all([sample(e), Promise.resolve(e.ctx.resume()).catch(() => undefined)]).then(
    ([data]) => {
      if (!data || performance.now() - now > LATE_MS) return;
      if ((e.ctx.state as string) !== "running") return;
      strike(e, data);
    },
  );
}
