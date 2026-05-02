---
description: Audit API security and encryption in Next.js apps. Use for "API security", "TLS check", "HTTPS enforcement", "encryption audit", or "third-party API security".
---

# API & Encryption Security Audit

## Quick Reference

Check for:
- HTTP (not HTTPS) API calls
- Missing TLS verification
- Weak encryption algorithms
- Credentials in API requests
- Insecure third-party API usage

## Files to Examine

```
lib/api.ts, utils/http.ts
app/api/**/route.ts
pages/api/**/*.ts
services/**/*.ts
next.config.js (rewrites/redirects)
```

## Search Patterns

```bash
# Find HTTP URLs (not HTTPS)
grep -rE "http://[^l]" --include="*.ts" --include="*.tsx" | grep -v localhost

# Find fetch/axios calls
grep -r "fetch\(\|axios\." --include="*.ts" -A3

# Find TLS/SSL configuration
grep -r "rejectUnauthorized\|NODE_TLS_REJECT" --include="*.ts"

# Find encryption usage
grep -r "crypto\|encrypt\|decrypt\|cipher" --include="*.ts"

# Find API key in headers
grep -r "Authorization\|x-api-key\|Bearer" --include="*.ts"
```

## Critical Checks

### 1. HTTPS Enforcement
```typescript
// VULNERABLE:
const response = await fetch("http://api.example.com/data");

// SECURE:
const response = await fetch("https://api.example.com/data");
```

### 2. TLS Verification
```typescript
// VULNERABLE - Disables certificate verification:
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// VULNERABLE:
const agent = new https.Agent({ rejectUnauthorized: false });
```

### 3. Credential Handling
```typescript
// SECURE - Credentials server-side only:
export async function GET() {
  const response = await fetch("https://api.example.com/data", {
    headers: {
      Authorization: `Bearer ${process.env.API_KEY}`,
    },
  });
}
```

### 4. Encryption Algorithms
```typescript
// VULNERABLE - Weak algorithms:
crypto.createCipher("des", key);
crypto.createHash("md5");

// SECURE:
crypto.createCipheriv("aes-256-gcm", key, iv);
crypto.createHash("sha256");
```

## Severity Guidelines

| Finding | Severity |
|---------|----------|
| API credentials in client code | Critical |
| TLS verification disabled | Critical |
| HTTP used for sensitive data | High |
| Weak encryption (DES, MD5) | High |
| Missing HTTPS redirect | Medium |
| Hardcoded API endpoints | Low |

## Common Findings

1. **HTTP in production** - Non-encrypted API calls
2. **Disabled TLS verification** - "Quick fix" that disables security
3. **Client-side API keys** - Keys exposed in browser
4. **Weak hashing** - MD5/SHA1 for passwords
5. **No certificate pinning** - Vulnerable to MITM

For detailed patterns and edge cases, see `references/patterns.md`
