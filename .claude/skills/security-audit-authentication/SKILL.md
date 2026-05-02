---
description: Audit authentication and session security in Next.js apps. Use for "check auth security", "token security", "session handling", "NextAuth audit", or "middleware auth check".
---

# Authentication & Session Security Audit

## Quick Reference

Check for:
- Unprotected routes and API endpoints
- Insecure session configuration
- Token exposure in client code
- Missing middleware protection
- Weak authentication flows

## Files to Examine

```
middleware.ts / middleware.js
app/**/layout.tsx (for auth wrappers)
pages/_app.tsx
app/api/auth/[...nextauth]/route.ts
pages/api/auth/[...nextauth].ts
lib/auth.ts, utils/auth.ts
**/session*.ts
```

## Search Patterns

```bash
# Find auth configuration
grep -r "NextAuth\|getServerSession\|useSession" --include="*.ts" --include="*.tsx"

# Find middleware patterns
grep -r "matcher\|middleware" --include="middleware.*"

# Find unprotected API routes
grep -rL "getServerSession\|getToken\|auth()" app/api/ pages/api/

# Find token handling
grep -r "jwt\|accessToken\|refreshToken\|Bearer" --include="*.ts" --include="*.tsx"

# Find session storage
grep -r "localStorage\|sessionStorage" --include="*.ts" --include="*.tsx"
```

## Critical Checks

### 1. Middleware Coverage
- Does `middleware.ts` exist?
- Does the `matcher` config protect all sensitive routes?
- Are API routes included in protection?

### 2. Session Configuration
```typescript
// Check for secure settings in NextAuth config:
session: {
  strategy: "jwt",        // or "database"
  maxAge: 30 * 24 * 60 * 60,  // Should have reasonable limit
}
```

### 3. Token Security
- Tokens should NOT appear in:
  - Client-side localStorage/sessionStorage
  - URL parameters
  - Console.log statements
  - Client components without protection

### 4. API Route Protection
Every API route handling sensitive data must verify authentication:
```typescript
// Required pattern:
const session = await getServerSession(authOptions);
if (!session) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
```

## Severity Guidelines

| Finding | Severity |
|---------|----------|
| API routes without any auth check | Critical |
| Tokens stored in localStorage | High |
| Missing middleware on admin routes | High |
| Session maxAge > 30 days | Medium |
| No CSRF protection on mutations | Medium |
| Session strategy not explicitly set | Low |

## Common Findings

1. **Missing middleware matcher** - Routes accessible without auth
2. **Client-side token storage** - XSS can steal tokens
3. **No session validation in API routes** - Direct API access bypasses UI auth
4. **Overly permissive session duration** - Stale sessions remain valid

For detailed patterns and edge cases, see `references/patterns.md`
