import type { Metadata } from "next";

import { AdminIcon } from "@/components/admin/AdminIcon";
import { SignOutEverywhere } from "@/components/admin/SignOutEverywhere";
import { Heading } from "@/components/ui/Heading";
import { loadAccount } from "@/lib/admin/account";
import { ADMIN_COPY } from "@/lib/admin/copy";
import { SYSTEM_COPY } from "@/lib/admin/copy-system";
import { formatStamp } from "@/lib/admin/format";
import { requireAdmin } from "@/lib/admin/guard";

export const metadata: Metadata = { title: ADMIN_COPY.pages.security };

const S = SYSTEM_COPY.security;

/** Xavfsizlik: kim kirgan, hamma qurilmadan chiqish va parolni qayerda almashtirish. */
export default async function SecurityAdminPage() {
  const session = await requireAdmin("/admin/xavfsizlik");
  const account = await loadAccount(session);
  return (
    <section className="admin-page">
      <Heading level={1}>{ADMIN_COPY.pages.security}</Heading>
      <div className="admin-cards">
        <section className="admin-card" aria-labelledby="admin-account-title">
          <div className="admin-card-head">
            <span className="admin-card-icon">
              <AdminIcon name="user" size={24} />
            </span>
            <h2 id="admin-account-title" className="t-h3 text-ink">
              {S.account}
            </h2>
          </div>
          <dl className="admin-facts">
            <div>
              <dt className="t-small text-ink-3">{S.email}</dt>
              <dd className="t-body text-ink admin-path" data-testid="admin-account-email">
                {account?.email ?? S.unknown}
              </dd>
            </div>
            <div>
              <dt className="t-small text-ink-3">{S.lastSignIn}</dt>
              <dd className="t-body text-ink tnum">
                {account?.lastSignInAt ? formatStamp(account.lastSignInAt) : S.unknown}
              </dd>
            </div>
          </dl>
        </section>
        <section className="admin-card" aria-labelledby="admin-sessions-title">
          <div className="admin-card-head">
            <span className="admin-card-icon">
              <AdminIcon name="log-out" size={24} />
            </span>
            <h2 id="admin-sessions-title" className="t-h3 text-ink">
              {S.sessions}
            </h2>
          </div>
          <p className="t-body text-ink-2">{S.sessionsText}</p>
          <SignOutEverywhere />
        </section>
      </div>
      <section className="admin-card" aria-labelledby="admin-password-title">
        <div className="admin-card-head">
          <span className="admin-card-icon">
            <AdminIcon name="shield" size={24} />
          </span>
          <h2 id="admin-password-title" className="t-h3 text-ink">
            {S.password}
          </h2>
        </div>
        <p className="t-body text-ink-2 measure">{S.passwordText}</p>
        <p className="t-body text-ink-2 measure">{S.passwordAfter}</p>
      </section>
    </section>
  );
}
