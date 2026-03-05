# CI/CD Security - Detailed Patterns

## GitHub Actions Security

### Secure Workflow Template
```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

# Minimal permissions at workflow level
permissions:
  contents: read

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      # Pin to commit SHA
      - uses: actions/checkout@b4ffde65f46336ab88eb53be808477a3936bae11 # v4.1.1

      - uses: actions/setup-node@60edb5dd545a775178f52524783378180af0d1f8 # v4.0.2
        with:
          node-version: "20"
          cache: "npm"

      - run: npm ci
      - run: npm run build
      - run: npm test
```

### Dangerous Patterns

#### Exposed Secrets
```yaml
# CRITICAL - Secret exposed in logs
- run: |
    echo "API_KEY=${{ secrets.API_KEY }}"
    curl -H "Authorization: ${{ secrets.TOKEN }}" https://api.com

# CRITICAL - Secret in command line visible in process list
- run: node script.js --api-key=${{ secrets.API_KEY }}

# SECURE - Pass via environment
- run: node script.js
  env:
    API_KEY: ${{ secrets.API_KEY }}
```

#### Overly Broad Permissions
```yaml
# DANGEROUS - Full write access
permissions: write-all

# DANGEROUS - Unnecessary permissions
permissions:
  contents: write
  packages: write
  deployments: write
  id-token: write

# SECURE - Minimal required
permissions:
  contents: read
  pull-requests: write  # Only if needed
```

### Pull Request Security

#### Vulnerable: pull_request_target
```yaml
# DANGEROUS for public repos
# Attacker's PR code runs with repo secrets!
on:
  pull_request_target:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          ref: ${{ github.event.pull_request.head.sha }}  # Checks out attacker's code!
      - run: npm ci && npm run build  # Runs attacker's package.json scripts
        env:
          SECRET: ${{ secrets.DEPLOY_KEY }}  # With access to secrets!
```

#### Secure: Separate Trusted/Untrusted
```yaml
# Run untrusted code WITHOUT secrets
name: PR Build
on: pull_request

jobs:
  build:
    runs-on: ubuntu-latest
    permissions:
      contents: read
    steps:
      - uses: actions/checkout@v4
      - run: npm ci && npm run build && npm test
      # No secrets available here

# Separate workflow for deployment (trusted)
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: production  # Requires approval
    steps:
      - uses: actions/checkout@v4
      - run: npm ci && npm run deploy
        env:
          DEPLOY_KEY: ${{ secrets.DEPLOY_KEY }}
```

### Action Pinning

```yaml
# RISKY - Mutable references
- uses: actions/checkout@main    # Can change anytime
- uses: actions/checkout@v4      # Can change within v4
- uses: some-org/action@master   # Third-party, mutable

# SECURE - Pinned to commit SHA
- uses: actions/checkout@b4ffde65f46336ab88eb53be808477a3936bae11 # v4.1.1
- uses: actions/setup-node@60edb5dd545a775178f52524783378180af0d1f8 # v4.0.2

# How to find SHA for a tag:
# git ls-remote https://github.com/actions/checkout | grep v4.1.1
```

### Environment Protection

```yaml
jobs:
  deploy-staging:
    runs-on: ubuntu-latest
    environment: staging  # Requires environment secrets

  deploy-production:
    runs-on: ubuntu-latest
    environment: production  # Different environment, different secrets
    needs: deploy-staging    # Sequential deployment
```

## Vercel Security

### vercel.json Security
```json
{
  "github": {
    "enabled": true,
    "silent": false
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Frame-Options", "value": "DENY" }
      ]
    }
  ],
  "env": {
    "DATABASE_URL": "@database-url"  // Use Vercel secrets
  }
}
```

### Vercel Environment Variables
```bash
# DON'T commit secrets
# DO use Vercel dashboard or CLI

vercel env add DATABASE_URL production
vercel env add DATABASE_URL preview
vercel env add DATABASE_URL development

# Verify no secrets in repo
grep -r "DATABASE_URL=postgres" . --include="*.env*"
```

### Preview Deployment Security
```javascript
// next.config.js - Restrict previews
module.exports = {
  async headers() {
    // Add auth to preview deployments
    if (process.env.VERCEL_ENV === "preview") {
      return [
        {
          source: "/:path*",
          headers: [
            { key: "X-Robots-Tag", value: "noindex" },
          ],
        },
      ];
    }
    return [];
  },
};
```

## CODEOWNERS

```
# .github/CODEOWNERS
# Require review for sensitive files

# Security-sensitive
/.github/workflows/ @security-team
/package.json @security-team
/package-lock.json @security-team

# Infrastructure
/vercel.json @devops-team
/next.config.js @senior-devs
```

## Branch Protection

### Required Settings
```yaml
# Configure via GitHub UI or API:
branches:
  - name: main
    protection:
      required_pull_request_reviews:
        required_approving_review_count: 1
        dismiss_stale_reviews: true
      required_status_checks:
        strict: true
        contexts:
          - "build"
          - "test"
      enforce_admins: true
      required_linear_history: true
      allow_force_pushes: false
      allow_deletions: false
```

## Artifact Security

### Don't Upload Secrets
```yaml
- name: Build
  run: npm run build

# DANGEROUS - May contain env vars
- uses: actions/upload-artifact@v4
  with:
    name: build
    path: .next/

# SAFER - Only upload necessary files
- uses: actions/upload-artifact@v4
  with:
    name: build
    path: |
      .next/static
      public/
```

### Artifact Retention
```yaml
- uses: actions/upload-artifact@v4
  with:
    name: build
    path: dist/
    retention-days: 1  # Short retention
```

## Docker Security

### Dockerfile Best Practices
```dockerfile
# Use specific versions
FROM node:20-alpine AS builder

# Don't run as root
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Copy only necessary files
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

# Don't expose secrets in build args
# Use runtime environment variables instead
```

### Docker Secrets
```yaml
# docker-compose.yml
services:
  app:
    build: .
    secrets:
      - db_password
    environment:
      DB_PASSWORD_FILE: /run/secrets/db_password

secrets:
  db_password:
    file: ./secrets/db_password.txt  # Not in repo!
```

## Dependency Caching Security

```yaml
# Cache can be poisoned if not careful
- uses: actions/cache@v4
  with:
    path: ~/.npm
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
    # Key is based on lockfile hash - safe

# RISKY - Key doesn't include lockfile
- uses: actions/cache@v4
  with:
    path: node_modules
    key: ${{ runner.os }}-modules  # Could restore wrong versions!
```

## Audit Workflow

### Security Scanning in CI
```yaml
name: Security Scan
on:
  push:
    branches: [main]
  schedule:
    - cron: "0 0 * * *"  # Daily

jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: npm audit
        run: npm audit --audit-level=high

      - name: Check for secrets
        uses: trufflesecurity/trufflehog@main
        with:
          path: ./
          base: main
```

## OWASP Mapping

- **A05:2021 Security Misconfiguration** - CI/CD misconfigurations
- **A09:2021 Security Logging and Monitoring** - CI/CD logging

## Testing CI/CD Security

```bash
# Check for exposed secrets in history
git log -p | grep -E "(api[_-]?key|password|secret)" -i

# Check workflow permissions
cat .github/workflows/*.yml | grep -A5 "permissions:"

# Verify action versions
cat .github/workflows/*.yml | grep "uses:" | sort | uniq
```
