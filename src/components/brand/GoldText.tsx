import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Sarlavhadagi kalit söz — metall oltin. Bu firma belgisi va §4.6 dagi
 * "sarlavhada rangli söz bölmasin" qoidasidan ataylab çekiniş (§16.4).
 * Orqada yoruğlik halqasi yöq: faqat metallning özi.
 */
export function GoldText({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn("gold-text", className)}>{children}</span>;
}
