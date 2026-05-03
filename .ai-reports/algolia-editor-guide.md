# Algolia Editor Guide (FRAS Canada)

| Field | Value |
|-------|-------|
| **Audience** | Editorial team — content & search relevance owners |
| **Last updated** | 2026-05-03 |
| **Dashboard** | https://dashboard.algolia.com (login with your invited account) |
| **Engineering runbook** | `.ai-reports/algolia-runbook.md` (key rotation, alerts, rollback) |
| **Source of truth** | Index settings live in two places — see "Source of truth" below |

---

## What you can do without a code deploy

Editors with dashboard access can change these things directly in Algolia. Engineering does not need to be involved:

1. **Synonyms** — tell Algolia that two words mean the same thing (e.g. `AcSB` and `CNC`).
2. **Query rules** — pin a specific result to position 1 for a given query (e.g. always show the Volunteer page when someone types "volunteer").
3. **Replicas / sort orders** — already configured (date-newest-first); editors don't usually touch this.
4. **Custom ranking tweaks** — bump or demote attributes in result ranking.
5. **Analytics review** — read top queries, zero-results queries, click-through rate.

What you CANNOT change in the dashboard (engineering only):
- Searchable attributes (which fields are searched). Those live in code at `infrastructure/algolia/settings.ts` so they survive index rebuilds.
- Faceting attributes (filter dropdowns).
- Backend env vars (API keys, feature flags).

---

## Source of truth

Two places hold settings:

| Source | Wins for | Updated by |
|--------|----------|------------|
| **`infrastructure/algolia/settings.ts`** in the codebase | Searchable attrs, faceting attrs, ranking | Engineering, via PR |
| **Algolia dashboard** | Synonyms, query rules, runtime tweaks | Editors directly |

**Conflict policy:** the dashboard wins for synonyms + query rules + ranking tweaks. The codebase wins for searchable / faceting attributes (those are tightly coupled to UI code in `<FilterSidebar>`).

**Quarterly reconciliation:** every 3 months, run `node scripts/export-algolia-settings.mjs` to pull live dashboard state back into the codebase as a reviewable diff. Engineering merges the export PR after editorial approval.

---

## Adding a synonym

Use case: "Searches for **AcSB** and **CNC** should return the same results — they're the same board."

**In the dashboard:**

1. Go to **Indices** → pick `news_en` (or whichever index needs it).
2. Open **Synonyms** tab.
3. Click **Add synonym** → choose **One-way** or **Two-way** (most cases: two-way).
4. Add the synonym pair: `AcSB ⇔ CNC`.
5. Save.

**Repeat for the FR index** (`news_fr`) so both locales benefit.

**Repeat for every collection** that the synonym applies to (`projects_en`, `consultations_en`, etc.). Algolia synonyms are per-index; there is no global option.

**Common FRAS synonyms to consider:**

| Term | Synonyms |
|------|----------|
| AcSB | CNC, Accounting Standards Board |
| AASB | CNAC, Auditing Standards Board |
| CSSB | CCNID, Sustainability Standards Board |
| PSAB | CCSP, Public Sector Accounting Board |
| RAS | NIFC, FRAS |
| IFRS | International Financial Reporting Standards |
| ASPE | Accounting Standards for Private Enterprises, PE GAAP |
| CSDS | Canadian Sustainability Disclosure Standards |
| Exposure draft | ED |

Add these on Day 1 of cutover; expand based on the zero-results queries report.

---

## Creating a query rule

Use case: "When someone searches for **volunteer**, the volunteer-opportunities page should always be the first result."

**In the dashboard:**

1. Go to **Indices** → pick the index where the rule applies (usually `pages_en` for editorial-pinned content).
2. Open **Rules** tab.
3. Click **Create your first rule** → **Manual editor**.
4. **Conditions:** Query "contains" `volunteer` (or "is" for exact match).
5. **Consequences:** add **Pin item** → enter the `objectID` of the volunteer page.
6. Save.

To find the `objectID` of a record, search for it on the index, click into the result, and copy the `objectID` field shown in the JSON view.

**Localized rules:** create the rule on both `_en` and `_fr` indexes with the relevant locale-specific query (e.g. `volunteer` on `_en`, `bénévolat` on `_fr`).

---

## Reading analytics

Open **Analytics** → **Searches** in the dashboard sidebar.

| Metric | What it tells you | Action when it's bad |
|--------|------------------|---------------------|
| **Top searches** | What visitors actually look for | Confirm those queries return relevant results in position 1 |
| **No results** | Queries that returned 0 hits | Add synonyms or content; consider redirect |
| **Click-through rate (CTR)** | % of searches that ended in a click | < 30% suggests poor relevance — review top queries' results |
| **Position of click** | Where in the results visitors clicked | Lots of position-3+ clicks = top results aren't matching intent |

Schedule: **review weekly** during the first month after cutover, **monthly** after.

---

## Diagnostics — "a visitor said search is bad"

When someone reports a bad search experience:

1. **Get the exact query string + locale** from the reporter. Vague reports ("search is broken") usually aren't.
2. **Reproduce on the live site** at `/<locale>/search?q=<query>`. Capture a screenshot.
3. **Open the dashboard** → the relevant index → run the same query. Compare:
   - Are the top 5 results plausible for the query?
   - Is the expected target document indexed at all? (Search for it by `objectID` / `slug`.)
   - Is there a synonym gap? (E.g. user typed `CNC`, target uses `AcSB`.)
4. **Check zero-results report** for the same query in the timeframe.
5. **Fixes in priority order:**
   - Add or adjust a synonym (most common).
   - Add a query rule pinning the target.
   - Tweak custom ranking if multiple results are competing.
   - Escalate to engineering ONLY if a searchable attribute change is needed.

---

## Provisioning dashboard access

To get an editor onboarded:

1. Existing dashboard owner adds the editor's email at **Settings** → **Team & access** → **Invite member**.
2. Role: **Editor** (NOT Admin — admin can rotate API keys).
3. Editor accepts the invite + sets up MFA.
4. Onboarder walks them through: Step 1 of "Adding a synonym" + Step 1 of "Creating a query rule" + the Analytics tour above.

Record the session if possible — it becomes the onboarding video for the next editor.

---

## Quarterly export-back

Engineering runs `node scripts/export-algolia-settings.mjs` quarterly (Q1: March, Q2: June, Q3: September, Q4: December) to pull the live dashboard settings into a reviewable diff against `infrastructure/algolia/settings.ts`. The diff is opened as a PR, editorial team approves, engineering merges. Calendar reminder added to the team's shared calendar — see `.ai-reports/algolia-runbook.md`.

---

## Related

- Engineering runbook: `.ai-reports/algolia-runbook.md`
- Provider abstraction: `src/search/index.ts`
- Settings-as-code source: `infrastructure/algolia/settings.ts`
- Parent PRD: #171
- This slice: #178
