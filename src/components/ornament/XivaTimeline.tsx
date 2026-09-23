import { cn } from "@/lib/cn";
import type { ContentStatus } from "@/content/types";
import type { XivaVariant } from "@/lib/ornament/xiva";
import { XivaColumn } from "./XivaColumn";
import { XivaTimelineScene } from "./XivaTimelineScene";

export interface XivaTimelineItem {
  readonly id: string;
  readonly year: number | null;
  readonly title: string;
  readonly text: string;
  readonly status: ContentStatus;
}

export interface XivaTimelineProps {
  readonly items: readonly XivaTimelineItem[];
  /** Sana yoʻq (pending) ustunlar uchun sokin yorliq, lugʻatdan. */
  readonly pendingLabel: string;
  /** Roʻyxatning nomi (aria-label), lugʻatdan. */
  readonly label: string;
  readonly heading?: "h3" | "h4";
  /** Kompyuterda qisqa yopishqoq sahna (≤150 % ekran, scrub 0.8); mobilda vertikal. */
  readonly scene?: boolean;
  readonly className?: string;
}

const VARIANTS: readonly XivaVariant[] = ["islimiy", "girih", "zanjir", "band"];

/** Tarix chizigʻi: har bosqich oʻz ustuni bilan. DOM tartibi ikkala tartibda bir xil. */
export function XivaTimeline({
  items,
  pendingLabel,
  label,
  heading = "h3",
  scene = true,
  className,
}: XivaTimelineProps) {
  const Heading = heading;
  const list = (
    <ol className={cn("xiva-timeline", className)} aria-label={label}>
      {items.map((item, index) => (
        <li key={item.id} className="xiva-item" data-status={item.status} data-index={index}>
          <XivaColumn variant={VARIANTS[index % VARIANTS.length] ?? "islimiy"} seed={item.id} />
          <div className="grid gap-2">
            <p className="xiva-year t-label tnum">{item.year ?? pendingLabel}</p>
            <Heading className="t-h4 text-ink">{item.title}</Heading>
            <p className="t-small text-ink-2 measure">{item.text}</p>
          </div>
        </li>
      ))}
    </ol>
  );
  if (!scene) return list;
  return (
    <XivaTimelineScene>
      <div className="xiva-stage">
        <div className="xiva-scene">{list}</div>
      </div>
    </XivaTimelineScene>
  );
}
