---
description: Audit dependency security in Next.js apps. Use for "npm audit", "dependency check", "supply chain security", "vulnerable packages", or "outdated dependencies".
---

# Dependency Security Audit

## Quick Reference

Check for:
- Known vulnerabilities in dependencies
- Outdated packages with security fixes
- Typosquatting risks
- Excessive dependencies
- Lockfile integrity

## Files to Examine

```
package.json
package-lock.json / yarn.lock / pnpm-lock.yaml
.npmrc
.yarnrc.yml
```

## Commands to Run

```bash
# npm audit
npm audit

# npm audit with JSON output
npm audit --json

# Check for outdated packages
npm outdated

# If using yarn
yarn audit

# If using pnpm
pnpm audit

# List all dependencies
npm ls --all
```

## Critical Checks

### 1. Run Security Audit
```bash
npm audit
# Look for: Critical, High severity issues
```

### 2. Check Lock File Exists
```bash
# Must have ONE of these:
ls package-lock.json yarn.lock pnpm-lock.yaml
```

### 3. Review High-Risk Dependencies
Manual review for:
- Packages with few maintainers
- Recently transferred ownership
- Unusually low download counts for functionality
- Packages with names similar to popular ones (typosquatting)

### 4. Check for Install Scripts
```bash
# Find packages with install scripts
grep -r "postinstall\|preinstall" node_modules/*/package.json 2>/dev/null | head -20
```

## Severity Guidelines

| Finding | Severity |
|---------|----------|
| Critical npm audit vulnerability | Critical |
| High npm audit vulnerability | High |
| No lockfile | High |
| Moderate npm audit vulnerability | Medium |
| Outdated major version with CVEs | Medium |
| Low npm audit vulnerability | Low |
| Many unused dependencies | Info |

## Common Findings

1. **Known CVEs** - Dependencies with published vulnerabilities
2. **No lockfile** - Version inconsistency between environments
3. **Outdated packages** - Missing security patches
4. **Typosquatting risk** - Suspicious package names
5. **Excessive deps** - Large attack surface

For detailed patterns and edge cases, see `references/patterns.md`
