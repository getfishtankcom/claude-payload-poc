# Input Validation & Injection - Detailed Patterns

## Zod Validation Patterns

### Complete API Route Validation
```typescript
import { z } from "zod";
import { NextResponse } from "next/server";

const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(100).regex(/^[a-zA-Z\s]+$/),
  age: z.number().int().min(0).max(150).optional(),
  role: z.enum(["user", "admin"]).default("user"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = createUserSchema.parse(body);
    // Use validated data...
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }
    throw error;
  }
}
```

### Server Action Validation
```typescript
"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";

const updateSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(200),
  content: z.string().max(10000),
});

export async function updatePost(formData: FormData) {
  const validated = updateSchema.parse({
    id: formData.get("id"),
    title: formData.get("title"),
    content: formData.get("content"),
  });

  // Safe to use validated data
  await db.posts.update({
    where: { id: validated.id },
    data: { title: validated.title, content: validated.content },
  });

  revalidatePath("/posts");
}
```

## XSS Vulnerabilities

### Vulnerable Patterns
```typescript
// VULNERABLE - User input in dangerouslySetInnerHTML
function Comment({ content }: { content: string }) {
  return <div dangerouslySetInnerHTML={{ __html: content }} />;
}

// VULNERABLE - URL from query params
function Page({ searchParams }) {
  return <a href={searchParams.redirect}>Click here</a>;
}

// VULNERABLE - Unescaped interpolation in script
function Analytics({ userId }) {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `window.userId = "${userId}"`,
      }}
    />
  );
}
```

### Secure Patterns
```typescript
import DOMPurify from "isomorphic-dompurify";

// SECURE - Sanitized HTML
function Comment({ content }: { content: string }) {
  const sanitized = DOMPurify.sanitize(content, {
    ALLOWED_TAGS: ["p", "b", "i", "a"],
    ALLOWED_ATTR: ["href"],
  });
  return <div dangerouslySetInnerHTML={{ __html: sanitized }} />;
}

// SECURE - URL validation
function Page({ searchParams }) {
  const redirect = searchParams.redirect;
  const safeUrl = redirect?.startsWith("/") ? redirect : "/";
  return <a href={safeUrl}>Click here</a>;
}

// SECURE - JSON encoding for script data
function Analytics({ userId }) {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `window.userId = ${JSON.stringify(userId)}`,
      }}
    />
  );
}
```

## SQL/NoSQL Injection

### Vulnerable SQL Patterns
```typescript
// VULNERABLE - Template literal
const user = await db.query(`SELECT * FROM users WHERE id = ${id}`);

// VULNERABLE - String concatenation
const user = await db.query("SELECT * FROM users WHERE name = '" + name + "'");

// VULNERABLE - Prisma raw with interpolation
const users = await prisma.$queryRaw`SELECT * FROM users WHERE name = ${name}`;
// Note: Prisma actually handles this safely, but check for $queryRawUnsafe
```

### Secure SQL Patterns
```typescript
// SECURE - Parameterized query
const user = await db.query("SELECT * FROM users WHERE id = $1", [id]);

// SECURE - Prisma ORM
const user = await prisma.user.findUnique({ where: { id } });

// SECURE - Prisma raw with Prisma.sql
const users = await prisma.$queryRaw(
  Prisma.sql`SELECT * FROM users WHERE name = ${name}`
);
```

### MongoDB Injection
```typescript
// VULNERABLE - Direct object from request
const user = await User.findOne(req.body);
// Attacker: { "$gt": "" } matches all

// SECURE - Explicit field extraction
const user = await User.findOne({
  username: String(req.body.username)
});
```

## Command Injection

### Vulnerable Patterns
```typescript
// VULNERABLE - User input in exec
import { exec } from "child_process";

export async function POST(request: Request) {
  const { filename } = await request.json();
  exec(`convert ${filename} output.png`); // Command injection!
}
```

### Secure Patterns
```typescript
import { execFile } from "child_process";

export async function POST(request: Request) {
  const { filename } = await request.json();

  // Validate filename
  if (!/^[a-zA-Z0-9_-]+\.(jpg|png)$/.test(filename)) {
    return Response.json({ error: "Invalid filename" }, { status: 400 });
  }

  // Use execFile with arguments array
  execFile("convert", [filename, "output.png"]);
}
```

## Path Traversal

### Vulnerable Pattern
```typescript
// VULNERABLE
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const file = searchParams.get("file");
  const content = await fs.readFile(`./uploads/${file}`);
  // Attacker: ?file=../../../etc/passwd
}
```

### Secure Pattern
```typescript
import path from "path";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const file = searchParams.get("file");

  // Validate and normalize path
  const safePath = path.normalize(file || "").replace(/^(\.\.(\/|\\|$))+/, "");
  const fullPath = path.join(process.cwd(), "uploads", safePath);

  // Ensure path is within uploads directory
  if (!fullPath.startsWith(path.join(process.cwd(), "uploads"))) {
    return Response.json({ error: "Invalid path" }, { status: 400 });
  }

  const content = await fs.readFile(fullPath);
}
```

## Server-Side Request Forgery via Input

### Vulnerable Pattern
```typescript
// VULNERABLE - User-controlled URL
export async function POST(request: Request) {
  const { url } = await request.json();
  const response = await fetch(url); // SSRF!
  return Response.json(await response.json());
}
```

### Secure Pattern
```typescript
// SECURE - URL allowlist
const ALLOWED_HOSTS = ["api.example.com", "cdn.example.com"];

export async function POST(request: Request) {
  const { url } = await request.json();

  const parsed = new URL(url);
  if (!ALLOWED_HOSTS.includes(parsed.hostname)) {
    return Response.json({ error: "Invalid URL" }, { status: 400 });
  }

  const response = await fetch(url);
  return Response.json(await response.json());
}
```

## Rich Text from CMS

### Sitecore Rich Text Handling
```typescript
// VULNERABLE - Direct render
function RichText({ field }) {
  return <div dangerouslySetInnerHTML={{ __html: field.value }} />;
}

// SECURE - Sanitize CMS content
import DOMPurify from "isomorphic-dompurify";

function RichText({ field }) {
  const sanitized = DOMPurify.sanitize(field.value);
  return <div dangerouslySetInnerHTML={{ __html: sanitized }} />;
}
```

## Edge Cases

1. **Content-Type Confusion** - Check that JSON endpoints reject non-JSON
2. **Array vs Object** - `req.body` might be array, causing prototype issues
3. **Numeric String Coercion** - `"1e999"` becomes `Infinity`
4. **Unicode Normalization** - Different Unicode representations bypass filters
5. **Null Byte Injection** - `filename.jpg%00.exe` may bypass extension checks

## OWASP Mapping

- **A03:2021 Injection** - SQL, NoSQL, Command, XSS
- **A01:2021 Broken Access Control** - Path traversal, SSRF

## Validation Libraries Comparison

| Library | Best For | Notes |
|---------|----------|-------|
| Zod | TypeScript projects | Type inference, transforms |
| Yup | React form validation | Similar to Zod, older |
| Joi | Node.js APIs | Mature, enterprise |
| validator.js | Simple checks | Individual functions |
