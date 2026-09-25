import { Reveal } from "@/components/motion/Reveal";
import type { ContentStatus } from "@/content/types";

export interface HistoryItem {
  readonly id: string;
  readonly year: number | null;
  readonly title: string;
  readonly text: string;
  readonly status: ContentStatus;
}

interface HistoryTimelineProps {
  readonly items: readonly HistoryItem[];
  /** Roʻyxatning nomi (aria-label), lugʻatdan. */
  readonly label: string;
}

/**
 * Tarix chizigʻi: Atlasda ingichka oltin chiziq va nuqtalar (kompyuterda gorizontal, toʻrt bosqich toʻrt
 * ustunda; telefonda vertikal), Birlashmada ipga osilgan qogʻozlar. Yopishqoq sahna yoʻq: boʻsh yoʻl
 * qolmaydi. Sana kelmagan bosqichda yil qatori chizilmaydi — izoh boʻlim kirishida bir marta.
 */
export function HistoryTimeline({ items, label }: HistoryTimelineProps) {
  return (
    <Reveal as="ol" className="history-timeline" stagger label={label}>
      {items.map((item) => (
        <li key={item.id} className="history-item" data-status={item.status}>
          {item.year ? <p className="history-year t-label tnum">{item.year}</p> : null}
          <h3 className="t-h4 text-ink">{item.title}</h3>
          <p className="t-small text-ink-2">{item.text}</p>
        </li>
      ))}
    </Reveal>
  );
}
