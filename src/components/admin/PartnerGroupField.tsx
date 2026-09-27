import type { PartnerGroup } from "@/content/types";
import { partners } from "@/i18n/dictionaries/uz/partners";
import { PARTNER_GROUPS } from "@/lib/admin/partners/types";

/** Guruh nomlari saytdagi oʻzbekcha sarlavhalarning oʻzi: panel va sayt bir xil ataydi. */
export const PARTNER_GROUP_LABELS: Readonly<Record<PartnerGroup, string>> = partners.groups;

interface PartnerGroupFieldProps {
  readonly id: string;
  readonly legend: string;
  readonly value: PartnerGroup;
  readonly onChange: (group: PartnerGroup) => void;
}

/** Guruh: toʻrtta tabiiy radio (telefonda ochiladigan roʻyxatdan tezroq), saytdagi tartibda. */
export function PartnerGroupField({ id, legend, value, onChange }: PartnerGroupFieldProps) {
  return (
    <fieldset className="admin-choice">
      <legend className="t-label text-ink">{legend}</legend>
      <div className="admin-choice-list">
        {PARTNER_GROUPS.map((group) => (
          <label key={group} className="admin-radio">
            <input
              type="radio"
              name={id}
              value={group}
              checked={value === group}
              onChange={() => onChange(group)}
            />
            <span className="admin-radio-text t-body text-ink">{PARTNER_GROUP_LABELS[group]}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
