/* Mavzu almashinuvidagi doira ovozi sintezi (11.12). Fayl yoʻq, hamma narsa Web Audio. */

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

export function createVoice(ctx: AudioContext): Voice {
  const out = ctx.createGain();
  out.gain.value = 0.5;
  out.connect(ctx.destination);
  return { ctx, out, at: ctx.currentTime + 0.005 };
}
