import { AdminStatus } from "@/components/admin/AdminStatus";
import { LinkButton } from "@/components/ui/LinkButton";
import { ADMIN_COPY } from "@/lib/admin/copy";

/** Panel ichidagi nomaʼlum yoʻl sayt 404 sahifasiga emas, panelning oʻz sahifasiga tushadi. */
export default function AdminNotFound() {
  return (
    <AdminStatus
      title={ADMIN_COPY.errors.notFound}
      text={ADMIN_COPY.errors.notFoundText}
      actions={
        <LinkButton href="/admin" variant="glass" icon="arrow-left">
          {ADMIN_COPY.errors.backHome}
        </LinkButton>
      }
    />
  );
}
