---
description: Audit logging and error handling security in Next.js apps. Use for "logging audit", "error handling security", "sensitive data in logs", "PII logging", or "error message disclosure".
---

# Logging & Error Handling Audit

## Quick Reference

Check for:
- Sensitive data in logs (tokens, passwords, PII)
- Verbose error messages to clients
- Stack traces exposed in production
- Missing security event logging
- Log injection vulnerabilities

## Files to Examine

```
lib/logger.ts, utils/logging.ts
app/error.tsx, pages/_error.tsx
app/api/**/route.ts (catch blocks)
middleware.ts
next.config.js
sentry.*.config.ts
```

## Search Patterns

```bash
# Find console.log statements
grep -r "console.log\|console.error\|console.warn" --include="*.ts" --include="*.tsx"

# Find error handling
grep -r "catch\|\.catch\|onError" --include="*.ts" --include="*.tsx"

# Find logging of sensitive fields
grep -r "log.*password\|log.*token\|log.*secret\|log.*key" --include="*.ts" -i

# Find error responses
grep -r "error.message\|error.stack\|err.message" --include="*.ts"

# Find Sentry/error reporting
grep -r "Sentry\|captureException\|captureMessage" --include="*.ts"
```

## Critical Checks

### 1. Sensitive Data in Logs
```typescript
// VULNERABLE:
console.log("User login:", { email, password }); // Logs password!
console.log("API Response:", response); // May contain tokens

// SECURE:
console.log("User login:", { email }); // Omit sensitive fields
console.log("API Response status:", response.status);
```

### 2. Error Messages to Clients
```typescript
// VULNERABLE - Exposes internals:
catch (error) {
  return Response.json({ error: error.message }, { status: 500 });
  // "error": "Connection refused to postgres://user:pass@db:5432"
}

// SECURE - Generic message:
catch (error) {
  console.error("Database error:", error); // Log internally
  return Response.json({ error: "Internal server error" }, { status: 500 });
}
```

### 3. Stack Traces
```typescript
// VULNERABLE:
catch (error) {
  return Response.json({
    error: error.message,
    stack: error.stack // Exposes code structure!
  });
}
```

### 4. Security Event Logging
```typescript
// Should log security events:
// - Failed login attempts
// - Password changes
// - Permission changes
// - Admin actions
```

## Severity Guidelines

| Finding | Severity |
|---------|----------|
| Passwords/tokens logged | Critical |
| Database credentials in errors | Critical |
| PII logged without sanitization | High |
| Stack traces in production | High |
| Verbose error messages | Medium |
| No security event logging | Medium |
| Console.log in production | Low |

## Common Findings

1. **Token logging** - JWT or API tokens in console.log
2. **Full error exposure** - error.message sent to client
3. **Stack traces in prod** - Code structure revealed
4. **PII in logs** - Email, names, addresses logged
5. **Missing audit trail** - No logging of security events

For detailed patterns and edge cases, see `references/patterns.md`
