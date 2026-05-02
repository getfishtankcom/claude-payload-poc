# Authentication & Session - Detailed Patterns

## Next.js App Router Authentication

### Secure Middleware Pattern
```typescript
// middleware.ts
import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ token }) => !!token,
  },
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/api/:path*",
    "/admin/:path*",
    "/((?!api/auth|_next/static|_next/image|favicon.ico|public).*)",
  ],
};
```

### Vulnerable: Missing API Protection
```typescript
// VULNERABLE - No auth check
export async function GET(request: Request) {
  const users = await db.users.findMany();
  return Response.json(users);
}
```

### Secure: Protected API Route
```typescript
// SECURE
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }
  // ... proceed with authenticated request
}
```

## NextAuth.js Configuration Issues

### Session Configuration
```typescript
// Check for these settings:
export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days - consider if appropriate
    updateAge: 24 * 60 * 60,   // 24 hours
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60,
  },
  // CRITICAL: Ensure secret is set
  secret: process.env.NEXTAUTH_SECRET,
};
```

### Callback Security
```typescript
callbacks: {
  // Vulnerable: Allows any redirect
  redirect({ url }) {
    return url;
  },

  // Secure: Validates redirect URL
  redirect({ url, baseUrl }) {
    if (url.startsWith(baseUrl)) return url;
    if (url.startsWith("/")) return `${baseUrl}${url}`;
    return baseUrl;
  },
}
```

## Token Storage Vulnerabilities

### Vulnerable Patterns
```typescript
// VULNERABLE - Token in localStorage
localStorage.setItem("token", response.accessToken);

// VULNERABLE - Token in URL
const url = `/api/data?token=${accessToken}`;

// VULNERABLE - Token logged
console.log("User token:", session.accessToken);
```

### Secure Token Handling
```typescript
// SECURE - Use httpOnly cookies (handled by NextAuth)
// SECURE - Use server components for sensitive data
// SECURE - Token only in Authorization header for external APIs
const response = await fetch(url, {
  headers: {
    Authorization: `Bearer ${token}`, // Server-side only
  },
});
```

## Pages Router vs App Router

### Pages Router Auth
```typescript
// pages/api/protected.ts
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  // ...
}
```

### App Router Auth
```typescript
// app/api/protected/route.ts
import { getServerSession } from "next-auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  // ...
}
```

## Server Components Authentication

### Checking Auth in Server Components
```typescript
// app/dashboard/page.tsx
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return <Dashboard user={session.user} />;
}
```

## CSRF Protection

### Check for CSRF on Mutations
```typescript
// NextAuth handles CSRF for its routes
// For custom mutations, verify:

// pages/api/update.ts
export default async function handler(req, res) {
  // Should verify CSRF token for non-GET requests
  if (req.method !== "GET") {
    const csrfToken = req.headers["x-csrf-token"];
    // Validate token...
  }
}
```

## Role-Based Access Control (RBAC)

### Vulnerable: No Role Check
```typescript
// VULNERABLE - Any authenticated user can access
if (session) {
  return <AdminPanel />;
}
```

### Secure: Role Verification
```typescript
// SECURE
if (session?.user?.role === "admin") {
  return <AdminPanel />;
}
```

## Edge Cases to Check

1. **Parallel Route Protection** - Each parallel route in app router needs independent auth
2. **API Route Groups** - Grouped routes `(auth)` don't inherit middleware automatically
3. **Middleware.ts Location** - Must be in project root or src/ root
4. **Dynamic Route Segments** - `[...slug]` routes may bypass specific matchers
5. **Revalidation Endpoints** - `/api/revalidate` often unprotected
6. **Preview Mode** - Check if preview endpoints require auth

## OWASP Mapping

- **A01:2021 Broken Access Control** - Missing auth checks, IDOR
- **A02:2021 Cryptographic Failures** - Weak session tokens, insecure storage
- **A07:2021 Identification and Authentication Failures** - Weak auth flows

## Sitecore Integration Considerations

When using Sitecore with NextAuth:
- Sitecore preview/editing modes may bypass normal auth
- Ensure Experience Edge requests are authenticated
- Check that Sitecore webhooks validate authenticity
- Verify personalization rules don't leak sensitive variants
