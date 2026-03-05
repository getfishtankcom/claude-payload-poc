---
description: Audit CORS configuration and rate limiting in Next.js apps. Use for "CORS audit", "rate limiting check", "origin validation", "API abuse prevention", or "cross-origin security".
---

# CORS & Rate Limiting Audit

## Quick Reference

Check for:
- Overly permissive CORS (Allow-Origin: *)
- Missing rate limiting on APIs
- Credential leakage via CORS
- Missing origin validation
- No abuse prevention

## Files to Examine

```
app/api/**/route.ts
pages/api/**/*.ts
middleware.ts
next.config.js
lib/rate-limit.ts
vercel.json
```

## Search Patterns

```bash
# Find CORS headers
grep -r "Access-Control\|cors\|Origin" --include="*.ts"

# Find rate limiting
grep -r "rateLimit\|throttle\|limiter" --include="*.ts"

# Find wildcard origins
grep -r '"\*"\|'"'"'\*'"'" --include="*.ts" | grep -i origin

# Find credential headers
grep -r "credentials\|withCredentials" --include="*.ts"
```

## Critical Checks

### 1. CORS Origin Validation
```typescript
// VULNERABLE - Allows all origins:
headers: {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Credentials": "true", // Dangerous with *
}

// SECURE - Specific origins:
const ALLOWED_ORIGINS = ["https://app.example.com"];
const origin = request.headers.get("Origin");
if (ALLOWED_ORIGINS.includes(origin)) {
  headers.set("Access-Control-Allow-Origin", origin);
}
```

### 2. Rate Limiting
```typescript
// Required for all public APIs
import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
});
```

### 3. Preflight Handling
```typescript
// Handle OPTIONS requests properly
export async function OPTIONS(request: Request) {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Methods": "GET, POST",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Max-Age": "86400",
    },
  });
}
```

## Severity Guidelines

| Finding | Severity |
|---------|----------|
| CORS: * with credentials | Critical |
| No rate limiting on auth endpoints | High |
| CORS origin reflects request header | High |
| No rate limiting on any API | Medium |
| Missing preflight handling | Low |
| Overly long preflight cache | Low |

## Common Findings

1. **Wildcard CORS** - Allow-Origin: * in production
2. **Reflected origin** - Origin header echoed without validation
3. **No rate limiting** - APIs can be hammered unlimited
4. **Credentials with wildcard** - Allows credential theft
5. **Missing abuse detection** - No blocking of suspicious IPs

For detailed patterns and edge cases, see `references/patterns.md`
