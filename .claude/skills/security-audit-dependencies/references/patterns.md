# Dependency Security - Detailed Patterns

## Running Security Audits

### npm Audit
```bash
# Basic audit
npm audit

# Audit with fix suggestions
npm audit fix

# Audit only production dependencies
npm audit --omit=dev

# JSON output for parsing
npm audit --json

# Specific severity level
npm audit --audit-level=moderate
```

### Yarn Audit
```bash
# Yarn v1
yarn audit

# Yarn v2+ (Berry)
yarn npm audit
```

### pnpm Audit
```bash
pnpm audit

# Fix vulnerabilities
pnpm audit --fix
```

## Interpreting Audit Results

### Severity Levels
| Level | Action Required |
|-------|-----------------|
| Critical | Immediate fix required |
| High | Fix within days |
| Moderate | Fix within sprint |
| Low | Fix when convenient |

### Sample Audit Output
```
┌───────────────┬──────────────────────────────────────────────────────────────┐
│ Critical      │ Prototype Pollution in lodash                                │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Package       │ lodash                                                       │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Patched in    │ >=4.17.21                                                    │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Dependency of │ some-package                                                 │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Path          │ some-package > another-package > lodash                      │
└───────────────┴──────────────────────────────────────────────────────────────┘
```

## Fixing Vulnerabilities

### Direct Dependencies
```bash
# Update to latest
npm update package-name

# Update to specific version
npm install package-name@4.17.21

# Force major version update
npm install package-name@latest
```

### Transitive Dependencies
```bash
# npm v8.3+: Override transitive dependency
# Add to package.json:
{
  "overrides": {
    "lodash": "^4.17.21"
  }
}

# Yarn resolutions
{
  "resolutions": {
    "lodash": "^4.17.21"
  }
}

# pnpm overrides
{
  "pnpm": {
    "overrides": {
      "lodash": "^4.17.21"
    }
  }
}
```

### When Updates Aren't Available
```bash
# Check if vulnerability applies
# Read the advisory to understand:
# 1. Is this vulnerability exploitable in your usage?
# 2. Can you patch or workaround?

# Consider alternatives
npm search alternative-package

# Or, if risk is acceptable, document and track
```

## Lock File Security

### Why Lock Files Matter
```bash
# Without lockfile, these could install different versions:
npm install  # Developer A: lodash@4.17.20
npm install  # Developer B: lodash@4.17.21
npm install  # CI: lodash@4.17.19 (vulnerable!)

# With lockfile, everyone gets the same version
```

### Lockfile Integrity
```bash
# Verify package integrity (npm)
npm ci  # Installs from lockfile, fails if mismatched

# Yarn integrity check
yarn install --frozen-lockfile

# pnpm integrity
pnpm install --frozen-lockfile
```

### Lockfile Best Practices
```gitignore
# DO commit:
package-lock.json  # npm
yarn.lock          # yarn
pnpm-lock.yaml     # pnpm

# DON'T commit:
node_modules/
```

## Supply Chain Attacks

### Common Attack Vectors

#### 1. Typosquatting
```bash
# Attacker publishes:
npm install lodahs    # typo of "lodash"
npm install electorn  # typo of "electron"

# Prevention:
# - Double-check package names
# - Use npm config set ignore-scripts true
# - Review before install
```

#### 2. Dependency Confusion
```bash
# Attacker publishes public package matching internal name
# Prevention:
# - Use scoped packages: @mycompany/package-name
# - Configure npm registry properly
```

#### 3. Maintainer Account Compromise
```bash
# Popular package maintainer's npm account compromised
# Malicious version published

# Prevention:
# - Pin exact versions for critical packages
# - Use lockfiles
# - Monitor npm advisories
```

### .npmrc Security
```ini
# .npmrc

# Disable install scripts (prevents malicious postinstall)
ignore-scripts=true

# Use organization scope registry
@mycompany:registry=https://npm.mycompany.com/

# Audit on install
audit=true

# Exact versions (optional, more secure but harder to update)
save-exact=true
```

## Checking for Unused Dependencies

### Using depcheck
```bash
npm install -g depcheck
depcheck

# Output shows:
# - Unused dependencies
# - Missing dependencies
# - Unused devDependencies
```

### Manual Check
```bash
# List all dependencies
npm ls

# Search for imports
grep -r "from 'package-name'\|require('package-name')" --include="*.ts" --include="*.tsx" src/
```

## Vulnerable Package Patterns

### Known Risky Patterns
```javascript
// Prototype Pollution (many packages affected)
const obj = {};
obj.__proto__.polluted = true;

// RegExp DoS (ReDoS)
const regex = /^([a-zA-Z0-9]+)*$/;  // Evil regex

// Path Traversal
const file = path.join(baseDir, userInput);  // If userInput has ../
```

### Packages to Watch
- Any package with low downloads but critical functionality
- Packages with single maintainer
- Packages not updated in years
- Forks of popular packages

## Automated Security Scanning

### GitHub Dependabot
```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    groups:
      security:
        applies-to: security-updates
```

### Snyk Integration
```bash
# Install Snyk CLI
npm install -g snyk

# Test for vulnerabilities
snyk test

# Monitor continuously
snyk monitor
```

### Socket.dev
```bash
# Install Socket CLI
npm install -g @socketsecurity/cli

# Scan dependencies
socket npm info
```

## Package.json Best Practices

### Version Pinning
```json
{
  "dependencies": {
    // Risky: accepts any minor/patch
    "lodash": "^4.17.0",

    // Safer: accepts only patches
    "express": "~4.18.2",

    // Safest: exact version
    "next": "14.0.4"
  }
}
```

### Audit Configuration
```json
{
  "scripts": {
    "preinstall": "npx npm-audit-resolver@latest",
    "audit": "npm audit --audit-level=moderate"
  }
}
```

## CI/CD Integration

### GitHub Actions Audit
```yaml
name: Security Audit
on: [push, pull_request]

jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm audit --audit-level=high
```

### Fail on Vulnerabilities
```bash
# In CI script
npm audit --audit-level=critical
if [ $? -ne 0 ]; then
  echo "Critical vulnerabilities found!"
  exit 1
fi
```

## OWASP Mapping

- **A06:2021 Vulnerable and Outdated Components** - Direct mapping

## Node.js/Next.js Specific

### Check Next.js Version
```bash
# Next.js releases security patches
npm outdated next

# Check for Next.js security advisories
# https://github.com/vercel/next.js/security/advisories
```

### Common Next.js Vulnerable Patterns
```javascript
// Open redirect in older versions
// Server-side rendering with user input
// Image optimization vulnerabilities
```
