---
description: Audit OAuth/identity provider security in Next.js apps. Use for "OAuth security", "callback URL audit", "token expiry check", "identity provider audit", or "SSO security".
---

# Identity Provider Security Audit

## Quick Reference

Check for:
- Insecure OAuth callback URLs
- Missing state parameter (CSRF)
- Token lifetime issues
- Improper scope handling
- Open redirects in auth flow

## Files to Examine

```
app/api/auth/[...nextauth]/route.ts
pages/api/auth/[...nextauth].ts
lib/auth.ts, auth.config.ts
.env* (OAuth client IDs/secrets)
middleware.ts
```

## Search Patterns

```bash
# Find OAuth configuration
grep -r "providers\|OAuth\|GoogleProvider\|AzureAD" --include="*.ts"

# Find callback handling
grep -r "callback\|redirect\|signIn" --include="*.ts"

# Find token configuration
grep -r "accessToken\|refreshToken\|idToken\|jwt" --include="*.ts"

# Find scope definitions
grep -r "scope\|authorization" --include="*.ts"

# Find state parameter
grep -r "state\|nonce\|pkce" --include="*.ts"
```

## Critical Checks

### 1. Callback URL Validation
```typescript
// NextAuth callbacks
callbacks: {
  redirect({ url, baseUrl }) {
    // VULNERABLE: Allows any redirect
    return url;

    // SECURE: Validate against baseUrl
    if (url.startsWith(baseUrl)) return url;
    if (url.startsWith("/")) return `${baseUrl}${url}`;
    return baseUrl;
  },
}
```

### 2. State Parameter
NextAuth handles this automatically, but custom OAuth implementations must include:
```typescript
// Generate state on auth start
const state = crypto.randomUUID();
session.set("oauth_state", state);

// Verify state on callback
if (callbackState !== session.get("oauth_state")) {
  throw new Error("Invalid state");
}
```

### 3. Token Lifetime
```typescript
// Check for reasonable token expiry
jwt: {
  maxAge: 60 * 60 * 24, // 24 hours - verify appropriate
},
session: {
  maxAge: 60 * 60 * 24 * 30, // 30 days - may be too long
}
```

### 4. Provider Configuration
```typescript
providers: [
  GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    // Check authorization params
    authorization: {
      params: {
        scope: "openid email profile", // Minimal scopes
        prompt: "consent",
        access_type: "offline",
      },
    },
  }),
]
```

## Severity Guidelines

| Finding | Severity |
|---------|----------|
| Open redirect in callback | Critical |
| Missing state parameter (custom OAuth) | Critical |
| OAuth secrets in client code | Critical |
| Excessive token lifetime (>30 days) | Medium |
| Overly broad OAuth scopes | Medium |
| Missing PKCE for public clients | Medium |

## Common Findings

1. **Open redirect** - Callback accepts any URL
2. **Missing CSRF protection** - No state parameter in custom OAuth
3. **Long-lived tokens** - Sessions valid for months
4. **Scope creep** - Requesting more permissions than needed
5. **Insecure token storage** - Refresh tokens in localStorage

For detailed patterns and edge cases, see `references/patterns.md`
