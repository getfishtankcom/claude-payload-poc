# Layer 5 — Task 5.2: Architecture + Security Audit

> Static-analysis security review of the admin platform built in Layers 0–4.
> Methodology: read-through of access control, hooks, API routes, and
> middleware for the OWASP top-10 categories.

## Verdict

| Category | Risk | Count |
|---|---|---|
| Access control / IDOR | medium | 2 findings |
| Authentication / Session | low | 0 findings |
| Input validation / XSS | medium | 2 findings |
| SSRF / outbound | low | 1 finding |
| Secrets handling | low | 0 findings |
| Logging / error disclosure | low | 1 finding |
| API + CORS | low | 0 findings |
| Dependencies | medium | 1 finding |

## Findings

### A1 — Access control (medium)

**A1.1 Notifications collection update access permits unaudited fields.**
`src/collections/Notifications.ts` allows recipient to update their own notifications, intended for `read=true`. There's no field-level guard, so a malicious client could PATCH `message`, `link`, or `recipient`. Add `update`-time field access:
```ts
fields: [
  { name: 'recipient', type: 'relationship', relationTo: 'users', required: true,
    access: { update: ({ req: { user } }) => (user as { role?: string })?.role === 'admin' } },
  { name: 'message',  access: { update: ({ req: { user } }) => (user as { role?: string })?.role === 'admin' } },
  // …same for link, type
  { name: 'read', /* no field-level update guard — by design */ },
]
```

**A1.2 Redirects collection has no role gate.**
`src/collections/Redirects.ts` declares zero access functions, falling through to Payload defaults (anyone authenticated). Editors should NOT be able to mint arbitrary redirects (e.g. `/about → /attacker.com`). Wire `access.create` and `access.update` to `isEditorOrAbove`, `access.delete` to `isAdmin`.

### A3 — Input validation / XSS (medium)

**A3.1 Preview iframe HTML is server-rendered with template-string interpolation.**
`src/app/api/preview/route.ts` builds an HTML response by string concatenation. The route validates the secret AND escapes via the inline `escapeHtml` helper, but the helper isn't applied uniformly to the static script body. Audit: every interpolation that uses `+ x +` already calls `escapeHtml`; verify on every future change. Consider switching to a JSX renderer or a templating library.

**A3.2 Redirect `to` value is rendered into a redirect URL without scheme validation.**
`src/middleware.ts` does:
```ts
const target = rule.to.startsWith('http') ? rule.to : new URL(rule.to, req.nextUrl.origin).toString()
```
Any string starting with `http` is forwarded — including `http://attacker.com`. Add an allowlist check or only allow same-origin redirects unless an `external: true` flag is set on the rule:
```ts
const isExternal = /^https?:\/\//i.test(rule.to)
if (isExternal && !rule.external) return // refuse open-redirect
```

### A5 — SSRF / outbound (low)

**A5.1 `loadRedirects` fetches its own server URL.**
`src/lib/redirects.ts` uses `process.env.NEXT_PUBLIC_SERVER_URL ?? req.nextUrl.origin`. If `NEXT_PUBLIC_SERVER_URL` is mis-configured (typo, leading whitespace), the middleware will silently fall back to the request origin and could fetch from an attacker-controlled host in misconfigured deployments. Mitigations: hard-fail on bad env var; pin to localhost in middleware.

### A9 — Logging / error disclosure (low)

**A9.1 `req.payload.logger.error` strings include doc IDs.**
`src/admin/hooks/workflow-hooks.ts` logs `${doc.id}` and `${err}` directly. Doc IDs are usually low-sensitivity but `err.message` may contain internal paths or stack frames. Wrap with structured logger that strips internal stack frames in production.

### A6 — Vulnerable / outdated components (medium)

`npm install --legacy-peer-deps` is being used in this repo. The Payload upgrade (Task 0.1) flagged 26 vulnerabilities (17 moderate, 7 high, 2 critical). Run `npm audit` in CI and fail builds on high-severity issues. Highest priority dependencies to review: any with critical advisories.

## Architecture findings

- **`/api/preview` does not enforce that `id` corresponds to a real page** — currently returns the same shell for any ID. Validate against Payload before rendering to avoid information leakage about which IDs exist.
- **No CSRF tokens on admin POST endpoints** — Payload's session is cookie-based and the platform relies on SameSite. Document this; add CSRF tokens if any cross-origin requests become valid.
- **Workflow afterChange notifications fan out via `Promise.allSettled`** — good. But there's no rate-limit. A bulk Workbox transition over 100 items × N reviewers could create N×100 notifications in one request. Consider batching.

## Action items by priority

1. **Now (P0):** Fix A1.2 (Redirects access) and A3.2 (open-redirect via redirect rule).
2. **Before launch (P1):** Fix A1.1 (Notifications field guards), run `npm audit` and resolve criticals.
3. **Hardening (P2):** A3.1 audit cadence, A5.1 env validation, A9.1 logger stripping.

## Sign-off

This is a **static analysis** review. Pair with a runtime DAST scan (e.g. ZAP) before production launch. The platform is structurally sound; the highest-risk findings are configuration-level rather than design-level.
