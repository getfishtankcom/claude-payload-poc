# Sitecore-Specific Security - Detailed Patterns

## Environment Variable Security

### Correct Variable Exposure
```bash
# .env.local

# Server-side only (SECURE)
SITECORE_API_KEY=your-api-key-here
SITECORE_API_HOST=https://cm.example.com
SITECORE_EDGE_CONTEXT_ID=your-context-id
JSS_EDITING_SECRET=your-editing-secret
SITECORE_EDGE_URL=https://edge.sitecorecloud.io

# Client-safe (can be NEXT_PUBLIC_)
NEXT_PUBLIC_SITECORE_SITE_NAME=mysite
NEXT_PUBLIC_SITECORE_DEFAULT_LANGUAGE=en
```

### Checking for Exposure
```typescript
// lib/sitecore-config.ts

// VULNERABLE Pattern
export const sitecoreConfig = {
  apiKey: process.env.NEXT_PUBLIC_SITECORE_API_KEY, // EXPOSED!
  contextId: process.env.NEXT_PUBLIC_SITECORE_EDGE_CONTEXT_ID, // EXPOSED!
};

// SECURE Pattern
function getSitecoreConfig() {
  if (typeof window !== "undefined") {
    throw new Error("Sitecore config must only be accessed server-side");
  }

  return {
    apiKey: process.env.SITECORE_API_KEY!,
    apiHost: process.env.SITECORE_API_HOST!,
    contextId: process.env.SITECORE_EDGE_CONTEXT_ID!,
    siteName: process.env.SITECORE_SITE_NAME!,
  };
}

export const sitecoreConfig = getSitecoreConfig();
```

## Experience Edge Security

### Secure Edge Configuration
```typescript
// lib/edge-client.ts
import { GraphQLClient } from "graphql-request";

const EDGE_ENDPOINT = process.env.SITECORE_EDGE_URL;
const CONTEXT_ID = process.env.SITECORE_EDGE_CONTEXT_ID;
const API_KEY = process.env.SITECORE_API_KEY;

// Server-side only client
export function getEdgeClient() {
  if (typeof window !== "undefined") {
    throw new Error("Edge client must be server-side only");
  }

  return new GraphQLClient(`${EDGE_ENDPOINT}/api/graphql/v1`, {
    headers: {
      sc_apikey: API_KEY!,
    },
  });
}
```

### GraphQL Query Security
```typescript
// Avoid exposing internal IDs in queries
// RISKY - Exposes item structure
const query = `
  query {
    item(path: "/sitecore/content/home", language: "en") {
      id
      name
      children {
        results {
          id
          name
        }
      }
    }
  }
`;

// BETTER - Use layout service for public data
import { GraphQLLayoutService } from "@sitecore-jss/sitecore-jss-nextjs";

const layoutService = new GraphQLLayoutService({
  endpoint: process.env.SITECORE_EDGE_URL!,
  apiKey: process.env.SITECORE_API_KEY!,
  siteName: process.env.SITECORE_SITE_NAME!,
});
```

## Preview and Editing Mode

### Secure Preview Mode Setup
```typescript
// pages/api/editing/render.ts (Pages Router)
// or app/api/editing/render/route.ts (App Router)

import { EditingRenderMiddleware } from "@sitecore-jss/sitecore-jss-nextjs/editing";

const handler = new EditingRenderMiddleware().getHandler();

export default async function renderHandler(req: Request) {
  // Verify editing secret
  const editingSecret = req.headers.get("x-editing-secret");

  if (editingSecret !== process.env.JSS_EDITING_SECRET) {
    return Response.json(
      { error: "Invalid editing secret" },
      { status: 401 }
    );
  }

  return handler(req);
}
```

### Preview Mode Middleware
```typescript
// middleware.ts
import { NextResponse } from "next/server";

export function middleware(request: Request) {
  const { pathname, searchParams } = new URL(request.url);

  // Check for preview mode parameters
  const isPreviewMode =
    searchParams.has("sc_mode") ||
    searchParams.has("sc_itemid") ||
    pathname.includes("/api/editing/");

  if (isPreviewMode) {
    // Verify authorization
    const editingSecret = request.headers.get("x-editing-secret");
    const authHeader = request.headers.get("authorization");

    if (
      editingSecret !== process.env.JSS_EDITING_SECRET &&
      !isValidAuthToken(authHeader)
    ) {
      return Response.json(
        { error: "Unauthorized preview access" },
        { status: 401 }
      );
    }

    // Add no-cache headers for preview
    const response = NextResponse.next();
    response.headers.set("Cache-Control", "no-store, must-revalidate");
    response.headers.set("X-Robots-Tag", "noindex");
    return response;
  }

  return NextResponse.next();
}
```

## Personalization Security

### Avoiding Personalization Data Leaks
```typescript
// Personalization can leak user segments

// RISKY - Segment info in response
const layout = await layoutService.fetchLayoutData(path, language);
// Response might include:
// { personalization: { variantId: "premium-user-variant" } }

// BETTER - Strip personalization metadata before client render
function sanitizeLayoutData(data: LayoutServiceData) {
  const sanitized = { ...data };
  // Remove internal personalization data
  delete sanitized.sitecore?.context?.variantId;
  delete sanitized.sitecore?.context?.segments;
  return sanitized;
}
```

### Secure Personalization Setup
```typescript
// Don't expose segment rules
// VULNERABLE - Reveals business logic
{
  "condition": "user.totalPurchases > 1000",
  "variant": "premium-offer"
}

// BETTER - Use opaque variant IDs
{
  "variantId": "v-123-abc",  // Meaningless to attackers
}
```

## Webhook Security

### Secure Publishing Webhook
```typescript
// app/api/sitecore/webhook/route.ts
import crypto from "crypto";

const WEBHOOK_SECRET = process.env.SITECORE_WEBHOOK_SECRET!;

function verifySignature(payload: string, signature: string): boolean {
  const expectedSignature = crypto
    .createHmac("sha256", WEBHOOK_SECRET)
    .update(payload)
    .digest("hex");

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

export async function POST(request: Request) {
  const payload = await request.text();
  const signature = request.headers.get("x-sitecore-signature");

  if (!signature || !verifySignature(payload, signature)) {
    return Response.json({ error: "Invalid signature" }, { status: 401 });
  }

  const data = JSON.parse(payload);

  // Process webhook (e.g., trigger revalidation)
  await handlePublishEvent(data);

  return Response.json({ success: true });
}
```

### Revalidation Security
```typescript
// app/api/revalidate/route.ts
export async function POST(request: Request) {
  const { path, token } = await request.json();

  // Verify revalidation token
  if (token !== process.env.REVALIDATION_TOKEN) {
    return Response.json({ error: "Invalid token" }, { status: 401 });
  }

  // Validate path format
  if (!path || !path.startsWith("/")) {
    return Response.json({ error: "Invalid path" }, { status: 400 });
  }

  revalidatePath(path);
  return Response.json({ revalidated: true });
}
```

## Content Hub Security

### DAM Integration
```typescript
// When integrating with Sitecore Content Hub (DAM)

// VULNERABLE - Exposing DAM auth
const damConfig = {
  clientId: process.env.NEXT_PUBLIC_CH_CLIENT_ID, // EXPOSED!
  clientSecret: process.env.NEXT_PUBLIC_CH_SECRET, // CRITICAL!
};

// SECURE - Server-side proxy
// app/api/dam/[...path]/route.ts
export async function GET(
  request: Request,
  { params }: { params: { path: string[] } }
) {
  const damPath = params.path.join("/");

  // Fetch from Content Hub server-side
  const response = await fetch(
    `${process.env.CONTENT_HUB_URL}/${damPath}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.CONTENT_HUB_TOKEN}`,
      },
    }
  );

  // Stream response to client
  return new Response(response.body, {
    headers: {
      "Content-Type": response.headers.get("Content-Type") || "image/jpeg",
      "Cache-Control": "public, max-age=31536000",
    },
  });
}
```

## XM Cloud Specific

### Deploy Configuration
```typescript
// Ensure deploy secrets aren't in code
// SITECORE_DEPLOY_SECRET should be in CI/CD secrets only

// next.config.js - Don't expose build-time secrets
module.exports = {
  env: {
    // Only public values here
    NEXT_PUBLIC_SITE_NAME: process.env.SITECORE_SITE_NAME,
  },
  // DON'T include API keys in env:{}
};
```

### Components Security
```typescript
// Sitecore Components (FEAAS)
// Ensure component props don't expose secrets

// VULNERABLE - Passing sensitive data as props
<ComponentBuilder
  data={{
    apiKey: process.env.SITECORE_API_KEY, // Will be in HTML!
  }}
/>

// SECURE - Only pass display data
<ComponentBuilder
  data={{
    title: data.title,
    description: data.description,
  }}
/>
```

## JSS SDK Security

### Secure Service Factory
```typescript
// lib/layout-service-factory.ts
import { LayoutService } from "@sitecore-jss/sitecore-jss-nextjs";

export function createLayoutService() {
  // Verify server-side
  if (typeof window !== "undefined") {
    throw new Error("Layout service factory must be server-side");
  }

  return new LayoutService({
    apiHost: process.env.SITECORE_API_HOST!,
    apiKey: process.env.SITECORE_API_KEY!,
    siteName: process.env.SITECORE_SITE_NAME!,
  });
}
```

## OWASP Mapping

- **A01:2021 Broken Access Control** - Preview mode bypass
- **A02:2021 Cryptographic Failures** - API key exposure
- **A05:2021 Security Misconfiguration** - Insecure defaults

## Testing Sitecore Security

```bash
# Check for exposed Sitecore vars
grep -r "NEXT_PUBLIC.*SITECORE" --include=".env*"

# Check client bundle for API keys
npm run build
grep -r "api_key\|apikey\|sitecore" .next/static/chunks/

# Test preview mode without auth
curl "https://example.com/page?sc_mode=edit"

# Check webhook endpoint
curl -X POST https://example.com/api/sitecore/webhook \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'
```

## Sitecore-Specific Headers

```typescript
// Add security headers for Sitecore responses
const sitecoreHeaders = {
  // Prevent iframe embedding except from Sitecore CM
  "Content-Security-Policy":
    process.env.SITECORE_EDITING_MODE
      ? `frame-ancestors 'self' ${process.env.SITECORE_CM_URL}`
      : "frame-ancestors 'none'",

  // Prevent XSS via Sitecore content
  "X-XSS-Protection": "1; mode=block",
};
```
