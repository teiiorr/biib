import { fill } from "@/i18n/format";
import { ADMIN_COPY } from "@/lib/admin/copy";
import { formatStamp } from "@/lib/admin/format";
import type { SiteHealth } from "@/lib/admin/health";

import { AdminIcon } from "./AdminIcon";
import { RefreshSiteButton } from "./RefreshSiteButton";

const H = ADMIN_COPY.health;
const C = ADMIN_COPY.common;

/** «Sayt holati»: sahifalar manbai, bazaga ulanish, bazadagi nusxa vaqti va yangilash tugmasi. */
export function HealthCard({ health }: { readonly health: SiteHealth }) {
  const news = health.news;
  return (
    <section className="admin-card" aria-labelledby="admin-health-title">
      <div className="admin-card-head">
        <span className="admin-card-icon" data-state={health.reachable ? "ok" : "down"}>
          <AdminIcon name={health.reachable ? "shield" : "alert"} size={24} />
        </span>
        <h2 id="admin-health-title" className="t-h3 text-ink">
          {H.title}
        </h2>
      </div>
      <dl className="admin-facts">
        <div>
          <dt className="t-small text-ink-3">{H.source}</dt>
          <dd className="t-body text-ink">{H.sources[health.source]}</dd>
        </div>
        <div>
          <dt className="t-small text-ink-3">{H.reachable}</dt>
          <dd className="t-body" data-state={health.reachable ? "ok" : "down"}>
            {health.reachable ? C.yes : C.no}
          </dd>
        </div>
        <div>
          <dt className="t-small text-ink-3">{H.generatedAt}</dt>
          <dd className="t-body text-ink tnum">
            {health.generatedAt ? formatStamp(health.generatedAt) : H.unknown}
          </dd>
        </div>
      </dl>
      {news ? (
        <p className="t-small text-ink-2 tnum">{fill(ADMIN_COPY.dashboard.counts, { ...news })}</p>
      ) : null}
      <p className="t-small text-ink-3">{H.refreshHint}</p>
      <RefreshSiteButton />
    </section>
  );
}
