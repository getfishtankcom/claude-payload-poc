# Search Solutions Research: FRAS Canada PoC

**Date:** 2026-03-04
**Context:** Next.js 15 (App Router) + Payload CMS 3.x + PostgreSQL
**Scale:** ~2,000-10,000 documents (news, projects, documents, meetings, events, resources, members, committees)
**Languages:** EN/FR bilingual

---

## Executive Summary & Recommendation

**Primary Recommendation: Meilisearch**
**Runner-up: Typesense**
**Avoid for this project: Pagefind, Orama, Payload built-in search**

Meilisearch offers the best balance of developer experience, faceting power, bilingual support, Payload CMS integration maturity, and self-hosting simplicity for this project's scale and requirements. Typesense is a strong alternative with slightly more operational maturity but a less permissive license (GPLv3 vs MIT).

---

## Detailed Comparison Matrix

| Criteria | Meilisearch | Typesense | Elasticsearch/OpenSearch | Payload Built-in | Orama | Pagefind | Algolia |
|---|---|---|---|---|---|---|---|
| **License** | MIT | GPLv3 | Apache 2.0 (OpenSearch) / SSPL (Elastic) | MIT | Apache 2.0 | MIT | Proprietary |
| **Next.js Integration** | Excellent | Excellent | Good (via Searchkit) | Native | Good | Poor (static only) | Excellent |
| **Faceting** | Excellent | Excellent | Excellent | None | Good | Limited | Excellent |
| **Fuzzy/Typo Tolerance** | Built-in | Built-in | Configurable | None | Built-in | Basic | Built-in |
| **EN/FR Bilingual** | Excellent | Excellent | Excellent | PostgreSQL-level | Good | Limited | Excellent |
| **PDF/Word Indexing** | External extraction | External extraction | Native (ingest pipeline) | None | None | HTML only | External extraction |
| **Self-hosted** | Yes (single binary) | Yes (single binary) | Yes (complex) | N/A (DB) | Browser/Edge only | Static files | No |
| **Payload CMS Plugin** | Yes (NouanceLabs) | Yes (Rubix Studios) | No (custom) | Official plugin | No | No | No (custom) |
| **Performance at 10K docs** | Sub-50ms | Sub-50ms | Sub-100ms | Depends on PG | Sub-50ms (in-memory) | Fast (static) | Sub-50ms |
| **Community Maturity** | High (49K+ GitHub stars) | High (22K+ GitHub stars) | Very High | Part of Payload | Medium (9K+ stars) | Medium (3K+ stars) | Very High |
| **Computed/Derived Fields** | Yes (via sync) | Yes (via sync) | Yes | Limited | Yes (schema) | No | Yes |
| **Search Suggestions** | Yes | Yes | Yes | No | Limited | No | Yes |
| **Did-you-mean** | Built-in | Built-in | Configurable | No | No | No | Built-in |

---

## Detailed Analysis

### 1. Meilisearch (RECOMMENDED)

**What it is:** A Rust-based, lightning-fast search engine with a focus on developer experience. MIT-licensed Community Edition is fully open source and free for commercial use.

**Strengths for FRAS Canada:**
- **Faceted search** is a first-class citizen with dedicated API for facet counts, filtering, and distribution
- **Bilingual EN/FR:** Automatic language detection per field. Best practice is one index per language (e.g., `documents_en`, `documents_fr`), which maps cleanly to FRAS's bilingual content model
- **InstantSearch compatibility:** Uses Algolia's React InstantSearch library via `instant-meilisearch` adapter, giving you access to all InstantSearch widgets (RefinementList, SearchBox, Pagination, SortBy, Stats, HitsPerPage)
- **Payload CMS plugin:** `payload-meilisearch` by NouanceLabs syncs collection data to Meilisearch indices with field aliasing support -- perfect for computed fields like `topicAreaName` and `toplevelcategory`
- **Typo tolerance** built-in with configurable thresholds
- **Single binary deployment** -- Docker image, easy to self-host on any VPS
- **AI-powered hybrid search** available (vector + keyword) for future enhancements
- **Computed fields:** Sync only search-critical data with field transformations during indexing

**Weaknesses:**
- **No native PDF/Word extraction** -- must use external tools (e.g., `pdf-parse`, `mammoth`, Apache Tika) to extract text before indexing
- **Single-node architecture** in Community Edition (no sharding), but this is more than adequate for 10K documents
- **Payload plugin maturity** -- NouanceLabs plugin works but may need customization for complex sync scenarios

**Architecture for FRAS:**
```
Payload CMS (PostgreSQL)
  --> payload-meilisearch plugin (hooks on create/update/delete)
    --> Meilisearch instance (Docker)
      --> Next.js frontend (react-instantsearch + instant-meilisearch)
```

**PDF/Word Pipeline:**
```
Upload to Payload --> afterChange hook --> pdf-parse/mammoth extraction
  --> Push extracted text + metadata to Meilisearch index
```

**References:**
- [Meilisearch GitHub](https://github.com/meilisearch/meilisearch)
- [Meilisearch Faceted Search](https://www.meilisearch.com/docs/learn/filtering_and_sorting/search_with_facet_filters)
- [Meilisearch Multilingual Datasets](https://www.meilisearch.com/docs/learn/indexing/multilingual-datasets)
- [payload-meilisearch Plugin](https://github.com/NouanceLabs/payload-meilisearch)
- [Meilisearch with React](https://www.meilisearch.com/with/react)
- [Meilisearch Open Source License](https://www.meilisearch.com/blog/open-source-or-not)

---

### 2. Typesense (STRONG ALTERNATIVE)

**What it is:** A C++-based, in-memory search engine positioned as an open-source Algolia alternative. GPLv3 licensed.

**Strengths for FRAS Canada:**
- **Faceted search** with schema-level `facet: true` field configuration
- **Bilingual EN/FR:** Per-field locale setting with ICU tokenization. French diacritics preserved correctly. Recommended pattern: separate fields per language (`title_en`, `title_fr`)
- **InstantSearch compatibility:** Official `typesense-instantsearch-adapter` works with React InstantSearch, including SSR with Next.js App Router (official showcase example exists)
- **Payload CMS plugin:** `@rubixstudios/payload-typesense` is production-ready, recently updated (v1.2.0), with real-time sync, caching, and vector search support
- **Typo tolerance** built-in and configurable
- **High-availability** via Raft consensus clustering (replicated, not sharded)
- **Blazing fast** -- entire index in RAM, sub-50ms responses

**Weaknesses:**
- **GPLv3 license** -- more restrictive than MIT. Any modifications to Typesense itself must be open-sourced (but using it as a service is fine)
- **No native PDF/Word extraction** -- same external extraction requirement as Meilisearch
- **Slightly steeper learning curve** for schema definitions compared to Meilisearch's schemaless approach
- **All data must fit in RAM** -- not an issue at 10K docs but could matter if document bodies are large

**References:**
- [Typesense GitHub](https://github.com/typesense/typesense)
- [Typesense Next.js App Router SSR Guide](https://typesense.org/docs/guide/reference-implementations/nextjs-app-router-ssr.html)
- [Typesense Locale Tips](https://typesense.org/docs/guide/locale.html)
- [payload-typesense Plugin](https://github.com/rubix-studios-pty-ltd/payload-typesense)
- [Typesense Benchmarks](https://typesense.org/docs/overview/benchmarks.html)

---

### 3. Elasticsearch / OpenSearch (OVERKILL)

**What it is:** The industry-standard distributed search engine. OpenSearch (Apache 2.0) is the fully open-source fork of Elasticsearch.

**Strengths:**
- **Most powerful faceting** via aggregations (terms, ranges, nested, histograms)
- **Native PDF ingestion** via ingest attachment pipeline (uses Apache Tika internally)
- **Excellent multilingual** with per-field analyzers, French stemming, stop words
- **Searchkit** provides excellent Next.js integration with SSR support
- **Battle-tested** at any scale

**Weaknesses:**
- **Massively overkill** for 5,000-10,000 documents -- designed for millions/billions
- **Operational complexity** -- JVM-based, requires significant RAM (minimum 2-4GB), cluster management
- **No Payload CMS plugin** -- requires custom integration via hooks
- **Higher hosting costs** -- minimum ~$30-50/month for a reasonable instance
- **Steep learning curve** for query DSL

**Verdict:** Only consider if FRAS Canada expects to scale to 100K+ documents or needs the native PDF ingest pipeline badly enough to justify the operational overhead.

**References:**
- [OpenSearch Faceted Search](https://docs.opensearch.org/latest/tutorials/faceted-search/)
- [Searchkit with Next.js](https://www.searchkit.co/docs/tutorials/with-nextjs)
- [Using Elasticsearch with Next.js](https://makerkit.dev/blog/tutorials/nextjs-elasticsearch)

---

### 4. Payload CMS Built-in Search Plugin (INSUFFICIENT)

**What it is:** Official `@payloadcms/plugin-search` that creates a denormalized `search` collection in your PostgreSQL database with indexed, search-critical data.

**Strengths:**
- **Zero additional infrastructure** -- uses existing PostgreSQL
- **Native Payload integration** -- automatic sync on create/update/delete
- **Simple setup** -- just add to plugins array
- **Priority-based ordering** per collection
- **Bypasses hooks** on original documents for faster queries

**Weaknesses:**
- **No faceted search** -- no aggregation/count capabilities
- **No fuzzy/typo-tolerant search** -- relies on PostgreSQL `LIKE` or `tsvector` which is limited
- **No search suggestions or did-you-mean**
- **No multilingual tokenization** -- PostgreSQL's `tsvector` has basic French support but nothing comparable to Meilisearch/Typesense
- **No PDF/Word indexing**
- **No InstantSearch widget ecosystem** -- you build everything custom
- **Minimal query features** -- no highlighting, no facet counts, no sort relevance tuning

**Verdict:** Useful as a lightweight internal search for the admin panel, but completely insufficient for the front-end search experience FRAS Canada needs. Could serve as the sync layer that feeds into Meilisearch/Typesense.

**References:**
- [Payload Search Plugin Docs](https://payloadcms.com/docs/plugins/search)
- [Using Payload's Search Plugin Guide](https://payloadcms.com/posts/guides/using-payloads-search-plugin-for-custom-search-experiences)

---

### 5. Orama (WRONG FIT)

**What it is:** A tiny (<2KB) TypeScript search engine that runs in-browser, on the server, or at the edge. Formerly called Lyra.

**Strengths:**
- **Zero infrastructure** -- runs entirely in the browser or edge
- **Facets API** with counts
- **Typo tolerance** built-in
- **Vector and hybrid search** support
- **Multilingual** with language-specific tokenizers

**Weaknesses:**
- **In-memory only** -- entire index must fit in browser memory. At 2,000+ pages with full content, this becomes impractical
- **No PDF/Word indexing** natively
- **No Payload CMS plugin**
- **Index must be pre-built and shipped to client** -- adds to bundle size and page load
- **No server-side search** in the traditional sense (no persistent index)
- **Cloud version (Orama Cloud) is proprietary** and expensive for large datasets
- **Limited ecosystem** for InstantSearch-style widgets

**Verdict:** Excellent for documentation sites or small static sites. Wrong architecture for a CMS-backed site with 2,000+ pages of mixed content, PDFs, and dynamic faceting needs.

**References:**
- [Orama GitHub](https://github.com/oramasearch/orama)
- [Orama Facets Docs](https://docs.orama.com/open-source/usage/search/facets)
- [Orama Documentation](https://docs.orama.com/)

---

### 6. Pagefind (WRONG FIT)

**What it is:** A static search library that indexes your site's HTML output at build time. MIT licensed.

**Strengths:**
- **Zero runtime infrastructure** -- generates static index files
- **Tiny bandwidth** -- loads only the index chunks needed
- **Good for static sites**

**Weaknesses:**
- **Only works with static HTML output** -- requires `output: 'export'` in Next.js, which breaks dynamic features
- **No faceted search** in any meaningful way
- **No PDF/Word indexing** -- HTML only
- **No fuzzy search or suggestions**
- **No bilingual support** beyond what's in the HTML
- **Poor Next.js compatibility** -- known issues with path mapping
- **No real-time indexing** -- must rebuild entire site to update search

**Verdict:** Completely wrong fit. Designed for static documentation sites, not dynamic CMS-driven applications.

**References:**
- [Pagefind Documentation](https://pagefind.app/docs/)
- [Pagefind Next.js Guide](https://www.petemillspaugh.com/nextjs-search-with-pagefind)
- [Pagefind Next.js Issues](https://github.com/CloudCannon/pagefind/issues/341)

---

### 7. Algolia (BEST UX, NOT OPEN SOURCE)

**What it is:** The industry-leading hosted search-as-a-service. Proprietary, but has a free Build tier.

**Strengths:**
- **Best-in-class search UX** -- InstantSearch was created by Algolia
- **Excellent faceting** with automatic facet counts
- **Outstanding multilingual support** including French
- **Built-in search suggestions, did-you-mean, query rules**
- **Zero operational overhead** -- fully managed

**Weaknesses:**
- **Not open source** -- proprietary, vendor lock-in
- **Free tier limitations:** 10,000 search requests/month, 1M records (generous for PoC but costs scale quickly)
- **Pricing scales aggressively** -- Grow plan starts at $0.50/1K search requests + $0.40/1K records
- **No self-hosting option** -- data must live on Algolia's servers (potential issue for Canadian government data residency)
- **No Payload CMS plugin** -- requires custom integration
- **No native PDF extraction** -- same external requirement

**Verdict:** Best UX out of the box, but the lack of self-hosting and data residency concerns for a Canadian government-adjacent organization make it a poor fit. The free tier works for PoC but costs become significant at production scale.

**References:**
- [Algolia Pricing](https://www.algolia.com/pricing)
- [Algolia Pricing Review](https://www.meilisearch.com/blog/algolia-pricing)

---

## Recommendation: Meilisearch

### Why Meilisearch over Typesense

Both are excellent choices. The deciding factors for Meilisearch:

1. **MIT license** vs GPLv3 -- more permissive, no copyleft concerns
2. **Payload CMS plugin exists** and is battle-tested (NouanceLabs)
3. **Simpler architecture** -- schemaless indexing means faster iteration during PoC
4. **Better developer dashboard** for debugging search relevance
5. **Bilingual approach** (one index per language) maps cleanly to FRAS's EN/FR content model
6. **InstantSearch compatibility** gives access to the full widget ecosystem

### Why NOT Typesense

Typesense is the runner-up and would also work well. Choose Typesense if:
- You need HA clustering (Raft consensus) out of the box
- The GPLv3 license is not a concern
- You prefer explicit schemas over schemaless
- The Rubix Studios plugin (v1.2.0, very recent) offers features you specifically need

### Proposed Architecture

```
┌─────────────────────────────────────────────────────┐
│                  Next.js 15 Frontend                │
│  ┌─────────────────────────────────────────────┐    │
│  │  react-instantsearch + instant-meilisearch  │    │
│  │  ┌──────────┐ ┌────────┐ ┌──────────────┐  │    │
│  │  │SearchBox │ │ Facets │ │ Pagination   │  │    │
│  │  │Suggest.  │ │ Counts │ │ HitsPerPage  │  │    │
│  │  │DidYouMean│ │ Filters│ │ SortBy       │  │    │
│  │  └──────────┘ └────────┘ └──────────────┘  │    │
│  └─────────────────────────────────────────────┘    │
└───────────────────────┬─────────────────────────────┘
                        │ Search API (REST)
                        ▼
┌─────────────────────────────────────────────────────┐
│              Meilisearch (Docker)                    │
│  ┌──────────────┐  ┌──────────────┐                 │
│  │ documents_en │  │ documents_fr │                 │
│  │ news_en      │  │ news_fr      │                 │
│  │ events_en    │  │ events_fr    │                 │
│  │ members      │  │ committees   │                 │
│  └──────────────┘  └──────────────┘                 │
└───────────────────────▲─────────────────────────────┘
                        │ Sync (hooks)
                        │
┌─────────────────────────────────────────────────────┐
│           Payload CMS 3.x + PostgreSQL              │
│  ┌──────────────────────────────────────────────┐   │
│  │  payload-meilisearch plugin (NouanceLabs)    │   │
│  │  + Custom afterChange hooks for:             │   │
│  │    - Computed fields (topicAreaName, etc.)    │   │
│  │    - PDF text extraction (pdf-parse)         │   │
│  │    - Word doc extraction (mammoth)           │   │
│  └──────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

### Search UI Feature Mapping

| Requirement | Implementation |
|---|---|
| Search box with suggestions | `<SearchBox>` widget + Meilisearch query suggestions |
| Sort dropdown | `<SortBy>` widget with multiple sort indices |
| Query summary | `<Stats>` widget ("X results for 'query'") |
| Facets with counts | `<RefinementList>` per facet (Board, Content Type, Date Range, Standard, Files & Media) |
| Pagination | `<Pagination>` widget |
| Results per page | `<HitsPerPage>` widget |
| Did-you-mean / fuzzy | Built-in typo tolerance (configurable per index) |
| No-results state | `<EmptyQueryBoundary>` + custom component |
| Date range facet | `<RangeInput>` or custom date picker with Meilisearch filters |

### Estimated Infrastructure Cost (Self-hosted)

- **Meilisearch Docker container:** ~512MB-1GB RAM for 10K documents
- **VPS:** ~$10-20/month (DigitalOcean, Hetzner, or existing infrastructure)
- **Alternative:** Meilisearch Cloud Build plan at $30/month (includes hosting + dashboard)

### Implementation Steps (High-level)

1. Set up Meilisearch Docker container in development
2. Install `payload-meilisearch` plugin, configure collection sync
3. Build custom `afterChange` hooks for computed fields and PDF extraction
4. Create separate EN/FR indices with appropriate settings (stop words, synonyms)
5. Build search page with `react-instantsearch` + `instant-meilisearch`
6. Configure facets, filters, and sorting
7. Test bilingual search, fuzzy matching, and facet counts
8. Performance test with representative dataset

---

## Appendix: Key npm Packages

```json
{
  "dependencies": {
    "@payloadcms/plugin-search": "^3.x",
    "payload-meilisearch": "latest",
    "meilisearch": "^0.44.x",
    "@meilisearch/instant-meilisearch": "^0.21.x",
    "react-instantsearch": "^7.x",
    "pdf-parse": "^1.1.1",
    "mammoth": "^1.8.x"
  }
}
```
