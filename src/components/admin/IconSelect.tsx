import type { IconName } from "@/components/icons/paths";
import { FeatureIcon } from "@/components/ui/FeatureIcon";
import { ORG_COPY } from "@/lib/admin/copy-org";
import { MILESTONE_ICONS } from "@/lib/admin/org/milestones";

import { NativeSelect, type SelectOption } from "./NativeSelect";

const H = ORG_COPY.history;
const LABELS: Readonly<Record<string, string>> = H.icons;

interface IconSelectProps {
  readonly id: string;
  readonly value: IconName;
  readonly onChange: (icon: IconName) => void;
}

/**
 * Tarix bandining belgisi: saytdagi belgi plitkalari roʻyxatidan, yonida oʻsha plitkaning oʻzi (saytda
 * qanday koʻrinsa). Bazada roʻyxatdan tashqari belgi boʻlsa, u ham tanlovda qoladi.
 */
export function IconSelect({ id, value, onChange }: IconSelectProps) {
  const names: readonly IconName[] = MILESTONE_ICONS.some((name) => name === value)
    ? MILESTONE_ICONS
    : [value, ...MILESTONE_ICONS];
  const options: readonly SelectOption<IconName>[] = names.map((name) => ({
    value: name,
    label: LABELS[name] ?? name,
  }));
  return (
    <div className="admin-icon-select">
      <NativeSelect id={id} label={H.icon} value={value} options={options} onChange={onChange} />
      <span className="admin-icon-preview">
        <FeatureIcon name={value} />
      </span>
    </div>
  );
}
