---
description: Audit CI/CD security in Next.js apps. Use for "GitHub Actions security", "Vercel security", "deployment audit", "pipeline security", or "CI/CD secrets".
---

# CI/CD Security Audit

## Quick Reference

Check for:
- Secrets in workflow files
- Insecure action permissions
- Unprotected deployment triggers
- Artifact exposure
- Environment security

## Files to Examine

```
.github/workflows/*.yml
.github/actions/*/action.yml
vercel.json
netlify.toml
.env.example (what secrets are expected)
Dockerfile, docker-compose.yml
```

## Search Patterns

```bash
# Find workflow secrets usage
grep -r "secrets\.\|env:\|GITHUB_TOKEN" .github/

# Find dangerous permissions
grep -r "permissions:\|contents: write\|packages: write" .github/

# Find external action usage
grep -r "uses:" .github/workflows/

# Find environment variables
grep -r "\${{ env\.\|process.env" .github/
```

## Critical Checks

### 1. Workflow Permissions
```yaml
# RISKY - Broad permissions:
permissions: write-all

# SECURE - Minimal permissions:
permissions:
  contents: read
  pull-requests: write
```

### 2. Secrets Exposure
```yaml
# VULNERABLE - Secret in logs:
- run: echo "Deploying with ${{ secrets.API_KEY }}"

# SECURE - Secret masked:
- run: deploy
  env:
    API_KEY: ${{ secrets.API_KEY }}
```

### 3. Third-Party Actions
```yaml
# RISKY - Using mutable tag:
- uses: some-action@master

# SECURE - Pin to commit SHA:
- uses: actions/checkout@b4ffde65f46336ab88eb53be808477a3936bae11 # v4.1.1
```

### 4. Pull Request Triggers
```yaml
# RISKY for public repos - PR from fork runs with secrets:
on:
  pull_request_target:
    types: [opened, synchronize]

# Safer - PR from fork without secrets:
on:
  pull_request:
```

## Severity Guidelines

| Finding | Severity |
|---------|----------|
| Secrets logged/exposed | Critical |
| Workflow write-all permissions | High |
| Actions pinned to mutable refs | High |
| PR_target without checkout protection | High |
| No branch protection on main | Medium |
| Missing CODEOWNERS | Low |

## Common Findings

1. **Logged secrets** - Secrets echoed in run commands
2. **Overly broad permissions** - write-all on workflows
3. **Unpinned actions** - Using @master instead of SHA
4. **Fork attack surface** - pull_request_target misuse
5. **No deployment protection** - Anyone can trigger deploy

For detailed patterns and edge cases, see `references/patterns.md`
