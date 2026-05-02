---
description: Audit security headers configuration in Next.js apps. Use for "check security headers", "CSP audit", "HSTS check", "headers configuration", or "X-Frame-Options".
---

# Security Headers Audit

## Quick Reference

Check for:
- Missing Content-Security-Policy (CSP)
- Missing Strict-Transport-Security (HSTS)
- Missing X-Frame-Options / frame-ancestors
- Missing X-Content-Type-Options
- Overly permissive CORS headers
- Exposed server information

## Files to Examine

```
next.config.js / next.config.mjs
middleware.ts
vercel.json
app/layout.tsx (metadata)
pages/_document.tsx
```

## Search Patterns

```bash
# Find header configuration
grep -r "headers\|securityHeaders\|Content-Security-Policy" next.config.*

# Find CSP in code
grep -r "Content-Security-Policy\|CSP" --include="*.ts" --include="*.tsx"

# Find meta tags
grep -r "http-equiv\|<meta" --include="*.tsx"

# Find middleware headers
grep -r "response.headers\|NextResponse" middleware.*
```

## Critical Checks

### 1. Content-Security-Policy
```javascript
// next.config.js
headers: [
  {
    key: "Content-Security-Policy",
    value: "default-src 'self'; script-src 'self' 'unsafe-inline'..."
  }
]
```

### 2. Strict-Transport-Security
```javascript
{
  key: "Strict-Transport-Security",
  value: "max-age=31536000; includeSubDomains; preload"
}
```

### 3. X-Frame-Options
```javascript
{
  key: "X-Frame-Options",
  value: "DENY" // or SAMEORIGIN
}
```

### 4. X-Content-Type-Options
```javascript
{
  key: "X-Content-Type-Options",
  value: "nosniff"
}
```

### 5. Referrer-Policy
```javascript
{
  key: "Referrer-Policy",
  value: "strict-origin-when-cross-origin"
}
```

## Severity Guidelines

| Finding | Severity |
|---------|----------|
| No CSP at all | High |
| CSP with unsafe-inline + unsafe-eval | High |
| No X-Frame-Options (clickjacking) | Medium |
| No HSTS | Medium |
| No X-Content-Type-Options | Low |
| Missing Referrer-Policy | Low |
| Server header exposed | Info |

## Common Findings

1. **No security headers configured** - Default Next.js has minimal headers
2. **Overly permissive CSP** - `unsafe-inline` and `unsafe-eval` everywhere
3. **Missing HSTS** - HTTPS not enforced
4. **Clickjacking vulnerable** - No frame-ancestors/X-Frame-Options
5. **Headers only on some routes** - Inconsistent configuration

For detailed patterns and edge cases, see `references/patterns.md`
