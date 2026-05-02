---
description: Audit data protection and privacy compliance in Next.js apps. Use for "GDPR audit", "data protection", "privacy compliance", "cookie consent", or "PII handling".
---

# Data Protection & Privacy Audit

## Quick Reference

Check for:
- Cookie consent mechanisms
- PII handling and storage
- Data retention policies
- User data export/deletion capabilities
- Analytics and tracking compliance

## Files to Examine

```
app/layout.tsx (cookie banners)
components/CookieConsent.tsx
lib/analytics.ts
middleware.ts (cookie handling)
pages/privacy-policy.tsx
app/api/user/*/route.ts (data export/delete)
```

## Search Patterns

```bash
# Find cookie usage
grep -r "cookie\|localStorage\|sessionStorage" --include="*.ts" --include="*.tsx"

# Find analytics/tracking
grep -r "gtag\|analytics\|pixel\|tracking" --include="*.ts" --include="*.tsx"

# Find PII fields
grep -r "email\|phone\|address\|ssn\|dob\|birthdate" --include="*.ts" --include="*.tsx"

# Find data storage
grep -r "prisma\|mongoose\|database\|db\." --include="*.ts"

# Find third-party data sharing
grep -r "facebook\|google\|amplitude\|mixpanel\|segment" --include="*.ts"
```

## Critical Checks

### 1. Cookie Consent
```typescript
// Required before setting non-essential cookies
if (userConsent.analytics) {
  document.cookie = "tracking_id=xxx";
  gtag("consent", "update", { analytics_storage: "granted" });
}
```

### 2. PII Storage
```typescript
// Check for encryption of sensitive data
const encryptedSSN = encrypt(user.ssn);
await db.user.update({
  where: { id: user.id },
  data: { ssn: encryptedSSN },
});
```

### 3. Data Export (GDPR Article 20)
```typescript
// Users must be able to export their data
export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  const userData = await getUserData(session.user.id);
  return Response.json(userData);
}
```

### 4. Data Deletion (GDPR Article 17)
```typescript
// Users must be able to delete their data
export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);
  await deleteUserData(session.user.id);
  return Response.json({ success: true });
}
```

## Severity Guidelines

| Finding | Severity |
|---------|----------|
| PII stored unencrypted | High |
| No cookie consent mechanism | High |
| No data deletion capability | High |
| Analytics without consent | Medium |
| Missing privacy policy | Medium |
| No data export feature | Medium |
| Third-party tracking without disclosure | Medium |

## Common Findings

1. **No cookie banner** - Tracking cookies set without consent
2. **PII in plain text** - SSN, credit cards not encrypted
3. **No data portability** - Users can't export data
4. **Missing deletion** - No way to delete user data
5. **Hidden tracking** - Third-party pixels without disclosure

For detailed patterns and edge cases, see `references/patterns.md`
