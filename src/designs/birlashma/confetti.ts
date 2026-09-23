const PAINTS = ["--art-1", "--art-2", "--art-3", "--art-4", "--art-6"] as const;
const REDUCED = "(prefers-reduced-motion: reduce)";

/**
 * Qogʻoz konfetti: bir sessiyada har harakat kaliti uchun bir marta, navigatsiyada emas,
 * kamaytirilgan harakatda hech qachon. ≤ 60 boʻlak, 900 ms, faqat transform/opacity.
 */
export function fireConfetti(origin: { x: number; y: number }, actionKey: string): void {
  if (typeof window === "undefined") return;
  if (window.matchMedia(REDUCED).matches) return;
  if (document.documentElement.getAttribute("data-motion") === "off") return;
  const storageKey = `biib:confetti:${actionKey}`;
  try {
    if (sessionStorage.getItem(storageKey)) return;
    sessionStorage.setItem(storageKey, "1");
  } catch {
    return;
  }
  const layer = document.createElement("div");
  layer.className = "confetti-layer";
  layer.setAttribute("aria-hidden", "true");
  const styles = getComputedStyle(document.documentElement);
  for (let i = 0; i < 48; i++) {
    const piece = document.createElement("span");
    piece.className = "confetti-piece";
    const angle = Math.PI * (0.15 + 0.7 * (i / 48)) + (i % 2 ? 0.1 : -0.1);
    const distance = 90 + ((i * 37) % 120);
    piece.style.setProperty("--dx", `${Math.cos(angle) * distance}px`);
    piece.style.setProperty("--dy", `${-Math.sin(angle) * distance - 40}px`);
    piece.style.setProperty("--rot", `${(i * 53) % 360}deg`);
    piece.style.setProperty("--delay", `${(i % 6) * 18}ms`);
    piece.style.background = styles.getPropertyValue(PAINTS[i % PAINTS.length] ?? "--art-1");
    piece.style.left = `${origin.x}px`;
    piece.style.top = `${origin.y}px`;
    layer.append(piece);
  }
  document.body.append(layer);
  window.setTimeout(() => layer.remove(), 1100);
}
