# Secrets Management - Detailed Patterns

## Next.js Environment Variable Behavior

### Server vs Client Variables
```
# .env.local

# Server-only (not exposed to browser)
DATABASE_URL=postgres://user:pass@host/db
API_SECRET_KEY=sk_live_xxxxx
NEXTAUTH_SECRET=random_32_char_string

# Client-accessible (exposed in browser bundle)
NEXT_PUBLIC_API_URL=https://api.example.com
NEXT_PUBLIC_SITE_NAME=My App
```

### How Exposure Happens
```typescript
// next.config.js - DANGEROUS pattern
module.exports = {
  env: {
    // This exposes to client!
    API_SECRET: process.env.API_SECRET,
  },
};

// Correct: Only expose public values
module.exports = {
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
};
```

## Detecting Exposed Secrets

### Common Secret Patterns
```bash
# AWS Access Key ID
grep -rE "AKIA[0-9A-Z]{16}" .

# AWS Secret Access Key
grep -rE "[0-9a-zA-Z/+]{40}" .

# Generic API Key
grep -rE "(api[_-]?key|apikey)['\"]?\s*[:=]\s*['\"]?[a-zA-Z0-9]{20,}" . -i

# Generic Secret
grep -rE "(secret|password|passwd|pwd)['\"]?\s*[:=]\s*['\"][^'\"]{8,}" . -i

# Private Key
grep -rE "-----BEGIN (RSA |EC |DSA |OPENSSH )?PRIVATE KEY-----" .

# JWT
grep -rE "eyJ[a-zA-Z0-9_-]*\.eyJ[a-zA-Z0-9_-]*\.[a-zA-Z0-9_-]*" .

# Stripe Keys
grep -rE "(sk|pk)_(test|live)_[0-9a-zA-Z]{24,}" .

# GitHub Token
grep -rE "(ghp|gho|ghu|ghs|ghr)_[a-zA-Z0-9]{36}" .

# Slack Token
grep -rE "xox[baprs]-[0-9]+-[0-9]+-[a-zA-Z0-9]+" .
```

### Dangerous NEXT_PUBLIC_ Variables
```bash
# These should NEVER be NEXT_PUBLIC_:
grep -rE "NEXT_PUBLIC_.*(SECRET|PASSWORD|PRIVATE|TOKEN|KEY)" --include=".env*"

# Common mistakes:
NEXT_PUBLIC_DATABASE_URL       # CRITICAL
NEXT_PUBLIC_SECRET_KEY         # CRITICAL
NEXT_PUBLIC_STRIPE_SECRET_KEY  # CRITICAL
NEXT_PUBLIC_API_SECRET         # CRITICAL
NEXT_PUBLIC_NEXTAUTH_SECRET    # CRITICAL
```

## Git History Secrets

### Finding Secrets in History
```bash
# Search commit diffs for patterns
git log -p --all -S "password" -- "*.ts" "*.tsx" "*.env*"
git log -p --all -S "AKIA" -- .
git log -p --all -S "sk_live" -- .

# Using git-secrets (if installed)
git secrets --scan-history

# Using truffleHog (if installed)
trufflehog git file://. --only-verified
```

### Cleaning History (If Secrets Found)
```bash
# Option 1: BFG Repo Cleaner (recommended)
bfg --delete-files .env
bfg --replace-text secrets.txt

# Option 2: git-filter-repo
git filter-repo --path .env --invert-paths

# After cleaning, force push and rotate ALL exposed secrets
```

## Secure Secret Patterns

### Server-Only API Route
```typescript
// app/api/external/route.ts
export async function GET() {
  // Safe: process.env accessed server-side only
  const response = await fetch("https://api.example.com/data", {
    headers: {
      Authorization: `Bearer ${process.env.EXTERNAL_API_KEY}`,
    },
  });
  return Response.json(await response.json());
}
```

### Server Component
```typescript
// app/dashboard/page.tsx (Server Component by default)
export default async function DashboardPage() {
  // Safe: Server component, not exposed to client
  const data = await fetchWithSecret(process.env.API_KEY);
  return <Dashboard data={data} />;
}
```

### Runtime Environment Check
```typescript
// lib/config.ts
function getServerSecret(name: string): string {
  if (typeof window !== "undefined") {
    throw new Error(`Cannot access ${name} on client`);
  }
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

export const config = {
  dbUrl: getServerSecret("DATABASE_URL"),
  apiKey: getServerSecret("API_SECRET_KEY"),
};
```

## Environment File Security

### Proper .gitignore
```gitignore
# Environment files
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
.env*.local

# IDE secrets
.idea/
.vscode/settings.json

# Build output (may contain inlined secrets)
.next/
out/
```

### Environment File Template
```bash
# .env.example (commit this, not actual .env)
DATABASE_URL=
API_SECRET_KEY=
NEXTAUTH_SECRET=
NEXT_PUBLIC_API_URL=
```

## Build-Time Exposure

### CI/CD Leakage
```yaml
# VULNERABLE GitHub Actions
- run: echo "Deploying with ${{ secrets.API_KEY }}"  # Logged!

# SECURE
- run: deploy
  env:
    API_KEY: ${{ secrets.API_KEY }}  # Not echoed
```

### Vercel Environment Variables
```
# In Vercel Dashboard, mark sensitive vars as:
# - "Sensitive" (masked in logs)
# - Appropriate environment (Production/Preview/Development)
```

## Third-Party Service Keys

### Keys That Must Be Server-Only
| Service | Server-Only Variable |
|---------|---------------------|
| Stripe | `STRIPE_SECRET_KEY` |
| AWS | `AWS_SECRET_ACCESS_KEY` |
| Database | `DATABASE_URL` |
| Auth | `NEXTAUTH_SECRET` |
| Email | `SENDGRID_API_KEY` |
| Sitecore | `SITECORE_API_KEY` |

### Keys Safe for Client
| Service | Client Variable |
|---------|-----------------|
| Stripe | `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` |
| Google Maps | `NEXT_PUBLIC_GOOGLE_MAPS_KEY` (with restrictions) |
| Analytics | `NEXT_PUBLIC_GA_ID` |

## Sitecore-Specific Secrets

### Sitecore Environment Variables
```bash
# NEVER expose these:
SITECORE_API_KEY=
SITECORE_EDGE_CONTEXT_ID=  # Should be server-only
JSS_EDITING_SECRET=
SITECORE_DEPLOYMENT_SECRET=

# Safe for client (public data only):
NEXT_PUBLIC_SITECORE_API_HOST=
NEXT_PUBLIC_SITECORE_SITE_NAME=
```

### Experience Edge Configuration
```typescript
// lib/sitecore.ts
// Keep these server-side
const config = {
  sitecoreApiKey: process.env.SITECORE_API_KEY,
  sitecoreApiHost: process.env.SITECORE_API_HOST,
  sitecoreEdgeContextId: process.env.SITECORE_EDGE_CONTEXT_ID,
};

// Don't export directly to client components
export async function fetchSitecoreData(query: string) {
  // Use credentials server-side only
}
```

## Secret Rotation Checklist

When a secret is exposed:
1. **Immediately** rotate/regenerate the credential
2. Update all environments (production, staging, local)
3. If in git history, clean history AND rotate
4. Check logs for unauthorized access during exposure window
5. Consider breach notification requirements

## Automated Secret Scanning

### Pre-commit Hook
```bash
# .husky/pre-commit
#!/bin/sh
# Check for secrets before commit
if git diff --cached --name-only | xargs grep -l -E "(sk_live|AKIA|password\s*=)" 2>/dev/null; then
  echo "Potential secret detected! Aborting commit."
  exit 1
fi
```

### GitHub Secret Scanning
Enable in repository settings:
- Settings → Security → Code security and analysis
- Enable "Secret scanning"
- Enable "Push protection"

## OWASP Mapping

- **A02:2021 Cryptographic Failures** - Exposure of sensitive data
- **A05:2021 Security Misconfiguration** - Secrets in version control
