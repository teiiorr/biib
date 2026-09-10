"use client";

/**
 * Asosiy tugma bosilganda konfetti. Faqat transform va opacity —
 * layout qayta hisoblanmaydi. prefers-reduced-motion da işlamaydi.
 */

const COLORS = ["--sun", "--coral", "--grass", "--pink", "--grape", "--blue"] as const;
const PIECES = 26;

export function burstConfetti(anchor: HTMLElement | null): void {
  if (typeof window === "undefined" || !anchor) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (typeof anchor.animate !== "function") return;

  const box = anchor.getBoundingClientRect();
  const originX = box.left + box.width / 2;
  const originY = box.top + box.height / 2;

  const layer = document.createElement("div");
  layer.setAttribute("aria-hidden", "true");
  layer.style.cssText =
    "position:fixed;inset:0;pointer-events:none;z-index:90;contain:strict;overflow:hidden";
  document.body.appendChild(layer);

  const styles = getComputedStyle(document.documentElement);
  let alive = PIECES;

  for (let index = 0; index < PIECES; index += 1) {
    const piece = document.createElement("i");
    const token = COLORS[index % COLORS.length];
    const round = index % 3 === 0;
    const size = 7 + (index % 4) * 2;

    piece.style.cssText = [
      "position:absolute",
      `left:${originX}px`,
      `top:${originY}px`,
      `width:${size}px`,
      `height:${round ? size : size * 1.7}px`,
      `background:${styles.getPropertyValue(token ?? "--blue").trim() || "#2e7df6"}`,
      `border-radius:${round ? "50%" : "2px"}`,
      "will-change:transform,opacity",
    ].join(";");
    layer.appendChild(piece);

    // Yelpiğiç yuqoriga: burçak -160°..-20°, tezlik har xil.
    const angle = (-160 + (140 / (PIECES - 1)) * index) * (Math.PI / 180);
    const distance = 120 + (index % 5) * 46;
    const driftX = Math.cos(angle) * distance;
    const liftY = Math.sin(angle) * distance;
    const fallY = liftY + 260 + (index % 4) * 60;
    const spin = (index % 2 === 0 ? 1 : -1) * (220 + index * 14);

    const animation = piece.animate(
      [
        { transform: "translate(-50%,-50%) translate(0,0) rotate(0deg)", opacity: 1 },
        {
          transform: `translate(-50%,-50%) translate(${driftX * 0.72}px,${liftY}px) rotate(${spin * 0.55}deg)`,
          opacity: 1,
          offset: 0.42,
        },
        {
          transform: `translate(-50%,-50%) translate(${driftX}px,${fallY}px) rotate(${spin}deg)`,
          opacity: 0,
        },
      ],
      {
        duration: 1150 + (index % 5) * 170,
        easing: "cubic-bezier(.18,.72,.3,1)",
        fill: "forwards",
      },
    );

    animation.onfinish = () => {
      alive -= 1;
      if (alive === 0) layer.remove();
    };
  }

  // Sahifa almaşsa ham qoldiq qolmasin.
  window.setTimeout(() => layer.remove(), 2600);
}
