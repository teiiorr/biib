"use client";

import { useEffect, useRef, useState } from "react";

import { getDictionary } from "@/i18n/dictionaries";
import { playSound } from "@/lib/sound";

import type { ArtProps } from "../registry";

const PAINTS = ["--art-2", "--art-6", "--art-3", "--art-1", "--art-5", "--art-4"] as const;

/**
 * Chizish 404: barmoq yoki sichqoncha bilan pastel chizigʻi, tozalash, PNG saqlash.
 * Hech narsa yuklanmaydi va yigʻilmaydi (bolalar uchun sukut boʻyicha maxfiylik).
 */
export default function DrawCanvas({ locale, className }: ArtProps) {
  const dict = getDictionary(locale).errors.canvas;
  const dictColors = getDictionary(locale).home.coloring.paints;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [paint, setPaint] = useState(0);
  const drawing = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = (): void => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const snapshot = canvas.width ? canvas.toDataURL() : null;
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.scale(dpr, dpr);
      if (snapshot) {
        const img = new Image();
        img.onload = () => ctx.drawImage(img, 0, 0, rect.width, rect.height);
        img.src = snapshot;
      }
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, []);

  const color = (): string =>
    getComputedStyle(document.documentElement)
      .getPropertyValue(PAINTS[paint] ?? "--art-2")
      .trim();

  const point = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  };

  const stroke = (event: React.PointerEvent<HTMLCanvasElement>): void => {
    if (!drawing.current) return;
    const ctx = event.currentTarget.getContext("2d");
    const p = point(event);
    if (!ctx || !last.current) {
      last.current = p;
      return;
    }
    ctx.strokeStyle = color();
    ctx.lineWidth = 6;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.globalAlpha = 0.85;
    ctx.beginPath();
    ctx.moveTo(last.current.x, last.current.y);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    last.current = p;
  };

  const clear = (): void => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const save = (): void => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "rasm.png";
      a.click();
      URL.revokeObjectURL(url);
    }, "image/png");
  };

  return (
    <div className={className ? `draw-canvas ${className}` : "draw-canvas"}>
      <p className="t-note draw-canvas-title">{dict.title}</p>
      <div className="draw-palette" role="radiogroup" aria-label={dict.color}>
        {PAINTS.map((token, i) => (
          <button
            key={token}
            type="button"
            role="radio"
            aria-checked={paint === i}
            aria-label={dictColors[i] ?? token}
            className="draw-paint"
            style={{ background: `var(${token})` }}
            onClick={() => setPaint(i)}
          />
        ))}
      </div>
      <canvas
        ref={canvasRef}
        className="draw-surface"
        aria-label={dict.label}
        onPointerDown={(e) => {
          drawing.current = true;
          last.current = point(e);
          e.currentTarget.setPointerCapture(e.pointerId);
          playSound("pencil");
        }}
        onPointerMove={stroke}
        onPointerUp={() => {
          drawing.current = false;
          last.current = null;
        }}
        onPointerCancel={() => {
          drawing.current = false;
          last.current = null;
        }}
      />
      <p className="t-small text-ink-3">{dict.hint}</p>
      <div className="draw-actions">
        <button
          type="button"
          className="ui-button t-label"
          data-size="48"
          data-variant="glass"
          onClick={clear}
        >
          {dict.clear}
        </button>
        <button
          type="button"
          className="ui-button t-label"
          data-size="48"
          data-variant="primary"
          onClick={save}
        >
          {dict.save}
        </button>
      </div>
    </div>
  );
}
