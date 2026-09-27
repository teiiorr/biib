import { Button } from "@/components/ui/Button";
import { Tag } from "@/components/ui/Tag";
import { fill } from "@/i18n/format";
import { SYSTEM_COPY } from "@/lib/admin/copy-system";
import type { LibraryItem } from "@/lib/admin/media/library-types";

import { AdminIcon } from "./AdminIcon";
import { MediaThumb } from "./MediaThumb";

const M = SYSTEM_COPY.media;
const NBSP = " ";

/** «72 KB», «1,4 MB»: son va birlik orasida boʻlinmas boʻshliq, kasr vergul bilan. */
function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))}${NBSP}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1).replace(".", ",")}${NBSP}MB`;
}

function facts(item: LibraryItem): string {
  const parts: string[] = [];
  if (item.width && item.height)
    parts.push(fill(M.dims, { w: item.width, h: item.height }).replace(/ /g, NBSP));
  if (item.bytes !== null) parts.push(formatBytes(item.bytes));
  return parts.join(" · ");
}

interface MediaCardProps {
  readonly item: LibraryItem;
  readonly onDelete: () => void;
}

/**
 * Bitta fayl: rasm (video uchun belgi), nomi, oʻlchami va ishlatilishi. Oʻchirish tugmasi faqat
 * ishlatilmagan yuklangan faylda: qolganida sababni teglar aytadi («N joyda ishlatilgan», «Kodda»),
 * oʻchiq tugmalar toʻri esa shovqin boʻlardi.
 */
export function MediaCard({ item, onDelete }: MediaCardProps) {
  const removable = item.origin === "storage" && item.uses === 0;
  const details = facts(item);
  return (
    <li className="admin-media-card" data-testid="admin-media-card" data-src={item.src}>
      {item.kind === "image" ? (
        <MediaThumb item={item} alt="" ratio="1:1" sizes="(min-width: 1024px) 240px, 50vw" />
      ) : (
        <div className="admin-thumb admin-media-video" data-ratio="1:1">
          <AdminIcon name="film" size={24} />
        </div>
      )}
      <div className="admin-media-body">
        <p className="admin-media-name t-small text-ink">{item.name}</p>
        {details ? <p className="t-micro text-ink-3 tnum">{details}</p> : null}
        <div className="admin-media-tags">
          <Tag tone={item.uses ? "neutral" : "art-3"}>
            {item.uses ? fill(M.uses, { n: item.uses }) : M.notUsed}
          </Tag>
          {item.origin === "static" ? <Tag>{M.inCode}</Tag> : null}
          {item.kind === "video" ? <Tag>{M.video}</Tag> : null}
        </div>
      </div>
      {removable ? (
        <div className="admin-media-actions">
          <Button
            variant="glass"
            size="40"
            graphic={<AdminIcon name="trash" size={16} />}
            aria-label={fill(M.removeLabel, { name: item.name })}
            onClick={onDelete}
            data-testid="admin-media-delete"
          >
            {M.remove}
          </Button>
        </div>
      ) : null}
    </li>
  );
}
