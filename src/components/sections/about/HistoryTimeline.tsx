import type { IconName } from "@/components/icons/paths";
import { Reveal } from "@/components/motion/Reveal";
import { FeatureIcon } from "@/components/ui/FeatureIcon";

export interface HistoryItem {
  readonly id: string;
  readonly year: number;
  readonly title: string;
  readonly icon: IconName;
}

interface HistoryTimelineProps {
  readonly items: readonly HistoryItem[];
  /** Roʻyxatning nomi (aria-label), lugʻatdan. */
  readonly label: string;
}

/**
 * Tarix: yoʻnalish va vazifalar bilan bir xil katta bandlar — belgi va bitta qator «Ustav tasdiqlandi
 * (2026)» (egasining talabi). Faqat yili tasdiqlangan bosqichlar keladi (AboutPage).
 */
export function HistoryTimeline({ items, label }: HistoryTimelineProps) {
  return (
    <Reveal
      as="ol"
      className="about-list history-timeline"
      stagger
      label={label}
      attrs={{ "data-audit": "gap", "data-columns": "2" }}
    >
      {items.map((item) => (
        <li key={item.id} className="about-list-item feature text-ink">
          <FeatureIcon name={item.icon} />
          <span>
            {/* Yil oxirgi soʻzdan ajralmaydi: tor ekranda qavs yolgʻiz qatorga tushmaydi. */}
            {item.title}
            {"\u00a0"}
            <span className="history-year tnum">({item.year})</span>
          </span>
        </li>
      ))}
    </Reveal>
  );
}
