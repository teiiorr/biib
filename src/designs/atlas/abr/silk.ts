import { Mesh, Program, Renderer, Triangle } from "ogl";

import { readSilkColors } from "./colors";
import { ABR_FRAGMENT, ABR_VERTEX } from "./shaders";

export interface SilkHandle {
  setVisible(visible: boolean): void;
  refreshColors(): void;
  destroy(): void;
}

const MOBILE_MAX = 1024;

/** Kanvasni ishga tushiradi; WebGL2 boʻlmasa null qaytaradi. */
export function startSilk(canvas: HTMLCanvasElement, onFirstFrame: () => void): SilkHandle | null {
  const dprCap = window.innerWidth <= MOBILE_MAX ? 1.5 : 2;
  const renderer = new Renderer({
    canvas,
    dpr: Math.min(window.devicePixelRatio || 1, dprCap),
    alpha: false,
    antialias: false,
    powerPreference: "low-power",
    webgl: 2,
  });
  const gl = renderer.gl;
  if (!(gl instanceof WebGL2RenderingContext)) return null;

  const colors = readSilkColors();
  const program = new Program(gl, {
    vertex: ABR_VERTEX,
    fragment: ABR_FRAGMENT,
    uniforms: {
      uTime: { value: 0 },
      uRes: { value: [1, 1] },
      uPointer: { value: [0.5, 0.5, 0] },
      uBg: { value: [...colors.bg] },
      uC1: { value: [...colors.dyes[0]] },
      uC2: { value: [...colors.dyes[1]] },
      uC3: { value: [...colors.dyes[2]] },
      uC4: { value: [...colors.dyes[3]] },
      uNight: { value: colors.night ? 1 : 0 },
      uSeed: { value: 3.7 },
    },
  });
  const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });

  let visible = true;
  let frame = 0;
  let firstFrame = false;
  let start = performance.now();
  let pointer = { x: 0.5, y: 0.5, strength: 0 };

  const resize = (): void => {
    const rect = canvas.getBoundingClientRect();
    renderer.setSize(Math.max(1, rect.width), Math.max(1, rect.height));
    program.uniforms.uRes.value = [gl.drawingBufferWidth, gl.drawingBufferHeight];
  };
  const observer = new ResizeObserver(resize);
  observer.observe(canvas);
  resize();

  const onPointer = (event: PointerEvent): void => {
    const rect = canvas.getBoundingClientRect();
    pointer = {
      x: (event.clientX - rect.left) / rect.width,
      y: 1 - (event.clientY - rect.top) / rect.height,
      strength: 1,
    };
  };
  canvas.parentElement?.addEventListener("pointermove", onPointer, { passive: true });

  const loop = (now: number): void => {
    frame = 0;
    if (!visible) return;
    program.uniforms.uTime.value = (now - start) / 1000;
    pointer.strength *= 0.96;
    program.uniforms.uPointer.value = [pointer.x, pointer.y, pointer.strength];
    renderer.render({ scene: mesh });
    if (!firstFrame) {
      firstFrame = true;
      onFirstFrame();
    }
    frame = requestAnimationFrame(loop);
  };
  frame = requestAnimationFrame(loop);

  return {
    setVisible(next) {
      if (next === visible) return;
      visible = next;
      if (visible && frame === 0) {
        start = performance.now() - program.uniforms.uTime.value * 1000;
        frame = requestAnimationFrame(loop);
      }
    },
    refreshColors() {
      const next = readSilkColors();
      program.uniforms.uBg.value = [...next.bg];
      program.uniforms.uC1.value = [...next.dyes[0]];
      program.uniforms.uC2.value = [...next.dyes[1]];
      program.uniforms.uC3.value = [...next.dyes[2]];
      program.uniforms.uC4.value = [...next.dyes[3]];
      program.uniforms.uNight.value = next.night ? 1 : 0;
    },
    destroy() {
      visible = false;
      if (frame) cancelAnimationFrame(frame);
      observer.disconnect();
      canvas.parentElement?.removeEventListener("pointermove", onPointer);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    },
  };
}
