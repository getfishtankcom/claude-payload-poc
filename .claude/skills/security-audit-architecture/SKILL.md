---
description: Audit architecture and access control security in Next.js apps. Use for "IDOR check", "access control audit", "ISR security", "SSG data exposure", or "authorization patterns".
---

# Architecture & Access Control Audit

## Quick Reference

Check for:
- IDOR (Insecure Direct Object References)
- ISR/SSG exposing sensitive data
- Missing authorization checks
- Broken function-level access control
- Data leakage via static generation

## Files to Examine

```
app/**/page.tsx (check generateStaticParams)
pages/**/*.tsx (check getStaticPaths, getStaticProps)
app/api/**/route.ts
middleware.ts
lib/auth.ts
```

## Search Patterns

```bash
# Find data fetching with IDs
grep -r "params.id\|params.userId\|searchParams" --include="*.ts" --include="*.tsx"

# Find static generation
grep -r "generateStaticParams\|getStaticPaths\|getStaticProps" --include="*.ts" --include="*.tsx"

# Find revalidation
grep -r "revalidate\|ISR\|unstable_revalidate" --include="*.ts" --include="*.tsx"

# Find authorization checks
grep -r "role\|permission\|isAdmin\|canAccess" --include="*.ts"

# Find direct database queries with user IDs
grep -r "findUnique\|findFirst.*id" --include="*.ts"
```

## Critical Checks

### 1. IDOR Prevention
```typescript
// VULNERABLE - No ownership check:
export async function GET(request: Request, { params }) {
  const document = await db.document.findUnique({
    where: { id: params.id }, // Any user can access any document!
  });
  return Response.json(document);
}

// SECURE - Verify ownership:
export async function GET(request: Request, { params }) {
  const session = await getServerSession(authOptions);
  const document = await db.document.findFirst({
    where: {
      id: params.id,
      userId: session.user.id, // Only owner's documents
    },
  });
  if (!document) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json(document);
}
```

### 2. ISR/SSG Data Exposure
```typescript
// RISKY - Static page with sensitive data
export async function generateStaticParams() {
  const users = await db.user.findMany();
  return users.map((user) => ({ id: user.id }));
  // Exposes all user IDs in build output!
}
```

### 3. Role-Based Access
```typescript
// Required pattern for admin routes:
const session = await getServerSession(authOptions);
if (session?.user?.role !== "admin") {
  return Response.json({ error: "Forbidden" }, { status: 403 });
}
```

## Severity Guidelines

| Finding | Severity |
|---------|----------|
| IDOR - access any user's data | Critical |
| Missing role check on admin APIs | Critical |
| Sensitive data in static pages | High |
| User IDs exposed in static paths | Medium |
| Verbose error reveals existence | Low |

## Common Findings

1. **IDOR via predictable IDs** - Sequential IDs guessable
2. **Static generation of user data** - Private data cached publicly
3. **Missing ownership checks** - API trusts client-provided IDs
4. **Role checks only in UI** - Backend doesn't verify roles
5. **Revalidation webhook unprotected** - Anyone can trigger rebuild

For detailed patterns and edge cases, see `references/patterns.md`
