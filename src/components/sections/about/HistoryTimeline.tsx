import { Reveal } from "@/components/motion/Reveal";

export interface HistoryItem {
  readonly id: string;
  readonly year: number;
  readonly title: string;
  readonly text: string;
}

interface HistoryTimelineProps {
  readonly items: readonly HistoryItem[];
  /** Roʻyxatning nomi (aria-label), lugʻatdan. */
  readonly label: string;
}

/**
 * Tarix: yoʻnalishlar bilan bir xil teng toʻr (ustida chiziq, yil, sarlavha, izoh). Faqat yili
 * tasdiqlangan bosqichlar keladi (AboutPage).
 */
export function HistoryTimeline({ items, label }: HistoryTimelineProps) {
  return (
    <Reveal as="ol" className="about-list history-timeline" stagger label={label}>
      {items.map((item) => (
        <li key={item.id} className="about-list-item">
          <p className="history-year t-label tnum">{item.year}</p>
          <h3 className="t-h4 text-ink">{item.title}</h3>
          <p className="t-body text-ink-2">{item.text}</p>
        </li>
      ))}
    </Reveal>
  );
}
