---
description: Audit input validation and injection prevention in Next.js apps. Use for "check XSS", "input validation", "SQL injection", "injection prevention", or "sanitization audit".
---

# Input Validation & Injection Prevention Audit

## Quick Reference

Check for:
- Missing input validation on API routes
- XSS vulnerabilities in rendered content
- SQL/NoSQL injection in database queries
- Command injection in server actions
- Unsafe HTML rendering (dangerouslySetInnerHTML)

## Files to Examine

```
app/api/**/route.ts
pages/api/**/*.ts
app/**/actions.ts (Server Actions)
lib/db.ts, utils/database.ts
components/**/*.tsx (for dangerouslySetInnerHTML)
**/schema*.ts (Zod schemas)
```

## Search Patterns

```bash
# Find unvalidated inputs
grep -r "req.body\|req.query\|request.json()" --include="*.ts"

# Find dangerous HTML rendering
grep -r "dangerouslySetInnerHTML\|innerHTML" --include="*.tsx" --include="*.ts"

# Find raw SQL queries
grep -r "query(\|execute(\|raw(" --include="*.ts"

# Find validation libraries
grep -r "zod\|yup\|joi\|validator" --include="*.ts"

# Find Server Actions
grep -r '"use server"' --include="*.ts" --include="*.tsx"

# Find template literals in queries
grep -r '\$\{.*\}.*query\|query.*\$\{' --include="*.ts"
```

## Critical Checks

### 1. API Route Validation
Every API route accepting input must validate:
```typescript
// Required pattern with Zod:
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(100),
});

export async function POST(request: Request) {
  const body = await request.json();
  const validated = schema.parse(body); // Throws on invalid
  // ...
}
```

### 2. XSS Prevention
- Search for `dangerouslySetInnerHTML`
- Verify content is sanitized (DOMPurify, sanitize-html)
- Check URL parameters rendered in pages

### 3. Database Query Safety
```typescript
// VULNERABLE:
const user = await db.query(`SELECT * FROM users WHERE id = ${userId}`);

// SAFE:
const user = await db.query("SELECT * FROM users WHERE id = $1", [userId]);
```

### 4. Server Actions Validation
```typescript
"use server";

// Must validate all inputs:
export async function updateProfile(formData: FormData) {
  const name = formData.get("name");
  // MUST validate before using
  const validated = profileSchema.parse({ name });
  // ...
}
```

## Severity Guidelines

| Finding | Severity |
|---------|----------|
| SQL injection possible | Critical |
| Unvalidated user input in commands | Critical |
| XSS via dangerouslySetInnerHTML | High |
| API route with no input validation | High |
| Server Action without validation | High |
| Missing output encoding | Medium |
| Overly permissive validation | Medium |
| Validation on client only | Medium |

## Common Findings

1. **No validation schema** - API accepts any input structure
2. **Client-only validation** - Server trusts client-validated data
3. **Unsafe rich text** - CMS content rendered without sanitization
4. **Template literal queries** - Dynamic values in SQL strings
5. **Path traversal** - File paths from user input not sanitized

For detailed patterns and edge cases, see `references/patterns.md`
