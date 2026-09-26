import { Surface } from "@/components/glass/Surface";
import { Button } from "@/components/ui/Button";
import { LinkButton } from "@/components/ui/LinkButton";
import { NEWS_COPY } from "@/lib/admin/copy-news";

export type SaveTone = "neutral" | "success" | "error";

export interface SaveBarProps {
  /** Holat qatori (ekran oʻquvchisiga ham eʼlon qilinadi). */
  readonly message: string;
  readonly tone: SaveTone;
  readonly saving: boolean;
  /** Saqlash hozir mumkin emas (masalan rasmlar yuklanmoqda): sababi tooltipda. */
  readonly blockedReason?: string | null;
  /** Saqlangan yozuvning saytdagi manzili; yangi yozuvda null. */
  readonly viewHref: string | null;
  readonly saveLabel?: string;
}

const S = NEWS_COPY.save;

/**
 * Shakl oxiridagi yopishqoq oyna panel: telefonda bosh barmoq zonasida. Chapda holat, oʻngda saytda
 * koʻrish va saqlash. Saqlash tugmasi shaklni yuboradi (type=submit).
 */
export function SaveBar({
  message,
  tone,
  saving,
  blockedReason = null,
  viewHref,
  saveLabel = S.save,
}: SaveBarProps) {
  return (
    <Surface
      as="div"
      radius="panel"
      padding={12}
      text
      className="admin-savebar"
      role="region"
      aria-label={S.region}
    >
      <p className="admin-savebar-status t-small" role="status" data-tone={tone}>
        {message}
      </p>
      <div className="admin-actions">
        {viewHref ? (
          <LinkButton href={viewHref} variant="glass" size="48" external externalHint={S.newTab}>
            {S.view}
          </LinkButton>
        ) : null}
        <Button
          type="submit"
          variant="primary"
          size="48"
          loading={saving}
          disabled={Boolean(blockedReason)}
          {...(blockedReason ? { disabledReason: blockedReason } : {})}
          icon="check"
          data-testid="admin-save"
        >
          {saving ? S.saving : saveLabel}
        </Button>
      </div>
    </Surface>
  );
}
