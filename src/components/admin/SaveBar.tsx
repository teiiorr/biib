import { Surface } from "@/components/glass/Surface";
import { Button } from "@/components/ui/Button";
import { LinkButton } from "@/components/ui/LinkButton";
import { NEWS_COPY } from "@/lib/admin/copy-news";

export type SaveTone = "neutral" | "success" | "error";

export interface SaveBarProps {
  readonly message: string;
  readonly tone: SaveTone;
  readonly saving: boolean;
  /** Saqlash vaqtincha yopiq boʻlsa (masalan rasm yuklanmoqda), sababi tooltipda chiqadi. */
  readonly blockedReason?: string | null;
  /** Yangi yozuvda null: u hali saytda yoʻq. */
  readonly viewHref: string | null;
  readonly saveLabel?: string;
}

const S = NEWS_COPY.save;

/** Panel pastga yopishgan: telefonda saqlash tugmasi bosh barmoq yetadigan joyda turadi. */
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
