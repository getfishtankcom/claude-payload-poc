# Security Headers - Detailed Patterns

## Complete Security Headers Configuration

### next.config.js Full Example
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        // Apply to all routes
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: ContentSecurityPolicy.replace(/\n/g, ""),
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
```

## Content Security Policy (CSP)

### Minimal Secure CSP
```javascript
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  font-src 'self';
  connect-src 'self';
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self';
`;
```

### CSP for Next.js with Common Integrations
```javascript
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  img-src 'self' data: blob: https:;
  font-src 'self' https://fonts.gstatic.com;
  connect-src 'self' https://api.example.com https://www.google-analytics.com;
  frame-src 'self' https://www.youtube.com;
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self';
  upgrade-insecure-requests;
`;
```

### CSP Nonces for Inline Scripts
```typescript
// middleware.ts
import { NextResponse } from "next/server";
import crypto from "crypto";

export function middleware(request: Request) {
  const nonce = crypto.randomBytes(16).toString("base64");
  const response = NextResponse.next();

  response.headers.set(
    "Content-Security-Policy",
    `script-src 'self' 'nonce-${nonce}'; style-src 'self' 'nonce-${nonce}';`
  );

  // Pass nonce to page via header
  response.headers.set("x-nonce", nonce);
  return response;
}

// app/layout.tsx
import { headers } from "next/headers";

export default function RootLayout({ children }) {
  const nonce = headers().get("x-nonce") || "";

  return (
    <html>
      <head>
        <script nonce={nonce} src="/analytics.js" />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

### Report-Only CSP for Testing
```javascript
{
  key: "Content-Security-Policy-Report-Only",
  value: `${cspDirectives}; report-uri /api/csp-report;`
}
```

## Strict-Transport-Security (HSTS)

### Full HSTS Configuration
```javascript
{
  key: "Strict-Transport-Security",
  value: "max-age=31536000; includeSubDomains; preload"
}
```

### HSTS Parameters
| Parameter | Description |
|-----------|-------------|
| `max-age=31536000` | HTTPS only for 1 year |
| `includeSubDomains` | Apply to all subdomains |
| `preload` | Allow HSTS preload list inclusion |

### Warning
- Only enable `preload` if you're sure ALL subdomains support HTTPS
- `preload` is difficult to undo (cached in browsers)

## X-Frame-Options vs frame-ancestors

### X-Frame-Options (Legacy)
```javascript
// Prevent all framing
{ key: "X-Frame-Options", value: "DENY" }

// Allow same origin only
{ key: "X-Frame-Options", value: "SAMEORIGIN" }
```

### CSP frame-ancestors (Modern)
```javascript
// In CSP directive:
"frame-ancestors 'none';"           // Equivalent to DENY
"frame-ancestors 'self';"           // Equivalent to SAMEORIGIN
"frame-ancestors https://trusted.com;" // Allow specific origins
```

### Use Both
```javascript
// For maximum compatibility
{
  key: "Content-Security-Policy",
  value: "frame-ancestors 'none';"
},
{
  key: "X-Frame-Options",
  value: "DENY"
}
```

## Permissions-Policy

### Disable Dangerous Features
```javascript
{
  key: "Permissions-Policy",
  value: [
    "camera=()",
    "microphone=()",
    "geolocation=()",
    "interest-cohort=()",  // Disable FLoC
    "payment=()",
    "usb=()",
    "magnetometer=()",
    "gyroscope=()",
    "accelerometer=()",
  ].join(", ")
}
```

### Allow Specific Origins
```javascript
{
  key: "Permissions-Policy",
  value: "camera=(self), microphone=(self https://meet.example.com)"
}
```

## Middleware-Based Headers

### Dynamic Headers in Middleware
```typescript
// middleware.ts
import { NextResponse } from "next/server";

export function middleware(request: Request) {
  const response = NextResponse.next();

  // Add security headers
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains"
  );

  // Dynamic CSP based on route
  const pathname = new URL(request.url).pathname;
  if (pathname.startsWith("/admin")) {
    response.headers.set(
      "Content-Security-Policy",
      "default-src 'self'; frame-ancestors 'none';"
    );
  }

  return response;
}
```

## Vercel Configuration

### vercel.json Headers
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "Strict-Transport-Security",
          "value": "max-age=31536000; includeSubDomains"
        }
      ]
    }
  ]
}
```

## Testing Security Headers

### Online Tools
- https://securityheaders.com
- https://observatory.mozilla.org

### Command Line
```bash
# Check all headers
curl -I https://example.com

# Check specific header
curl -s -D - https://example.com -o /dev/null | grep -i "content-security-policy"
```

## Common CSP Issues

### Too Permissive
```javascript
// VULNERABLE - Defeats CSP purpose
"script-src 'self' 'unsafe-inline' 'unsafe-eval' *;"
```

### Missing Directives
```javascript
// VULNERABLE - No default-src fallback
"script-src 'self';" // Other resource types unrestricted
```

### Secure Pattern
```javascript
// Start restrictive, add as needed
"default-src 'none'; script-src 'self'; connect-src 'self'; img-src 'self'; style-src 'self';"
```

## OWASP Mapping

- **A05:2021 Security Misconfiguration** - Missing/incorrect headers
- **A03:2021 Injection** - CSP prevents XSS exploitation

## Sitecore Considerations

### CSP for Sitecore CDN
```javascript
const ContentSecurityPolicy = `
  default-src 'self';
  img-src 'self' https://*.sitecorecloud.io https://edge.sitecorecloud.io;
  script-src 'self' https://feaas.blob.core.windows.net;
  connect-src 'self' https://edge.sitecorecloud.io https://*.sitecore.cloud;
  style-src 'self' 'unsafe-inline';
`;
```

### Experience Editor Compatibility
When using Sitecore Experience Editor, you may need to relax CSP:
```javascript
// For editing mode only
if (process.env.SITECORE_EDITING_MODE) {
  csp = `${csp} frame-ancestors https://your-sitecore-cm.com;`;
}
```
