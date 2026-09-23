/* Mikro-tovushlar sintezi: doira, qalam, qogʻoz va ksilofon. Fayl yoʻq, hamma narsa Web Audio. */

let context: AudioContext | null = null;
let noiseBuffer: AudioBuffer | null = null;

export function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!context) {
    try {
      context = new AudioContext();
    } catch {
      return null;
    }
  }
  if (context.state === "suspended") void context.resume();
  return context;
}

/** Brauzer avtoijroni bloklaydi; harakat boʻlmagan boʻlsa umuman urinmaymiz. */
export function hasUserGesture(): boolean {
  if (typeof navigator === "undefined") return false;
  const nav = navigator as Navigator & { userActivation?: { hasBeenActive: boolean } };
  return nav.userActivation?.hasBeenActive ?? false;
}

function getNoise(ctx: AudioContext): AudioBuffer {
  if (noiseBuffer && noiseBuffer.sampleRate === ctx.sampleRate) return noiseBuffer;
  const length = ctx.sampleRate;
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i += 1) data[i] = Math.random() * 2 - 1;
  noiseBuffer = buffer;
  return buffer;
}

interface Voice {
  readonly ctx: AudioContext;
  readonly out: GainNode;
  readonly at: number;
}

function noiseSource(voice: Voice, filter: BiquadFilterNode, duration: number): void {
  const source = voice.ctx.createBufferSource();
  source.buffer = getNoise(voice.ctx);
  source.connect(filter);
  filter.connect(voice.out);
  source.start(voice.at);
  source.stop(voice.at + duration + 0.05);
}

function envelope(gain: GainNode, at: number, peak: number, decay: number): void {
  gain.gain.setValueAtTime(0.0001, at);
  gain.gain.exponentialRampToValueAtTime(peak, at + 0.006);
  gain.gain.exponentialRampToValueAtTime(0.0001, at + decay);
}

export function playDoira(voice: Voice): void {
  const { ctx, at } = voice;
  const jingle = ctx.createBiquadFilter();
  jingle.type = "bandpass";
  jingle.frequency.value = 3800;
  jingle.Q.value = 1.4;
  const jingleGain = ctx.createGain();
  envelope(jingleGain, at, 0.3, 0.16);
  jingleGain.connect(voice.out);
  noiseSource({ ...voice, out: jingleGain }, jingle, 0.16);

  const thump = ctx.createOscillator();
  thump.type = "sine";
  thump.frequency.setValueAtTime(120, at);
  thump.frequency.exponentialRampToValueAtTime(52, at + 0.16);
  const thumpGain = ctx.createGain();
  envelope(thumpGain, at, 0.55, 0.2);
  thump.connect(thumpGain);
  thumpGain.connect(voice.out);
  thump.start(at);
  thump.stop(at + 0.24);
}

export function playPencil(voice: Voice): void {
  const { ctx, at } = voice;
  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = 1900;
  filter.Q.value = 0.8;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, at);
  /* Bir tortishda qalam qogʻozga notekis tegadi: olti kichik zarb. */
  for (let i = 0; i < 6; i += 1) {
    const t = at + i * 0.04;
    gain.gain.exponentialRampToValueAtTime(0.16 + (i % 2) * 0.06, t + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.02, t + 0.038);
  }
  gain.gain.exponentialRampToValueAtTime(0.0001, at + 0.27);
  gain.connect(voice.out);
  noiseSource({ ...voice, out: gain }, filter, 0.27);
}

export function playPaper(voice: Voice): void {
  const { ctx, at } = voice;
  const sweep = ctx.createBiquadFilter();
  sweep.type = "lowpass";
  sweep.frequency.setValueAtTime(500, at);
  sweep.frequency.exponentialRampToValueAtTime(4200, at + 0.26);
  const gain = ctx.createGain();
  envelope(gain, at, 0.22, 0.34);
  gain.connect(voice.out);
  noiseSource({ ...voice, out: gain }, sweep, 0.34);

  for (const offset of [0.05, 0.13, 0.22]) {
    const crackle = ctx.createBiquadFilter();
    crackle.type = "highpass";
    crackle.frequency.value = 5000;
    const crackleGain = ctx.createGain();
    envelope(crackleGain, at + offset, 0.12, 0.02);
    crackleGain.connect(voice.out);
    noiseSource({ ...voice, at: at + offset, out: crackleGain }, crackle, 0.02);
  }
}

/* Olti boʻyoq, olti nota: pentatonika C5 D5 E5 G5 A5 C6. */
const XYLOPHONE_NOTES = [523.25, 587.33, 659.25, 783.99, 880, 1046.5] as const;

export function playXylophone(voice: Voice, note: number): void {
  const { ctx, at } = voice;
  const index = Math.min(XYLOPHONE_NOTES.length - 1, Math.max(0, Math.round(note)));
  const frequency = XYLOPHONE_NOTES[index] ?? XYLOPHONE_NOTES[0];

  const bar = ctx.createOscillator();
  bar.type = "sine";
  bar.frequency.value = frequency;
  const barGain = ctx.createGain();
  envelope(barGain, at, 0.42, 0.55);
  bar.connect(barGain);
  barGain.connect(voice.out);
  bar.start(at);
  bar.stop(at + 0.6);

  /* Yogʻoch plastina birinchi obertoni 2.76 marta baland va tez soʻnadi. */
  const partial = ctx.createOscillator();
  partial.type = "sine";
  partial.frequency.value = frequency * 2.76;
  const partialGain = ctx.createGain();
  envelope(partialGain, at, 0.1, 0.14);
  partial.connect(partialGain);
  partialGain.connect(voice.out);
  partial.start(at);
  partial.stop(at + 0.2);

  const strike = ctx.createBiquadFilter();
  strike.type = "highpass";
  strike.frequency.value = 3000;
  const strikeGain = ctx.createGain();
  envelope(strikeGain, at, 0.08, 0.012);
  strikeGain.connect(voice.out);
  noiseSource({ ...voice, out: strikeGain }, strike, 0.012);
}

export function createVoice(ctx: AudioContext): Voice {
  const out = ctx.createGain();
  out.gain.value = 0.5;
  out.connect(ctx.destination);
  return { ctx, out, at: ctx.currentTime + 0.005 };
}
