import type { ReactNode } from "react";

import { Icon } from "@/components/icons/Icon";
import { Picture } from "@/components/ui/Picture";
import { PortraitFrame } from "@/components/ui/PortraitFrame";
import { FILLER } from "@/content/placeholder";

interface PersonCardProps {
  readonly id: string;
  readonly name: string;
  readonly role: string;
  /** Faqat tasdiqlangan surat; boʻlmasa ramkada tinch zamin va belgi (yuz oʻylab topilmaydi). */
  readonly photo: string | null;
  /** Faqat tasdiqlangan pochta havola boʻladi; boʻlmasa oʻrinbosar matn, soxta mailto yoʻq. */
  readonly email: string | null;
  readonly index: number;
  readonly sizes: string;
  /** Kartaning pastki qatoridagi qoʻshimcha harakat (ekspert tarjimai holi oynasi). */
  readonly children?: ReactNode;
}

/**
 * Odam kartasi (egasining talabi): katta 4:5 portret, ostida lavozim, ism-familiya va rasmiy pochta.
 * Qatorlar subgrid: qoʻshni kartalarda lavozim, ism va pochta bir chiziqdan boshlanadi.
 */
export function PersonCard({
  id,
  name,
  role,
  photo,
  email,
  index,
  sizes,
  children,
}: PersonCardProps) {
  return (
    <li className="person-tile" data-card="">
      <PortraitFrame
        ratio="4:5"
        className="person-tile-portrait"
        motion={{ mode: "smooth", index }}
      >
        {photo ? <Picture src={photo} alt={name} fill sizes={sizes} /> : null}
      </PortraitFrame>
      <p className="t-small text-ink-3 person-tile-role">{role}</p>
      <h2
        className="t-h4 text-ink text-balance person-tile-name"
        id={`${id}-name`}
        data-card-title=""
      >
        {name}
      </h2>
      <div className="person-tile-foot">
        <p className="person-tile-email t-small">
          <Icon name="mail" size={16} />
          {email ? (
            <a href={`mailto:${email}`} className="text-tint">
              {email}
            </a>
          ) : (
            <span className="text-ink-3">{FILLER.word}</span>
          )}
        </p>
        {children}
      </div>
    </li>
  );
}
