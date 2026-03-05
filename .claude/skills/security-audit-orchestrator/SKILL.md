---
description: Run a comprehensive security audit on a Next.js + Sitecore/XM Cloud codebase. Use when asked to "run security audit", "check for vulnerabilities", "OWASP assessment", "security review", or "vulnerability scan".
---

# Security Audit Orchestrator

You are conducting a comprehensive security audit of a Next.js application with Sitecore/XM Cloud integration. This orchestrator guides you through all 15 audit areas systematically, producing a professional-grade security assessment report.

## Workflow

### Step 1: Initialize Audit

1. Create the TodoWrite checklist with all 15 audit areas
2. Identify the project structure (app router vs pages router, src/ directory)
3. Note the Sitecore integration type (XM Cloud, Content Hub, etc.)
4. **If live site URL is available**, use Claude in Chrome browser automation to:
   - Navigate to the production website
   - Observe third-party scripts, cookies, and tracking
   - Check for cookie consent mechanisms
   - Use `curl -I` to verify HTTP security headers

### Step 2: Execute Audit Areas

For each area below, invoke the corresponding skill, execute checks, and record findings:

| # | Area | Skill to Invoke |
|---|------|-----------------|
| 1 | Authentication & Session | `/security-audit-authentication` |
| 2 | Input Validation & Injection | `/security-audit-input-validation` |
| 3 | GraphQL Security | `/security-audit-graphql` |
| 4 | SSRF Prevention | `/security-audit-ssrf` |
| 5 | Security Headers | `/security-audit-headers` |
| 6 | Secrets Management | `/security-audit-secrets` |
| 7 | Identity Provider | `/security-audit-identity-provider` |
| 8 | API & Encryption | `/security-audit-api-encryption` |
| 9 | CORS & Rate Limiting | `/security-audit-cors-ratelimit` |
| 10 | Architecture & Access Control | `/security-audit-architecture` |
| 11 | Dependencies | `/security-audit-dependencies` |
| 12 | CI/CD Security | `/security-audit-cicd` |
| 13 | Logging & Error Handling | `/security-audit-logging` |
| 14 | Data Protection & Privacy | `/security-audit-data-protection` |
| 15 | Sitecore-Specific | `/security-audit-sitecore` |

### Step 3: For Each Area

```
1. Mark area as "in_progress" in TodoWrite
2. Invoke the skill: /security-audit-{area}
3. Execute all checks defined in that skill
4. Record findings with severity (Critical/High/Medium/Low/Info)
5. Mark area as "completed" in TodoWrite
6. Proceed to next area
```

### Step 4: Live Site Testing (If Available)

Use Claude in Chrome MCP tools to test the live production site:

1. **Navigate to the site** using `mcp__claude-in-chrome__navigate`
2. **Check third-party scripts** using JavaScript execution
3. **Observe forms** for CAPTCHA/bot protection (Turnstile, reCAPTCHA)
4. **Check HTTP headers** using `curl -I https://domain.com`
5. **Document observations** for inclusion in the report

### Step 5: Generate Professional Report

Create `security-audit-report.md` in the project root with this professional structure:

```markdown
# Security Audit Report
## [Project Name]

---

| **Document Information** | |
|--------------------------|---|
| **Client** | [Client/Company Name] |
| **Application** | [App description - framework, version] |
| **Audit Date** | [Date] |
| **Auditor** | Claude Code Security Assessment |
| **Report Version** | 1.0 |
| **Classification** | Internal / Confidential |

---

## 1. Executive Summary

### 1.1 Overview
[2-3 sentences describing the assessment scope and methodology]

### 1.2 Scope
- **In Scope:** [List what was tested]
- **Out of Scope:** [List exclusions]

### 1.3 Risk Summary

| Severity | Count | Trend |
|----------|-------|-------|
| **Critical** | X | [Action needed] |
| **High** | X | [Timeframe] |
| **Medium** | X | [Timeframe] |
| **Low** | X | [Timeframe] |
| **Informational** | X | [Consideration] |

### 1.4 Key Findings at a Glance
[Numbered list of top 5 most important findings]

### 1.5 Live Site Observations (if tested)
[Bullet points of positive and concerning observations from live testing]

---

## 2. Critical & High Priority Findings

### 2.1 [SEVERITY] SEC-XXX: [Finding Title]

| Attribute | Details |
|-----------|---------|
| **Severity** | Critical/High |
| **CVSS Score** | X.X (Severity) |
| **Location** | `file/path:line` |
| **CWE** | CWE-XXX: [Name] |
| **Status** | Open |

#### Description
[Detailed explanation of the vulnerability, including code snippets]

#### Business Impact
- **Confidentiality:** [Impact]
- **Integrity:** [Impact]
- **Availability:** [Impact]

#### Evidence
[Code snippets, commands, or screenshots demonstrating the issue]

#### Remediation
1. **Immediate:** [Quick fix]
2. **Short-term:** [Better solution]
3. **Long-term:** [Best practice]

[Repeat for each Critical/High finding]

---

## 3. Medium Priority Findings

### 3.X [MEDIUM] SEC-XXX: [Title]

| Attribute | Details |
|-----------|---------|
| **Location** | `file/path` |
| **CWE** | CWE-XXX |

**Description:** [Brief description]

**Remediation:** [Brief fix]

---

## 4. Low Priority Findings

| ID | Finding | Location | Recommendation |
|----|---------|----------|----------------|
| SEC-XXX | [Issue] | `file` | [Fix] |

---

## 5. Informational Findings

| ID | Observation | Notes |
|----|-------------|-------|
| INFO-XXX | [Observation] | [Context] |

---

## 6. Live Site Security Profile (if tested)

### 6.1 Third-Party Script Inventory
| Script Host | Purpose | Risk Level |
|-------------|---------|------------|

### 6.2 Cookie Security Summary
| Cookie | Secure | HttpOnly | SameSite | Duration |
|--------|--------|----------|----------|----------|

### 6.3 TLS Configuration
- **Protocol:** [TLS version]
- **HSTS:** [Status]
- **Grade:** [Rating]

---

## 7. Recommendations Summary

### Immediate Actions (Week 1)
| Priority | Action | Owner | Effort |
|----------|--------|-------|--------|

### Short-Term Actions (Month 1)
| Priority | Action | Owner | Effort |
|----------|--------|-------|--------|

### Long-Term Actions (Quarter 1)
| Priority | Action | Owner | Effort |
|----------|--------|-------|--------|

---

## 8. Appendix

### A. Files Reviewed
<details>
<summary>Click to expand file list</summary>
[Categorized list of files]
</details>

### B. Tools Used
[List of tools and methodologies]

### C. Testing Methodology
[Brief methodology description]

---

**Report Prepared By:** Claude Code Security Assessment
**Review Status:** Draft - Pending Client Review

---

*This report contains confidential security information.*
```

## Severity Definitions

| Severity | Criteria | CVSS Range | Response Time |
|----------|----------|------------|---------------|
| **Critical** | Immediate exploitation risk, data breach possible, auth bypass | 9.0-10.0 | Immediate |
| **High** | Significant risk, requires attacker effort, sensitive data exposure | 7.0-8.9 | 7 days |
| **Medium** | Moderate risk, defense-in-depth issue, information disclosure | 4.0-6.9 | 30 days |
| **Low** | Minor issue, best practice violation, minimal impact | 0.1-3.9 | Next sprint |
| **Info** | Observation, suggestion for improvement, no security impact | N/A | Consider |

## CWE Reference for Common Findings

| Issue Type | CWE |
|------------|-----|
| Hardcoded Credentials | CWE-798 |
| SQL/GraphQL Injection | CWE-943 |
| XSS | CWE-79 |
| SSRF | CWE-918 |
| Missing Security Headers | CWE-693 |
| Vulnerable Dependencies | CWE-1395 |
| Missing Rate Limiting | CWE-770 |
| Sensitive Cookie Issues | CWE-1004 |
| Missing Authentication | CWE-306 |

## TodoWrite Checklist Template

Create this checklist at audit start:

```
- Authentication & Session Security
- Input Validation & Injection Prevention
- GraphQL Security
- SSRF Prevention
- Security Headers Configuration
- Secrets Management
- Identity Provider Security
- API & Encryption Security
- CORS & Rate Limiting
- Architecture & Access Control
- Dependency Security
- CI/CD Security
- Logging & Error Handling
- Data Protection & Privacy
- Sitecore-Specific Security
- Live Site Testing (if applicable)
- Generate Professional Report
```

## Quick Audit Option

If user requests a "quick audit" or "basic scan", focus only on:
1. Secrets Management (most common critical issues)
2. Authentication & Session
3. Input Validation
4. Security Headers
5. Dependencies

## Important Notes

- Read files before making assessments - never assume
- Use Grep to search for patterns across the codebase
- Check both client and server code
- Note false positives when patterns match but are actually safe
- If a skill's reference/patterns.md exists, consult it for edge cases
- **Always include business impact context** for findings
- **Provide actionable remediation** with code examples where possible
- **Use professional language** suitable for executive and technical audiences
- **Include live site observations** when browser testing is available
