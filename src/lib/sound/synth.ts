/* Bosish ovozi: shishasimon qoʻngʻiroq (kalimba) tembri, butunlay Web Audio. Fayl yuklanmaydi, oflayn ishlaydi. */

type AudioContextCtor = typeof AudioContext;

interface Engine {
  readonly ctx: AudioContext;
  /** Quruq signal shu yerga tushadi; undan keyin cheklagich. */
  readonly dry: GainNode;
  /** Aks-sado yuborish; konvolver birinchi notada quriladi. */
  readonly send: GainNode;
  reverbReady: boolean;
  silentPlayed: boolean;
}

/* D-major pentatonika, 587–1175 Hz: ketma-ket bosishlar tinch kuy hosil qiladi. */
const SCALE = [587.33, 659.25, 739.99, 880, 987.77, 1174.66] as const;
/* Qoʻngʻiroq tembri: [nisbat, balandlik, soʻnish ulushi]. Nisbatlar notekis, shu sabab shishaday jaranglaydi. */
const PARTIALS = [
  [1, 0.085, 1],
  [1.004, 0.028, 0.9],
  [2.76, 0.024, 0.34],
  [5.4, 0.008, 0.16],
] as const;
const DECAY = 1.35;
const MIN_GAP_MS = 60;
const MAX_VOICES = 6;

let engine: Engine | null = null;
let noteIndex = 2;
let lastAt = -Infinity;
let voices = 0;
let pending = false;

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
  limiter.threshold.value = -14;
  limiter.knee.value = 4;
  limiter.ratio.value = 16;
  limiter.attack.value = 0.002;
  limiter.release.value = 0.2;
  limiter.connect(ctx.destination);
  const dry = ctx.createGain();
  dry.connect(limiter);
  const send = ctx.createGain();
  send.gain.value = 0.34;
  return { ctx, dry, send, reverbReady: false, silentPlayed: false };
}

/* Qisqa sintetik zal: pasaytirilgan shovqin eksponentsial soʻnadi; yuqori chastotalar tezroq yoʻqoladi. */
function buildReverb(e: Engine): void {
  const { ctx } = e;
  const rate = ctx.sampleRate;
  const length = Math.floor(rate * 1.5);
  const predelay = Math.floor(rate * 0.012);
  const impulse = ctx.createBuffer(2, length, rate);
  for (let channel = 0; channel < 2; channel += 1) {
    const data = impulse.getChannelData(channel);
    let smooth = 0;
    for (let i = predelay; i < length; i += 1) {
      const progress = (i - predelay) / (length - predelay);
      smooth += (0.22 + 0.5 * (1 - progress)) * (Math.random() * 2 - 1 - smooth);
      data[i] = smooth * Math.pow(1 - progress, 3);
    }
  }
  const convolver = ctx.createConvolver();
  convolver.buffer = impulse;
  e.send.connect(convolver);
  convolver.connect(e.dry);
  e.reverbReady = true;
}

function ensureEngine(): Engine | null {
  if (engine && engine.ctx.state === "closed") {
    /* Yopilgan kontekstda onended kelmaydi: hisoblagich yangi kontekst bilan noldan boshlanadi. */
    engine = null;
    voices = 0;
    pending = false;
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

/** Bosish hodisasi ichida sinxron chaqiriladi: Safari va Chrome ovozni faqat foydalanuvchi harakati ichida ochadi. */
export function primeAudio(): void {
  wake();
}

function nextNote(): number {
  /* Yonidagi 1–2 pogʻonaga qadam: sakrash yoʻq, takror yoʻq. */
  const step = (Math.random() < 0.5 ? 1 : 2) * (Math.random() < 0.5 ? -1 : 1);
  let next = noteIndex + step;
  if (next < 0 || next >= SCALE.length) next = noteIndex - step;
  noteIndex = next;
  return SCALE[next] ?? SCALE[2];
}

function pluck(e: Engine, bright: boolean): void {
  const { ctx } = e;
  if (!e.reverbReady) buildReverb(e);
  const at = ctx.currentTime + 0.005;
  const frequency = nextNote();
  const tone = ctx.createBiquadFilter();
  tone.type = "lowpass";
  tone.frequency.value = bright ? 4200 : 2800;
  tone.Q.value = 0.4;
  tone.connect(e.dry);
  tone.connect(e.send);

  const nodes: AudioNode[] = [tone];
  let last: OscillatorNode | null = null;
  for (const [ratio, level, decayShare] of PARTIALS) {
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = frequency * ratio;
    const gain = ctx.createGain();
    const end = at + DECAY * decayShare;
    gain.gain.setValueAtTime(0.0001, at);
    gain.gain.exponentialRampToValueAtTime(level, at + 0.006);
    gain.gain.exponentialRampToValueAtTime(0.0001, end);
    osc.connect(gain);
    gain.connect(tone);
    osc.start(at);
    osc.stop(end + 0.05);
    nodes.push(osc, gain);
    if (decayShare === 1) last = osc;
  }
  voices += 1;
  if (last) {
    last.onended = () => {
      voices -= 1;
      for (const node of nodes) node.disconnect();
    };
  }
}

/** Bitta yumshoq nota; `bright` havola va tugmalar uchun biroz tiniqroq. */
export function playTap(bright: boolean): void {
  const now = performance.now();
  if (now - lastAt < MIN_GAP_MS || voices >= MAX_VOICES) return;
  const e = wake();
  if (!e) return;
  lastAt = now;
  if ((e.ctx.state as string) === "running") {
    pluck(e, bright);
    return;
  }
  /* Kontekst hali ochilmagan: notalar yigʻilib qolib, keyin birdan chalinmasin. */
  if (pending) return;
  pending = true;
  Promise.resolve(e.ctx.resume()).then(
    () => {
      pending = false;
      pluck(e, bright);
    },
    () => {
      pending = false;
    },
  );
}
