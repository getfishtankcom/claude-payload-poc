# Architecture & Access Control - Detailed Patterns

## Insecure Direct Object Reference (IDOR)

### Understanding IDOR
IDOR occurs when users can access resources by manipulating identifiers (IDs, filenames, etc.) without proper authorization checks.

### Vulnerable Patterns
```typescript
// VULNERABLE - Document accessible by any authenticated user
// GET /api/documents/123
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const document = await db.document.findUnique({
    where: { id: params.id },
  });
  return Response.json(document);
}

// VULNERABLE - User profile by ID
// GET /api/users/456
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const user = await db.user.findUnique({
    where: { id: params.id },
    select: { name: true, email: true, ssn: true }, // Exposes sensitive data!
  });
  return Response.json(user);
}
```

### Secure Patterns
```typescript
// SECURE - Document with ownership check
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const document = await db.document.findFirst({
    where: {
      id: params.id,
      OR: [
        { userId: session.user.id },      // Owner
        { sharedWith: { has: session.user.id } }, // Shared with user
        { isPublic: true },               // Public document
      ],
    },
  });

  if (!document) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  return Response.json(document);
}

// SECURE - User can only access own profile
export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Don't use ID from URL, use session
  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, email: true }, // Minimal data
  });

  return Response.json(user);
}
```

### UUID vs Sequential IDs
```typescript
// RISKY - Sequential IDs are enumerable
// /api/invoices/1, /api/invoices/2, /api/invoices/3

// BETTER - UUIDs are not enumerable
// /api/invoices/550e8400-e29b-41d4-a716-446655440000

// But STILL verify ownership regardless of ID format!
```

## ISR/SSG Security

### Dangerous Static Generation
```typescript
// VULNERABLE - Generates pages for ALL users
export async function generateStaticParams() {
  const users = await db.user.findMany();
  return users.map((user) => ({
    id: user.id,
  }));
}

// Anyone can discover user IDs by crawling:
// /users/1, /users/2, /users/3...
```

### ISR with Sensitive Data
```typescript
// RISKY - Caches user-specific data
export default async function ProfilePage({ params }: { params: { id: string } }) {
  const user = await db.user.findUnique({
    where: { id: params.id },
  });

  return <Profile user={user} />;
}

export const revalidate = 3600; // Cached for 1 hour
// Problem: Once cached, ALL users see the same data
```

### Secure Approaches
```typescript
// Option 1: Don't statically generate user pages
export const dynamic = "force-dynamic";

// Option 2: Only generate public content statically
export async function generateStaticParams() {
  const publicPosts = await db.post.findMany({
    where: { isPublic: true },
    select: { slug: true },
  });
  return publicPosts.map((post) => ({ slug: post.slug }));
}

// Option 3: Use ISR for public data, dynamic for private
export default async function Page({ params }) {
  // Public data from ISR cache
  const publicData = await getPublicData(params.id);

  // Private data fetched dynamically
  const session = await getServerSession();
  const privateData = session ? await getPrivateData(session.user.id) : null;

  return <PageContent public={publicData} private={privateData} />;
}
```

## Role-Based Access Control (RBAC)

### Middleware-Level RBAC
```typescript
// middleware.ts
import { getToken } from "next-auth/jwt";

const ROLE_ROUTES = {
  admin: ["/admin", "/api/admin"],
  editor: ["/edit", "/api/content"],
  user: ["/dashboard", "/api/user"],
};

export async function middleware(request: Request) {
  const token = await getToken({ req: request });
  const path = new URL(request.url).pathname;

  // Check if path requires specific role
  for (const [role, routes] of Object.entries(ROLE_ROUTES)) {
    if (routes.some((route) => path.startsWith(route))) {
      if (!token || token.role !== role) {
        return Response.redirect(new URL("/unauthorized", request.url));
      }
    }
  }

  return NextResponse.next();
}
```

### API Route RBAC
```typescript
// lib/auth.ts
type Role = "admin" | "editor" | "user";

export function requireRole(allowedRoles: Role[]) {
  return async function (request: Request) {
    const session = await getServerSession(authOptions);

    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!allowedRoles.includes(session.user.role as Role)) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    return null; // Authorized
  };
}

// Usage in route
export async function DELETE(request: Request, { params }) {
  const authError = await requireRole(["admin"]);
  if (authError) return authError;

  await db.post.delete({ where: { id: params.id } });
  return Response.json({ success: true });
}
```

### Attribute-Based Access Control (ABAC)
```typescript
// More flexible than RBAC
interface AccessContext {
  user: User;
  resource: Resource;
  action: string;
}

function canAccess(context: AccessContext): boolean {
  const { user, resource, action } = context;

  // Owner can do anything
  if (resource.ownerId === user.id) return true;

  // Admin can do anything
  if (user.role === "admin") return true;

  // Check specific permissions
  if (action === "read" && resource.isPublic) return true;
  if (action === "read" && resource.sharedWith?.includes(user.id)) return true;

  // Organizational access
  if (user.organizationId === resource.organizationId) {
    if (action === "read") return true;
    if (action === "edit" && user.role === "editor") return true;
  }

  return false;
}
```

## Revalidation Security

### On-Demand Revalidation
```typescript
// VULNERABLE - Anyone can trigger revalidation
// GET /api/revalidate?path=/posts/123
export async function GET(request: Request) {
  const path = new URL(request.url).searchParams.get("path");
  revalidatePath(path!);
  return Response.json({ revalidated: true });
}

// SECURE - Token-protected revalidation
export async function POST(request: Request) {
  const { token, path } = await request.json();

  if (token !== process.env.REVALIDATION_TOKEN) {
    return Response.json({ error: "Invalid token" }, { status: 401 });
  }

  revalidatePath(path);
  return Response.json({ revalidated: true });
}
```

## Multi-Tenant Security

### Tenant Isolation
```typescript
// Ensure users only access their tenant's data
async function getTenantData(request: Request) {
  const session = await getServerSession(authOptions);
  const tenantId = session?.user?.tenantId;

  if (!tenantId) {
    throw new Error("No tenant context");
  }

  // All queries scoped to tenant
  return db.data.findMany({
    where: { tenantId }, // Always include tenant filter
  });
}

// Prisma middleware for automatic tenant scoping
prisma.$use(async (params, next) => {
  if (params.action === "findMany" || params.action === "findFirst") {
    params.args.where = {
      ...params.args.where,
      tenantId: getCurrentTenantId(),
    };
  }
  return next(params);
});
```

## API Enumeration Prevention

### Don't Reveal Resource Existence
```typescript
// VULNERABLE - Reveals if resource exists
export async function GET(request: Request, { params }) {
  const session = await getServerSession(authOptions);
  const document = await db.document.findUnique({ where: { id: params.id } });

  if (!document) {
    return Response.json({ error: "Document not found" }, { status: 404 });
  }

  if (document.userId !== session?.user?.id) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }
  // Attacker knows document exists but belongs to someone else!

  return Response.json(document);
}

// SECURE - Same response for not found and forbidden
export async function GET(request: Request, { params }) {
  const session = await getServerSession(authOptions);

  const document = await db.document.findFirst({
    where: {
      id: params.id,
      userId: session?.user?.id,
    },
  });

  if (!document) {
    // Same 404 whether it doesn't exist OR user can't access
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  return Response.json(document);
}
```

## OWASP Mapping

- **A01:2021 Broken Access Control** - IDOR, missing function-level auth
- **A04:2021 Insecure Design** - Architectural authorization flaws

## Testing Access Control

```bash
# Test IDOR
curl -H "Authorization: Bearer $USER_A_TOKEN" \
  https://example.com/api/documents/USER_B_DOC_ID

# Test role bypass
curl -H "Authorization: Bearer $USER_TOKEN" \
  https://example.com/api/admin/users

# Test static path enumeration
curl -s https://example.com/users/1 | grep -i "user"
```
