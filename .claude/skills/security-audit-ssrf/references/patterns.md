# SSRF Prevention - Detailed Patterns

## Understanding SSRF in Next.js

SSRF occurs when an attacker can make the server fetch arbitrary URLs, potentially accessing:
- Internal services (databases, caches, admin panels)
- Cloud metadata endpoints (AWS/GCP/Azure credentials)
- Localhost services
- Private network resources

## Vulnerable Patterns

### Direct URL Fetch
```typescript
// VULNERABLE - No validation
export async function POST(request: Request) {
  const { url } = await request.json();
  const response = await fetch(url);
  return Response.json(await response.json());
}
```

### Image Proxy
```typescript
// VULNERABLE - Fetches any image
export async function GET(request: Request) {
  const imageUrl = new URL(request.url).searchParams.get("src");
  const response = await fetch(imageUrl!);
  const buffer = await response.arrayBuffer();
  return new Response(buffer, {
    headers: { "Content-Type": "image/png" },
  });
}
```

### Webhook Handler
```typescript
// VULNERABLE - Accepts any callback
export async function POST(request: Request) {
  const { callbackUrl, data } = await request.json();
  // Later...
  await fetch(callbackUrl, {
    method: "POST",
    body: JSON.stringify({ result: data }),
  });
}
```

## Secure Patterns

### URL Allowlist
```typescript
const ALLOWED_HOSTS = new Set([
  "api.example.com",
  "cdn.example.com",
  "data.example.com",
]);

function isAllowedUrl(urlString: string): boolean {
  try {
    const url = new URL(urlString);
    return ALLOWED_HOSTS.has(url.hostname) &&
           (url.protocol === "https:" || url.protocol === "http:");
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  const { url } = await request.json();

  if (!isAllowedUrl(url)) {
    return Response.json({ error: "URL not allowed" }, { status: 400 });
  }

  const response = await fetch(url);
  return Response.json(await response.json());
}
```

### Private IP Blocking
```typescript
import { isIP } from "net";
import dns from "dns/promises";

const PRIVATE_RANGES = [
  /^127\./,                          // 127.0.0.0/8
  /^10\./,                           // 10.0.0.0/8
  /^172\.(1[6-9]|2[0-9]|3[0-1])\./,  // 172.16.0.0/12
  /^192\.168\./,                     // 192.168.0.0/16
  /^169\.254\./,                     // 169.254.0.0/16 link-local
  /^0\./,                            // 0.0.0.0/8
  /^::1$/,                           // IPv6 localhost
  /^fe80:/i,                         // IPv6 link-local
  /^fc00:/i,                         // IPv6 unique local
  /^fd/i,                            // IPv6 unique local
];

function isPrivateIP(ip: string): boolean {
  return PRIVATE_RANGES.some(range => range.test(ip));
}

async function validateUrl(urlString: string): Promise<boolean> {
  try {
    const url = new URL(urlString);

    // Block non-HTTP protocols
    if (!["http:", "https:"].includes(url.protocol)) {
      return false;
    }

    // Resolve hostname to IP and check
    const hostname = url.hostname;

    // If already an IP, check directly
    if (isIP(hostname)) {
      return !isPrivateIP(hostname);
    }

    // Resolve DNS and check all IPs
    const addresses = await dns.resolve4(hostname);
    return !addresses.some(isPrivateIP);
  } catch {
    return false;
  }
}
```

### Comprehensive SSRF Protection
```typescript
import { isIP } from "net";
import dns from "dns/promises";

interface SafeFetchOptions {
  allowedHosts?: string[];
  blockPrivate?: boolean;
  followRedirects?: boolean;
  maxRedirects?: number;
}

async function safeFetch(
  urlString: string,
  options: SafeFetchOptions = {}
): Promise<Response> {
  const {
    allowedHosts,
    blockPrivate = true,
    followRedirects = false,
    maxRedirects = 0,
  } = options;

  const url = new URL(urlString);

  // Protocol check
  if (!["http:", "https:"].includes(url.protocol)) {
    throw new Error("Invalid protocol");
  }

  // Allowlist check
  if (allowedHosts && !allowedHosts.includes(url.hostname)) {
    throw new Error("Host not allowed");
  }

  // Private IP check
  if (blockPrivate) {
    const hostname = url.hostname;
    let ips: string[];

    if (isIP(hostname)) {
      ips = [hostname];
    } else {
      ips = await dns.resolve4(hostname).catch(() => []);
      const ipv6 = await dns.resolve6(hostname).catch(() => []);
      ips = [...ips, ...ipv6];
    }

    for (const ip of ips) {
      if (isPrivateIP(ip)) {
        throw new Error("Private IP not allowed");
      }
    }
  }

  // Fetch with redirect handling
  const response = await fetch(urlString, {
    redirect: followRedirects ? "follow" : "manual",
  });

  // If we get a redirect but aren't following, validate the redirect URL
  if (!followRedirects && response.status >= 300 && response.status < 400) {
    const location = response.headers.get("location");
    if (location) {
      // Recursively validate redirect target
      return safeFetch(new URL(location, urlString).href, {
        ...options,
        maxRedirects: maxRedirects - 1,
      });
    }
  }

  return response;
}
```

## Cloud Metadata Endpoints

### Attackers Target These
```
# AWS
http://169.254.169.254/latest/meta-data/
http://169.254.169.254/latest/user-data/
http://169.254.169.254/latest/api/token

# GCP
http://169.254.169.254/computeMetadata/v1/
http://metadata.google.internal/computeMetadata/v1/

# Azure
http://169.254.169.254/metadata/instance
http://169.254.169.254/metadata/identity/oauth2/token

# DigitalOcean
http://169.254.169.254/metadata/v1/
```

### Block Metadata Access
```typescript
const BLOCKED_HOSTS = [
  "169.254.169.254",
  "metadata.google.internal",
  "metadata.azure.com",
];

function isBlockedHost(hostname: string): boolean {
  return BLOCKED_HOSTS.some(blocked =>
    hostname === blocked || hostname.endsWith(`.${blocked}`)
  );
}
```

## DNS Rebinding Prevention

### The Attack
1. Attacker owns `evil.com`
2. First DNS query: `evil.com` -> `1.2.3.4` (public IP)
3. Server validates, seems safe
4. Second DNS query (for fetch): `evil.com` -> `127.0.0.1` (internal!)
5. Server fetches from localhost

### Prevention
```typescript
async function fetchWithDnsPin(urlString: string): Promise<Response> {
  const url = new URL(urlString);

  // Resolve IP ONCE and pin it
  const [ip] = await dns.resolve4(url.hostname);

  if (isPrivateIP(ip)) {
    throw new Error("Private IP");
  }

  // Create URL with resolved IP
  const pinnedUrl = new URL(urlString);
  pinnedUrl.hostname = ip;

  return fetch(pinnedUrl.href, {
    headers: {
      // Preserve original Host header
      Host: url.hostname,
    },
  });
}
```

## Next.js Image Configuration

### Vulnerable
```javascript
// next.config.js - Too permissive
module.exports = {
  images: {
    remotePatterns: [
      { hostname: "*" }, // DANGEROUS
    ],
    // OR
    domains: ["*"], // DANGEROUS
  },
};
```

### Secure
```javascript
// next.config.js
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.example.com",
        pathname: "/images/**",
      },
      {
        protocol: "https",
        hostname: "images.sitecore.com",
      },
    ],
  },
};
```

## Protocol Smuggling

### Block Dangerous Protocols
```typescript
const ALLOWED_PROTOCOLS = ["http:", "https:"];

// Block these:
// file:///etc/passwd
// gopher://internal:6379/_*1%0d%0a$8%0d%0aflushall
// dict://internal:11211/stats
// ftp://internal/file
```

## Testing SSRF

```bash
# Test for internal access
curl -X POST http://localhost:3000/api/fetch \
  -H "Content-Type: application/json" \
  -d '{"url": "http://127.0.0.1:3000/api/internal"}'

# Test cloud metadata
curl -X POST http://localhost:3000/api/fetch \
  -H "Content-Type: application/json" \
  -d '{"url": "http://169.254.169.254/latest/meta-data/"}'

# Test DNS rebinding (requires custom DNS)
curl -X POST http://localhost:3000/api/fetch \
  -H "Content-Type: application/json" \
  -d '{"url": "http://rebind.example.com/test"}'
```

## OWASP Mapping

- **A10:2021 Server-Side Request Forgery** - Direct SSRF category

## Vercel/Edge Runtime Considerations

- Vercel's Edge Runtime has limited `fetch` capabilities
- Some SSRF protections may need adjustment for Edge
- Serverless environments may have different network access than expected
