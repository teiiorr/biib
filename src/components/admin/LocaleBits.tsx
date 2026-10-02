import { Button } from "@/components/ui/Button";
import { Tag } from "@/components/ui/Tag";
import { NEWS_COPY } from "@/lib/admin/copy-news";

import { AdminIcon } from "./AdminIcon";

const L = NEWS_COPY.locale;

/** Majburiy maydondagi yulduzcha ekran oʻquvchiga oʻqilmaydi, buni maydonning oʻzi aytadi. */
export function FieldLegend({
  label,
  required,
}: {
  readonly label: string;
  readonly required: boolean;
}) {
  return (
    <legend className="t-label text-ink">
      {label}
      {required ? (
        <span aria-hidden="true" className="text-tint">
          {" *"}
        </span>
      ) : null}
    </legend>
  );
}

/** Kirill va 2026 qatori oʻzbekchadan oʻgirilganmi yoki qoʻlda yozilganmi. */
export function LocaleModeTag({ auto }: { readonly auto: boolean }) {
  return <Tag tone={auto ? "neutral" : "art-3"}>{auto ? L.auto : L.manual}</Tag>;
}

interface StalePromptProps {
  readonly id: string;
  readonly onRetranslit: () => void;
}

/** Oʻzbekcha oʻzgarganda qoʻlda yozilgan qator ustidan yozilmaydi, faqat taklif qilinadi. */
export function StalePrompt({ id, onRetranslit }: StalePromptProps) {
  return (
    <div className="admin-stale">
      <p id={id} className="t-small text-ink-2">
        {L.stale}
      </p>
      <Button
        variant="glass"
        size="40"
        graphic={<AdminIcon name="refresh" size={16} />}
        aria-describedby={id}
        onClick={onRetranslit}
      >
        {L.retranslit}
      </Button>
    </div>
  );
}
