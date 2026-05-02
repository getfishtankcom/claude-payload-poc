---
description: Audit SSRF (Server-Side Request Forgery) prevention in Next.js apps. Use for "SSRF check", "fetch security", "URL validation", "webhook security", or "server-side request audit".
---

# SSRF Prevention Audit

## Quick Reference

Check for:
- User-controlled URLs in fetch/axios calls
- Webhook endpoints accepting arbitrary URLs
- Image/file proxy endpoints
- URL redirect handlers
- Internal service exposure

## Files to Examine

```
app/api/**/route.ts
pages/api/**/*.ts
lib/http.ts, utils/fetch.ts
**/proxy*.ts
**/webhook*.ts
**/image*.ts (Next.js image optimization)
next.config.js (images.remotePatterns)
```

## Search Patterns

```bash
# Find fetch with dynamic URLs
grep -r "fetch\(\|axios\.\|got\(\|request\(" --include="*.ts" -A2

# Find URL from request body/query
grep -r "\.url\|\.href\|\.endpoint" --include="*.ts"

# Find webhook handlers
grep -r "webhook\|callback.*url\|notify.*url" --include="*.ts"

# Find URL construction
grep -r "new URL\|url.parse\|URL.parse" --include="*.ts"

# Find proxy patterns
grep -r "proxy\|forward\|relay" --include="*.ts"
```

## Critical Checks

### 1. User-Controlled URLs
```typescript
// VULNERABLE:
export async function POST(request: Request) {
  const { url } = await request.json();
  const response = await fetch(url); // SSRF!
}

// SECURE:
const ALLOWED_HOSTS = ["api.trusted.com"];
export async function POST(request: Request) {
  const { url } = await request.json();
  const parsed = new URL(url);
  if (!ALLOWED_HOSTS.includes(parsed.hostname)) {
    return Response.json({ error: "Invalid URL" }, { status: 400 });
  }
  // Additional: block private IPs
}
```

### 2. Private IP Blocking
```typescript
// Must block internal networks:
// - 127.0.0.0/8 (localhost)
// - 10.0.0.0/8 (private)
// - 172.16.0.0/12 (private)
// - 192.168.0.0/16 (private)
// - 169.254.0.0/16 (link-local)
// - ::1 (IPv6 localhost)
```

### 3. Webhook Validation
```typescript
// Webhooks must validate callback URLs
// Don't allow internal URLs as webhook targets
```

### 4. Image Proxy
```typescript
// next.config.js must restrict image sources
module.exports = {
  images: {
    remotePatterns: [
      { hostname: "cdn.example.com" }, // Specific, not wildcard
    ],
  },
};
```

## Severity Guidelines

| Finding | Severity |
|---------|----------|
| Unrestricted fetch with user URL | Critical |
| Can reach internal services | Critical |
| Webhook accepts any callback URL | High |
| No private IP blocking | High |
| Overly broad image remotePatterns | Medium |
| URL validation bypassable | Medium |

## Common Findings

1. **Direct URL passthrough** - User URL fetched without validation
2. **DNS rebinding possible** - Only hostname checked, not resolved IP
3. **Protocol confusion** - `file://`, `gopher://` not blocked
4. **Internal metadata exposure** - Cloud metadata endpoints accessible
5. **Redirect following** - Validated URL redirects to internal

For detailed patterns and edge cases, see `references/patterns.md`
