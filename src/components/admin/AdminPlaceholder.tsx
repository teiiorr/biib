import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { ADMIN_COPY } from "@/lib/admin/copy";

interface AdminPlaceholderProps {
  readonly title: string;
}

/** Keyingi bosqichlarda toʻladigan boʻlim: sarlavha va bir qator holat. */
export function AdminPlaceholder({ title }: AdminPlaceholderProps) {
  return (
    <section className="admin-page admin-page-center">
      <Heading level={1}>{title}</Heading>
      <Text tone="ink-2" align="center">
        {ADMIN_COPY.placeholder}
      </Text>
    </section>
  );
}
