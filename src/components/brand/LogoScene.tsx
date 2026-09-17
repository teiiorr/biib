"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";

/**
 * Qahramondagi jonli 3D belgi. Kutubxonasiz sof WebGL: bitta tekstурali
 * tekislik, sıçkon ortidan egiliş, şeyder içida yuruvçi spekulyar tölqin.
 *
 * Nega üç.js emas: bitta effekt uçun kutubxona olib kelinmaydi (§9),
 * bitta kvadratga şeyder yozişning özi yetarli.
 *
 * Nega AI dan 3D meş qilinmadi: logotip mijozniki, uni qayta qurgan
 * model şaklni buzadi. Tekstura — public/brand/mark.png ning aynan özi,
 * brend pikselgaça saqlanadi.
 *
 * Ehtiyot çoralari: WebGL yöq / prefers-reduced-motion / deviceMemory <= 4
 * bölsa oddiy rasm qoladi; ekrandan çiqsa yoki tab yaşirinsa sikl töxtaydi.
 */

const VERT = `
attribute vec2 a_pos;
varying vec2 v_uv;
// mediump — fragment bilan bir xil, aks holda linker yiqiladi.
uniform mediump vec2 u_tilt;
uniform float u_float;
void main() {
  v_uv = a_pos * 0.5 + 0.5;
  vec3 p = vec3(a_pos, 0.0);
  float cx = cos(u_tilt.x); float sx = sin(u_tilt.x);
  float cy = cos(u_tilt.y); float sy = sin(u_tilt.y);
  p = vec3(p.x, p.y * cx - p.z * sx, p.y * sx + p.z * cx);
  p = vec3(p.x * cy + p.z * sy, p.y, -p.x * sy + p.z * cy);
  p.y += u_float;
  float persp = 1.0 / (1.0 + p.z * 0.38);
  gl_Position = vec4(p.xy * persp * 0.92, 0.0, 1.0);
}`;

const FRAG = `
precision mediump float;
varying vec2 v_uv;
uniform sampler2D u_tex;
uniform float u_time;
uniform vec2 u_tilt;
void main() {
  vec4 tex = texture2D(u_tex, v_uv);
  // Egilişga ergaşadigan diagonal yorugʻlik — şişadagi aks tuygʻusi.
  float band = v_uv.x + v_uv.y - 1.0 + u_tilt.y * 1.6 - u_tilt.x * 1.6;
  float spec = exp(-band * band * 16.0) * 0.30;
  // Sekin öz-özidan ötadigan yaltiraş, sıçkonsiz ham tirik tursin.
  float sweep = v_uv.x + v_uv.y - fract(u_time * 0.05) * 3.2 + 0.9;
  spec += exp(-sweep * sweep * 26.0) * 0.20;
  vec3 warm = vec3(1.0, 0.93, 0.72);
  gl_FragColor = vec4(tex.rgb + warm * spec * tex.a, tex.a);
}`;

function compile(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return null;
  return shader;
}

export function LogoScene({ label, className }: { label: string; className?: string }) {
  const host = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = host.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const memory = (navigator as { deviceMemory?: number }).deviceMemory;
    if (memory !== undefined && memory <= 4) return;

    const gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: true,
      powerPreference: "low-power",
    });
    if (!gl) return;

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    const quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(program, "a_pos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uTilt = gl.getUniformLocation(program, "u_tilt");
    const uFloat = gl.getUniformLocation(program, "u_float");
    const uTime = gl.getUniformLocation(program, "u_time");

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0, 0, 0, 0);

    // Tekstura — belgining aynan özi.
    const texture = gl.createTexture();
    const image = new window.Image();
    let textureReady = false;
    image.onload = () => {
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      textureReady = true;
    };
    image.src = "/brand/mark.png";

    // Ölçam: konteynerga ergaşadi, DPR 2 bilan çegaralanadi.
    function resize() {
      if (!container || !canvas || !gl) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const size = container.clientWidth;
      canvas.width = Math.round(size * dpr);
      canvas.height = Math.round(size * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    // Egiliş nişoni: desktopda sıçkon, qöpol ekranda öz-özidan tebraniş.
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    let targetX = 0;
    let targetY = 0;
    let tiltX = 0;
    let tiltY = 0;
    let shown = false;

    function onPointer(event: PointerEvent) {
      if (event.pointerType !== "mouse" || !container) return;
      const box = container.getBoundingClientRect();
      const nx = ((event.clientX - box.left) / box.width) * 2 - 1;
      const ny = ((event.clientY - box.top) / box.height) * 2 - 1;
      targetY = Math.max(-1.6, Math.min(1.6, nx)) * 0.30;
      targetX = Math.max(-1.6, Math.min(1.6, ny)) * -0.24;
    }
    if (!coarse) window.addEventListener("pointermove", onPointer, { passive: true });

    let frame = 0;
    let running = false;
    const start = performance.now();

    function draw(now: number) {
      if (!gl || !canvas) return;
      const t = (now - start) / 1000;

      if (coarse) {
        targetY = Math.sin(t * 0.5) * 0.22;
        targetX = Math.cos(t * 0.34) * 0.14;
      }
      tiltX += (targetX - tiltX) * 0.06;
      tiltY += (targetY - tiltY) * 0.06;

      gl.clear(gl.COLOR_BUFFER_BIT);
      if (textureReady) {
        gl.uniform2f(uTilt, tiltX, tiltY);
        gl.uniform1f(uFloat, Math.sin(t * 0.7) * 0.03);
        gl.uniform1f(uTime, t);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        // Birinçi kadr çizilgaç kanva körinadi — rasm oldin turadi, çaqnaş yöq.
        if (!shown && canvas) {
          canvas.style.opacity = "1";
          shown = true;
        }
      }
      frame = requestAnimationFrame(draw);
    }

    function play() {
      if (!running) {
        running = true;
        frame = requestAnimationFrame(draw);
      }
    }
    function stop() {
      running = false;
      cancelAnimationFrame(frame);
    }

    const io = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) play();
      else stop();
    });
    io.observe(container);

    function onVisibility() {
      if (document.hidden) stop();
      else play();
    }
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      if (!coarse) window.removeEventListener("pointermove", onPointer);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  return (
    <div
      ref={host}
      role="img"
      aria-label={label}
      className={cn("relative aspect-square w-full select-none", className)}
    >
      {/* SSR va barça ehtiyot rejimlar uçun asos — oddiy rasm. */}
      <Image
        src="/brand/mark.png"
        alt=""
        width={640}
        height={640}
        priority
        sizes="(max-width: 1024px) 240px, 360px"
        className="h-full w-full"
      />
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="absolute inset-0 h-full w-full opacity-0 transition-opacity duration-500"
      />
    </div>
  );
}
