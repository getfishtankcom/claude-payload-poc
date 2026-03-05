# CORS & Rate Limiting - Detailed Patterns

## CORS Configuration

### Secure CORS Middleware
```typescript
// middleware.ts
import { NextResponse } from "next/server";

const ALLOWED_ORIGINS = [
  "https://app.example.com",
  "https://dashboard.example.com",
];

export function middleware(request: Request) {
  const origin = request.headers.get("Origin");
  const response = NextResponse.next();

  // Validate origin
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    response.headers.set("Access-Control-Allow-Origin", origin);
    response.headers.set("Access-Control-Allow-Credentials", "true");
    response.headers.set(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );
  }

  // Handle preflight
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: response.headers,
    });
  }

  return response;
}
```

### Per-Route CORS
```typescript
// app/api/public/route.ts
const ALLOWED_ORIGINS = ["https://app.example.com"];

function getCorsHeaders(origin: string | null) {
  if (!origin || !ALLOWED_ORIGINS.includes(origin)) {
    return {};
  }

  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

export async function GET(request: Request) {
  const origin = request.headers.get("Origin");
  const corsHeaders = getCorsHeaders(origin);

  return Response.json(
    { data: "public data" },
    { headers: corsHeaders }
  );
}

export async function OPTIONS(request: Request) {
  const origin = request.headers.get("Origin");
  return new Response(null, {
    status: 204,
    headers: {
      ...getCorsHeaders(origin),
      "Access-Control-Max-Age": "86400",
    },
  });
}
```

## Vulnerable CORS Patterns

### Reflected Origin (CRITICAL)
```typescript
// VULNERABLE - Reflects any origin
export async function GET(request: Request) {
  const origin = request.headers.get("Origin");
  return Response.json(
    { data: "sensitive" },
    {
      headers: {
        "Access-Control-Allow-Origin": origin || "*", // DANGEROUS
        "Access-Control-Allow-Credentials": "true",
      },
    }
  );
}
```

### Wildcard with Credentials
```typescript
// VULNERABLE - Browsers will actually block this, but still bad
{
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Credentials": "true"
}
```

### Partial Origin Check
```typescript
// VULNERABLE - Can be bypassed
const origin = request.headers.get("Origin");
if (origin?.includes("example.com")) {
  // Allows: evil.example.com, example.com.evil.com
}

// SECURE - Exact match
if (ALLOWED_ORIGINS.includes(origin)) {
  // ...
}
```

## Rate Limiting

### In-Memory Rate Limiter
```typescript
// lib/rate-limit.ts
interface RateLimitStore {
  [key: string]: { count: number; resetTime: number };
}

const store: RateLimitStore = {};

export function rateLimit(
  identifier: string,
  limit: number = 100,
  windowMs: number = 60000
): { success: boolean; remaining: number } {
  const now = Date.now();
  const record = store[identifier];

  if (!record || now > record.resetTime) {
    store[identifier] = {
      count: 1,
      resetTime: now + windowMs,
    };
    return { success: true, remaining: limit - 1 };
  }

  if (record.count >= limit) {
    return { success: false, remaining: 0 };
  }

  record.count++;
  return { success: true, remaining: limit - record.count };
}
```

### API Route with Rate Limiting
```typescript
// app/api/data/route.ts
import { rateLimit } from "@/lib/rate-limit";
import { headers } from "next/headers";

export async function GET(request: Request) {
  const headersList = headers();
  const ip = headersList.get("x-forwarded-for") || "unknown";

  const { success, remaining } = rateLimit(ip, 100, 60000);

  if (!success) {
    return Response.json(
      { error: "Rate limit exceeded" },
      {
        status: 429,
        headers: {
          "Retry-After": "60",
          "X-RateLimit-Remaining": "0",
        },
      }
    );
  }

  return Response.json(
    { data: "response" },
    {
      headers: {
        "X-RateLimit-Remaining": remaining.toString(),
      },
    }
  );
}
```

### Redis Rate Limiter (Production)
```typescript
// lib/rate-limit-redis.ts
import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL!);

export async function rateLimitRedis(
  identifier: string,
  limit: number = 100,
  windowSec: number = 60
): Promise<{ success: boolean; remaining: number }> {
  const key = `ratelimit:${identifier}`;
  const now = Date.now();
  const windowStart = now - windowSec * 1000;

  // Use sorted set for sliding window
  await redis.zremrangebyscore(key, 0, windowStart);
  const count = await redis.zcard(key);

  if (count >= limit) {
    return { success: false, remaining: 0 };
  }

  await redis.zadd(key, now, `${now}-${Math.random()}`);
  await redis.expire(key, windowSec);

  return { success: true, remaining: limit - count - 1 };
}
```

### Upstash Rate Limiter
```typescript
// Using @upstash/ratelimit (Vercel-friendly)
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(100, "1 m"),
  analytics: true,
});

export async function GET(request: Request) {
  const ip = request.headers.get("x-forwarded-for") ?? "127.0.0.1";
  const { success, limit, reset, remaining } = await ratelimit.limit(ip);

  if (!success) {
    return Response.json(
      { error: "Too many requests" },
      {
        status: 429,
        headers: {
          "X-RateLimit-Limit": limit.toString(),
          "X-RateLimit-Remaining": remaining.toString(),
          "X-RateLimit-Reset": reset.toString(),
        },
      }
    );
  }

  return Response.json({ data: "response" });
}
```

## Endpoint-Specific Limits

### Tiered Rate Limiting
```typescript
const RATE_LIMITS = {
  "/api/auth/login": { limit: 5, window: 60000 },    // 5/min for auth
  "/api/auth/register": { limit: 3, window: 60000 }, // 3/min for registration
  "/api/data": { limit: 100, window: 60000 },        // 100/min for data
  default: { limit: 60, window: 60000 },             // 60/min default
};

export function getRateLimit(path: string) {
  return RATE_LIMITS[path] || RATE_LIMITS.default;
}
```

### User-Based Limits
```typescript
// Higher limits for authenticated users
async function getIdentifierAndLimit(request: Request) {
  const session = await getServerSession(authOptions);

  if (session?.user) {
    return {
      identifier: `user:${session.user.id}`,
      limit: 1000, // Authenticated users get more
    };
  }

  const ip = request.headers.get("x-forwarded-for") || "unknown";
  return {
    identifier: `ip:${ip}`,
    limit: 100, // Anonymous users get less
  };
}
```

## Vercel Configuration

### vercel.json Rate Limiting
```json
{
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 10
    }
  },
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Access-Control-Allow-Origin",
          "value": "https://app.example.com"
        }
      ]
    }
  ]
}
```

## Testing CORS

### Using cURL
```bash
# Test CORS preflight
curl -X OPTIONS https://example.com/api/data \
  -H "Origin: https://evil.com" \
  -H "Access-Control-Request-Method: POST" \
  -v

# Test with credentials
curl https://example.com/api/data \
  -H "Origin: https://evil.com" \
  -H "Cookie: session=xxx" \
  -v
```

### Using Browser Console
```javascript
// Test from browser console
fetch("https://example.com/api/data", {
  credentials: "include",
}).then(r => console.log(r.headers.get("Access-Control-Allow-Origin")));
```

## Testing Rate Limiting

```bash
# Rapid-fire requests to test limits
for i in {1..110}; do
  curl -s -o /dev/null -w "%{http_code}\n" https://example.com/api/data
done | sort | uniq -c
```

## OWASP Mapping

- **A01:2021 Broken Access Control** - CORS misconfiguration
- **A05:2021 Security Misconfiguration** - Missing rate limits

## Edge Cases

1. **Subdomain CORS** - Decide if subdomains should be allowed
2. **Localhost in production** - Remove localhost from allowed origins
3. **Rate limit by session, not IP** - For shared IPs (corporate networks)
4. **Webhook endpoints** - May need different CORS/rate limit rules
5. **GraphQL** - Single endpoint needs per-operation limiting
