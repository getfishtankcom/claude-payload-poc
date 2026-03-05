---
description: Audit Sitecore/XM Cloud-specific security in Next.js apps. Use for "Sitecore security", "XM Cloud audit", "Context ID check", "Experience Edge security", or "JSS security".
---

# Sitecore-Specific Security Audit

## Quick Reference

Check for:
- Exposed Sitecore API keys
- Context ID exposure
- Preview/editing mode security
- Experience Edge configuration
- Personalization data leaks

## Files to Examine

```
.env* (Sitecore env vars)
lib/sitecore.ts, sitecore-config.ts
src/lib/dictionary-service-factory.ts
src/lib/layout-service-factory.ts
src/lib/sitemap-fetcher.ts
next.config.js (Sitecore rewrites)
middleware.ts
```

## Search Patterns

```bash
# Find Sitecore configuration
grep -r "SITECORE\|sitecoreApiKey\|contextId" --include="*.ts" --include="*.tsx" --include=".env*"

# Find Experience Edge usage
grep -r "edge.sitecorecloud\|EDGE_\|edgeContextId" --include="*.ts"

# Find preview/editing mode
grep -r "preview\|editing\|sc_mode\|sc_site" --include="*.ts"

# Find JSS configuration
grep -r "sitecoreApiHost\|jssEditingSecret" --include="*.ts"

# Find NEXT_PUBLIC_ Sitecore vars
grep -r "NEXT_PUBLIC_SITECORE\|NEXT_PUBLIC.*EDGE" --include=".env*"
```

## Critical Checks

### 1. API Key Exposure
```typescript
// VULNERABLE - API key exposed to client:
const apiKey = process.env.NEXT_PUBLIC_SITECORE_API_KEY;

// SECURE - Server-side only:
const apiKey = process.env.SITECORE_API_KEY;
```

### 2. Context ID Security
```typescript
// Check if Context ID is exposed client-side
// Should be server-side only in most cases
const contextId = process.env.SITECORE_EDGE_CONTEXT_ID; // Secure
```

### 3. Preview Mode Protection
```typescript
// Verify preview mode requires authentication
// Check JSS_EDITING_SECRET is set and validated
if (req.headers["x-editing-secret"] !== process.env.JSS_EDITING_SECRET) {
  return Response.json({ error: "Unauthorized" }, { status: 401 });
}
```

### 4. Experience Edge URLs
```typescript
// Verify HTTPS is used
// Check that edge requests don't leak internal data
const edgeUrl = "https://edge.sitecorecloud.io/..."; // Must be HTTPS
```

## Severity Guidelines

| Finding | Severity |
|---------|----------|
| Sitecore API key in client code | Critical |
| JSS editing secret exposed | Critical |
| Preview mode without auth | High |
| Context ID in NEXT_PUBLIC_ | High |
| Personalization leaking PII | High |
| Missing HTTPS for Edge | Medium |
| Verbose Sitecore errors | Low |

## Common Findings

1. **API key exposure** - NEXT_PUBLIC_ prefix on secrets
2. **Unprotected preview** - Editing mode accessible without auth
3. **Context ID leak** - Exposed in client bundles
4. **Personalization data** - User segments visible in responses
5. **Webhook security** - Publishing webhooks without validation

For detailed patterns and edge cases, see `references/patterns.md`
