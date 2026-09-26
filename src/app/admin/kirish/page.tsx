import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { LoginForm } from "@/components/admin/LoginForm";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { Heading } from "@/components/ui/Heading";
import { ADMIN_COPY } from "@/lib/admin/copy";
import { adminEnv } from "@/lib/admin/env";
import { getAdminSession } from "@/lib/admin/guard";
import { safeNext } from "@/lib/admin/paths";

export const metadata: Metadata = { title: ADMIN_COPY.login.submit };

interface LoginPageProps {
  readonly searchParams: Promise<{ next?: string | string[] }>;
}

/** Kirish: markazdagi belgi va oltin sarlavha, ostida oyna panelda shakl. Sessiya bor boʻlsa panelga. */
export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { next } = await searchParams;
  const target = safeNext(typeof next === "string" ? next : undefined);
  if (await getAdminSession()) redirect(target);
  return (
    <main id="content" className="admin-login" tabIndex={-1}>
      <div className="admin-login-column">
        <BrandLogo alt={ADMIN_COPY.brand} size={48} eager className="admin-mark" />
        <Heading level={1}>{ADMIN_COPY.login.title}</Heading>
        <LoginForm next={target} closed={adminEnv() === null} />
      </div>
    </main>
  );
}
