---
description: Audit secrets management in Next.js apps. Use for "check secrets", "exposed credentials", "hardcoded secrets", "env file security", "NEXT_PUBLIC_ audit", or "API key exposure".
---

# Secrets Management Audit

## Quick Reference

Check for:
- Hardcoded credentials in source code
- Secrets in NEXT_PUBLIC_* variables
- .env files committed to git
- API keys in client-side code
- Secrets in build logs/artifacts

## Files to Examine

```
.env, .env.local, .env.production, .env.*
.gitignore (check .env is listed)
next.config.js (env section)
app/**/page.tsx, components/**/*.tsx
lib/config.ts, utils/constants.ts
vercel.json, netlify.toml
```

## Search Patterns

```bash
# Find NEXT_PUBLIC_ variables
grep -r "NEXT_PUBLIC_" --include="*.ts" --include="*.tsx" --include=".env*"

# Find potential secrets
grep -r "password\|secret\|apikey\|api_key\|token\|credential" --include="*.ts" -i

# Find hardcoded strings that look like secrets
grep -rE "(sk_|pk_|api_|key_)[a-zA-Z0-9]{20,}" --include="*.ts" --include="*.tsx"

# Find AWS keys
grep -rE "AKIA[0-9A-Z]{16}" --include="*.ts" --include="*.tsx" --include=".env*"

# Find private keys
grep -r "BEGIN.*PRIVATE KEY" --include="*.ts" --include="*.tsx" --include="*.pem"

# Check .gitignore
cat .gitignore | grep -E "\.env|secret|key"
```

## Critical Checks

### 1. NEXT_PUBLIC_* Exposure
```typescript
// VULNERABLE - Secret exposed to browser:
const apiKey = process.env.NEXT_PUBLIC_API_SECRET_KEY;

// SECURE - Server-only:
const apiKey = process.env.API_SECRET_KEY; // No NEXT_PUBLIC_ prefix
```

### 2. .env in Git
```bash
# Check if .env files are tracked
git ls-files | grep -E "\.env"

# Check git history for secrets
git log -p --all -S "password" --source
```

### 3. Hardcoded Credentials
```typescript
// VULNERABLE:
const db = mysql.connect({
  password: "production_password_123",
});

// SECURE:
const db = mysql.connect({
  password: process.env.DB_PASSWORD,
});
```

### 4. Client Component Access
```typescript
// Server Component - OK
const secret = process.env.SECRET_KEY;

// Client Component - NEVER access secrets
"use client";
// process.env.SECRET_KEY is undefined here (correctly)
// But check for workarounds that expose it
```

## Severity Guidelines

| Finding | Severity |
|---------|----------|
| Production credentials in code | Critical |
| API keys in NEXT_PUBLIC_* | Critical |
| .env files in git | Critical |
| Secrets in git history | High |
| Hardcoded test credentials | Medium |
| Missing .gitignore for .env | Medium |
| Secrets in error messages | Medium |

## Common Findings

1. **NEXT_PUBLIC_ misuse** - Developers expose backend secrets
2. **Git history exposure** - .env was committed, then gitignored
3. **Hardcoded in constants** - "Temporary" credentials never removed
4. **Build-time exposure** - Secrets in CI/CD logs
5. **Third-party keys** - Stripe, Firebase keys in client code

For detailed patterns and edge cases, see `references/patterns.md`
