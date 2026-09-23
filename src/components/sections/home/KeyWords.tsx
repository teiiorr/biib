const MARK = /(\{\{[^}]+\}\})/g;

interface KeyWordsProps {
  readonly text: string;
  readonly className?: string;
}

/**
 * {{soʻz}} belgilangan soʻzlar (koʻpi bilan uchta): Atlas da zardoʻzi ostchiziq, Birlashma da marker.
 * Ikki dizayn bitta DOM: bezak faqat CSS psevdo-elementida.
 */
export function KeyWords({ text, className }: KeyWordsProps) {
  const parts = text.split(MARK);
  return (
    <span className={className}>
      {parts.map((part, i) => {
        const m = /^\{\{([^}]+)\}\}$/.exec(part);
        if (!m) return <span key={i}>{part}</span>;
        return (
          <span key={i} className="key-word" data-reveal="pending">
            {m[1]}
          </span>
        );
      })}
    </span>
  );
}
