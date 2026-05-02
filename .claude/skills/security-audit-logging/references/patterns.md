# Logging & Error Handling - Detailed Patterns

## Secure Logging Patterns

### Structured Logger with Sanitization
```typescript
// lib/logger.ts
type LogLevel = "debug" | "info" | "warn" | "error";

const SENSITIVE_FIELDS = [
  "password",
  "token",
  "accessToken",
  "refreshToken",
  "secret",
  "apiKey",
  "authorization",
  "cookie",
  "ssn",
  "creditCard",
];

function sanitize(obj: unknown): unknown {
  if (typeof obj !== "object" || obj === null) return obj;

  if (Array.isArray(obj)) {
    return obj.map(sanitize);
  }

  const sanitized: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (SENSITIVE_FIELDS.some((f) => key.toLowerCase().includes(f))) {
      sanitized[key] = "[REDACTED]";
    } else if (typeof value === "object") {
      sanitized[key] = sanitize(value);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
}

export function log(level: LogLevel, message: string, data?: unknown) {
  const sanitizedData = data ? sanitize(data) : undefined;
  const logEntry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    data: sanitizedData,
  };

  if (process.env.NODE_ENV === "production") {
    // Send to logging service
    console[level](JSON.stringify(logEntry));
  } else {
    console[level](message, sanitizedData);
  }
}

export const logger = {
  debug: (msg: string, data?: unknown) => log("debug", msg, data),
  info: (msg: string, data?: unknown) => log("info", msg, data),
  warn: (msg: string, data?: unknown) => log("warn", msg, data),
  error: (msg: string, data?: unknown) => log("error", msg, data),
};
```

### Security Event Logger
```typescript
// lib/security-logger.ts
interface SecurityEvent {
  event: string;
  userId?: string;
  ip?: string;
  userAgent?: string;
  success: boolean;
  details?: string;
}

export function logSecurityEvent(event: SecurityEvent) {
  const entry = {
    ...event,
    timestamp: new Date().toISOString(),
    type: "security",
  };

  // Log to security-specific channel/file
  console.log(JSON.stringify(entry));

  // In production, send to SIEM/security monitoring
  if (process.env.NODE_ENV === "production") {
    // sendToSIEM(entry);
  }
}

// Usage examples:
logSecurityEvent({
  event: "login_failed",
  ip: request.headers.get("x-forwarded-for") || "unknown",
  success: false,
  details: "Invalid password",
});

logSecurityEvent({
  event: "password_changed",
  userId: user.id,
  success: true,
});

logSecurityEvent({
  event: "permission_elevated",
  userId: user.id,
  success: true,
  details: `Role changed to admin`,
});
```

## Error Handling

### Global Error Boundary
```typescript
// app/error.tsx
"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to error reporting service (server-side handled)
    console.error("Client error:", error.digest);
  }, [error]);

  return (
    <div>
      <h2>Something went wrong!</h2>
      {/* Don't show error.message to user */}
      <p>An unexpected error occurred. Please try again.</p>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

### API Route Error Handling
```typescript
// app/api/route.ts
import { NextResponse } from "next/server";
import { logger } from "@/lib/logger";

class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public isOperational: boolean = true
  ) {
    super(message);
  }
}

export async function GET(request: Request) {
  try {
    const data = await fetchData();
    return NextResponse.json(data);
  } catch (error) {
    // Log full error internally
    logger.error("API Error", {
      path: new URL(request.url).pathname,
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });

    // Return generic error to client
    if (error instanceof AppError && error.isOperational) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      );
    }

    // Never expose unexpected error details
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
```

### Vulnerable vs Secure Error Responses

```typescript
// ❌ VULNERABLE - Exposes sensitive information
catch (error) {
  return Response.json({
    error: error.message,
    // "ECONNREFUSED postgres://admin:secret@db.internal:5432"
    stack: error.stack,
    // Full stack trace with file paths
    query: sql,
    // "SELECT * FROM users WHERE id = '1; DROP TABLE users;--'"
  });
}

// ✅ SECURE - Generic error with internal logging
catch (error) {
  const errorId = crypto.randomUUID();

  // Log full details internally
  logger.error(`Error ${errorId}`, {
    message: error.message,
    stack: error.stack,
    requestId: request.headers.get("x-request-id"),
  });

  // Return minimal info with reference ID
  return Response.json(
    {
      error: "An error occurred",
      errorId, // User can reference this for support
    },
    { status: 500 }
  );
}
```

## Sentry Configuration

### Secure Sentry Setup
```typescript
// sentry.client.config.ts
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,

  // Scrub sensitive data
  beforeSend(event) {
    // Remove sensitive headers
    if (event.request?.headers) {
      delete event.request.headers["authorization"];
      delete event.request.headers["cookie"];
    }

    // Remove sensitive data from breadcrumbs
    if (event.breadcrumbs) {
      event.breadcrumbs = event.breadcrumbs.map((bc) => {
        if (bc.data) {
          const data = { ...bc.data };
          delete data.password;
          delete data.token;
          return { ...bc, data };
        }
        return bc;
      });
    }

    return event;
  },

  // Don't send PII
  beforeBreadcrumb(breadcrumb) {
    if (breadcrumb.category === "console") {
      // Filter console breadcrumbs that might contain sensitive data
      if (breadcrumb.message?.toLowerCase().includes("password")) {
        return null;
      }
    }
    return breadcrumb;
  },
});
```

### Server-Side Sentry
```typescript
// sentry.server.config.ts
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN, // Server-side only DSN

  // Integrate with spans for performance
  integrations: [
    new Sentry.Integrations.Prisma({ client: prisma }),
  ],

  // Sample rate for production
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
});
```

## Log Injection Prevention

### Vulnerable to Log Injection
```typescript
// VULNERABLE - User input directly in log
const username = req.body.username;
console.log(`User logged in: ${username}`);

// Attacker input: "admin\n[ERROR] System compromised!"
// Log output:
// User logged in: admin
// [ERROR] System compromised!
```

### Secure Logging
```typescript
// SECURE - Encode or use structured logging
import { logger } from "@/lib/logger";

const username = req.body.username;
logger.info("User logged in", { username }); // Structured
// Or encode newlines
console.log(`User logged in: ${username.replace(/[\n\r]/g, "")}`);
```

## What to Log

### Security Events to Track
```typescript
const SECURITY_EVENTS = {
  // Authentication
  LOGIN_SUCCESS: "login_success",
  LOGIN_FAILURE: "login_failure",
  LOGOUT: "logout",
  PASSWORD_CHANGE: "password_change",
  PASSWORD_RESET_REQUEST: "password_reset_request",
  MFA_ENABLED: "mfa_enabled",
  MFA_DISABLED: "mfa_disabled",

  // Authorization
  ACCESS_DENIED: "access_denied",
  PERMISSION_CHANGE: "permission_change",
  ROLE_CHANGE: "role_change",

  // Account
  ACCOUNT_CREATED: "account_created",
  ACCOUNT_DELETED: "account_deleted",
  EMAIL_CHANGED: "email_changed",

  // Suspicious Activity
  RATE_LIMIT_EXCEEDED: "rate_limit_exceeded",
  INVALID_TOKEN: "invalid_token",
  SUSPICIOUS_IP: "suspicious_ip",
};
```

### What NOT to Log
```typescript
// NEVER log these:
// - Passwords (even hashed)
// - Full credit card numbers
// - Social Security Numbers
// - API keys or tokens
// - Session IDs
// - Private encryption keys
// - Full request/response bodies with sensitive data
```

## Production vs Development

### Environment-Aware Error Handling
```typescript
// lib/error-handler.ts
export function handleError(error: Error, request?: Request) {
  const isDev = process.env.NODE_ENV !== "production";

  // Always log internally
  logger.error("Error occurred", {
    message: error.message,
    stack: error.stack,
    url: request?.url,
  });

  // Response based on environment
  if (isDev) {
    return Response.json(
      {
        error: error.message,
        stack: error.stack,
      },
      { status: 500 }
    );
  }

  return Response.json(
    { error: "Internal server error" },
    { status: 500 }
  );
}
```

## OWASP Mapping

- **A09:2021 Security Logging and Monitoring Failures** - Insufficient logging
- **A02:2021 Cryptographic Failures** - Sensitive data in logs

## Testing Logging Security

```bash
# Search for potential sensitive data logging
grep -r "console.log.*password\|console.log.*token" --include="*.ts"

# Find stack trace exposure
grep -r "error.stack\|err.stack" --include="*.ts"

# Check for structured logging
grep -r "console.log\|console.error" --include="*.ts" | wc -l
# High count might indicate unstructured logging
```
