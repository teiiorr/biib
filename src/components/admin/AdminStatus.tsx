import type { ReactNode } from "react";

import { BrandLogo } from "@/components/ui/BrandLogo";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { ADMIN_COPY } from "@/lib/admin/copy";

interface AdminStatusProps {
  readonly title: string;
  readonly text: string;
  readonly actions: ReactNode;
}

export function AdminStatus({ title, text, actions }: AdminStatusProps) {
  return (
    <main id="content" className="admin-status" tabIndex={-1}>
      <div className="admin-status-column">
        <BrandLogo alt={ADMIN_COPY.brand} size={48} eager className="admin-mark" />
        <Heading level={1}>{title}</Heading>
        <Text tone="ink-2" align="center">
          {text}
        </Text>
        <div className="admin-actions">{actions}</div>
      </div>
    </main>
  );
}
