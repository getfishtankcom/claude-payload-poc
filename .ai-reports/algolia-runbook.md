# Algolia Runbook (FRAS Canada)

| Field | Value |
|-------|-------|
| **Last updated** | 2026-05-03 |
| **Owner** | _TBD — fill on Slice 4 production cutover_ |
| **Provider** | Algolia (https://dashboard.algolia.com) |
| **Active env vars** | `SEARCH_PROVIDER`, `ALGOLIA_APP_ID`, `ALGOLIA_ADMIN_API_KEY`, `NEXT_PUBLIC_ALGOLIA_APP_ID`, `NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY` |
| **Dashboard alerts** | Search volume warn 5k/hr, page 10k/hr (#175 / Slice 4 — confirm thresholds with traffic baseline) |
| **Provider abstraction** | `src/search/index.ts` (#172 / Slice 1) — flip via `SEARCH_PROVIDER=algolia` |

---

## Account configuration (HITL)

These must be set in the Algolia dashboard before traffic hits the indexes. Fill the table once provisioned:

| Setting | Value | Notes |
|---------|-------|-------|
| **Region** | _TBD_ — US-East or EU | Document rationale below |
| **Tier** | _TBD_ — Build (free) or Grow ($95/mo) | Document projected monthly search volume below |
| **Admin API key** | `ALGOLIA_ADMIN_API_KEY` | Full read/write. Server-only. Never in `NEXT_PUBLIC_*`. |
| **Search-only API key** | `NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY` | Restrict in dashboard — see "Search-only key restrictions" below. |

### Region rationale (TBD)

- _Document data-residency requirements (Government of Canada Official Languages Act + privacy law)._
- _If user data is sensitive, prefer EU; otherwise US-East gives lower latency for the dominant Toronto/Ottawa user base._

### Tier rationale (TBD)

- _Build (free): up to 10k records, 10k searches/mo. Sufficient for early launch with current ~2.7k records._
- _Grow ($95/mo): up to 100k records, 100k searches/mo + analytics dashboard._
- _Recommend starting on Build, migrating to Grow when monthly searches cross 8k or analytics is needed for editorial decisions._

---

## Search-only key restrictions

Configure the search-only API key in the Algolia dashboard (Settings → API Keys → Edit):

- **ACL** — `search` only. Never `addObject`, `deleteObject`, `editSettings`.
- **Index allow-list** — `*_en` and `*_fr` (matches the per-locale index pattern). Effective list as of #174:
  - `news_en`, `news_fr`
  - `projects_en`, `projects_fr`
  - `consultations_en`, `consultations_fr`
  - `documents_en`, `documents_fr`
  - `events_en`, `events_fr`
  - `pages_en`, `pages_fr`
  - `resources_en`, `resources_fr`
- **Rate limit** — 100 req/sec/IP. Spike alert documented below.
- **Validity** — no expiry; rotate on schedule (see Key Rotation below).
- **Referer restriction** — `*.frascanada.ca/*` plus deploy-preview wildcards.

Keys must NEVER carry any `addObject`/`deleteObject`/`editSettings` ACL. The build-time guard at `src/search/__tests__/no-admin-key-in-bundle.test.ts` ensures the admin key isn't bundled into client output.

---

## Search-volume alerts

Configured at: Algolia dashboard → Settings → Alerts.

| Severity | Threshold | Action |
|----------|-----------|--------|
| Warn | 5,000 searches / hour | Slack `#fras-eng` channel — investigation only |
| Page | 10,000 searches / hour | PagerDuty rotation owner — possible scraping or runaway client |

Re-baseline after 30 days of production traffic. Adjust if normal-business-hours traffic regularly trips warn.

---

## Key rotation

**Rotate the admin key every 90 days, or immediately on any of:**
- Departed engineer who held the key
- Suspicion of leak (key visible in commit, log, screenshot)
- Algolia dashboard reports unauthorised access

Rotation procedure:

1. In Algolia dashboard → Settings → API Keys, generate a new admin key.
2. Add the new key to the production env (Vercel / fly.io / wherever is canonical) BEFORE removing the old one.
3. Re-deploy to pick up the new key.
4. Verify sync hooks fire successfully on a test write (publish a draft news item, confirm Algolia index updates within 30s).
5. Delete the old admin key from the Algolia dashboard.
6. Update this runbook with rotation date.

The search-only key follows the same procedure but takes effect on the next public deploy (no server restart needed).

---

## Search-volume spike investigation

When the warn alert fires:

1. Check Algolia dashboard → Analytics → Searches per hour for the spike timing.
2. Check the top queries tab for repeated identical queries (likely scraping).
3. Cross-reference with Vercel/web logs for the same time window:
   - Look for high-volume IPs hitting `/en/search` or `/fr/recherche`.
   - Look for User-Agents containing `bot`, `spider`, `scraper`, `python-requests`.
4. If scraping is confirmed:
   - Add the offending IP to the Algolia API key referer/IP block-list.
   - Add to `next.config.js` middleware deny-list as a defence-in-depth.
5. If volume is genuine (e.g. campaign launch, news event), bump the warn threshold for 24h and document.

---

## Rollback to Meilisearch

If Algolia is misbehaving (downtime, cost spike, relevance regression), flip the env var to fall back to Meilisearch immediately:

1. Set `SEARCH_PROVIDER=meilisearch` in production env.
2. Re-deploy (no rebuild needed — runtime env var, factory dispatches on read).
3. Verify the homepage search input + `/en/search` work against Meilisearch.
4. Open an incident report at `.ai-reports/incidents/`.

The Meilisearch instance stays parallel-indexed for 30 days post-cutover (Slice 8 / #179) specifically for this scenario. After day 30, rollback requires re-indexing first — `node scripts/reindex-meilisearch.mjs`.

---

## Cost monitoring

Algolia bills on operations (search requests + index writes). Set a monthly budget alert in the dashboard:

| Tier | Soft cap | Hard cap |
|------|----------|----------|
| Build (free) | $0 | $0 — auto-throttle |
| Grow ($95/mo) | $80 | $150 — alert + page on-call |

Bigger spikes than the rate-limit allows almost always indicate a scraping incident — see "Search-volume spike investigation" above.

---

## Related

- PRD: #171
- Slice 1 (provider abstraction): #172 / PR #206
- Slice 2 (News POC): #173 / PR #207
- Slice 3 (all collections): #174 / PR #208
- Slice 4 (this slice): #175
- Slice 5 (parallel indexing): #176
- Slice 6 (production cutover, HITL): #177
- Slice 7 (editor docs): #178
- Slice 8 (Meilisearch deprecation): #179
