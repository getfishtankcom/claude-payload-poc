# API & Encryption Security - Detailed Patterns

## HTTPS Enforcement

### Next.js HTTPS Redirect
```javascript
// next.config.js
module.exports = {
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "header", key: "x-forwarded-proto", value: "http" }],
        destination: "https://example.com/:path*",
        permanent: true,
      },
    ];
  },
};
```

### Middleware HTTPS Check
```typescript
// middleware.ts
import { NextResponse } from "next/server";

export function middleware(request: Request) {
  const proto = request.headers.get("x-forwarded-proto");

  if (proto === "http" && process.env.NODE_ENV === "production") {
    const url = new URL(request.url);
    url.protocol = "https:";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
```

## Secure API Client

### Base API Client
```typescript
// lib/api-client.ts
const API_BASE_URL = process.env.API_URL; // Server-side env var

interface ApiOptions extends RequestInit {
  timeout?: number;
}

export async function apiClient<T>(
  endpoint: string,
  options: ApiOptions = {}
): Promise<T> {
  const { timeout = 30000, ...fetchOptions } = options;

  // Ensure HTTPS in production
  const url = new URL(endpoint, API_BASE_URL);
  if (process.env.NODE_ENV === "production" && url.protocol !== "https:") {
    throw new Error("HTTPS required in production");
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url.toString(), {
      ...fetchOptions,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.API_KEY}`,
        ...fetchOptions.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return response.json();
  } finally {
    clearTimeout(timeoutId);
  }
}
```

### Third-Party API Wrapper
```typescript
// lib/stripe-client.ts
import Stripe from "stripe";

// Server-side only
if (typeof window !== "undefined") {
  throw new Error("Stripe client must only be used server-side");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
  typescript: true,
});
```

## TLS Configuration

### Vulnerable Patterns
```typescript
// CRITICAL VULNERABILITY - Never do this:
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// CRITICAL VULNERABILITY:
const https = require("https");
const agent = new https.Agent({
  rejectUnauthorized: false, // Disables ALL certificate validation
});

// VULNERABLE - Ignoring cert errors:
fetch(url).catch(() => {
  // Silently failing on TLS errors
});
```

### Secure TLS Configuration
```typescript
import https from "https";
import fs from "fs";

// If you need custom CA (internal PKI):
const agent = new https.Agent({
  ca: fs.readFileSync("/path/to/ca-cert.pem"),
  rejectUnauthorized: true, // Always true
});

// For fetch with custom agent:
import { Agent } from "undici";

const secureAgent = new Agent({
  connect: {
    ca: fs.readFileSync("/path/to/ca-cert.pem"),
    rejectUnauthorized: true,
  },
});
```

## Encryption Patterns

### Weak vs Strong Algorithms
```typescript
import crypto from "crypto";

// ❌ VULNERABLE - Weak algorithms
crypto.createCipher("des", password);      // DES is broken
crypto.createCipher("rc4", password);      // RC4 is broken
crypto.createHash("md5");                   // MD5 is broken for security
crypto.createHash("sha1");                  // SHA1 is deprecated

// ✅ SECURE - Strong algorithms
crypto.createCipheriv("aes-256-gcm", key, iv);
crypto.createHash("sha256");
crypto.createHash("sha384");
crypto.createHash("sha512");
```

### Secure Encryption Example
```typescript
import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;

export function encrypt(text: string, key: Buffer): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  const authTag = cipher.getAuthTag();

  // Format: iv:authTag:encrypted
  return `${iv.toString("hex")}:${authTag.toString("hex")}:${encrypted}`;
}

export function decrypt(encryptedData: string, key: Buffer): string {
  const [ivHex, authTagHex, encrypted] = encryptedData.split(":");

  const iv = Buffer.from(ivHex, "hex");
  const authTag = Buffer.from(authTagHex, "hex");

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}
```

### Password Hashing
```typescript
import bcrypt from "bcrypt";

// ❌ VULNERABLE - Plain hash
const hash = crypto.createHash("sha256").update(password).digest("hex");

// ✅ SECURE - bcrypt with proper cost factor
const SALT_ROUNDS = 12; // Adjust based on performance needs
const hash = await bcrypt.hash(password, SALT_ROUNDS);

// Verification
const isValid = await bcrypt.compare(password, hash);
```

## API Request Security

### Secure Request Headers
```typescript
export async function secureApiCall(endpoint: string, data: unknown) {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.API_KEY}`,
      "X-Request-ID": crypto.randomUUID(), // For tracing
      "X-Client-Version": process.env.APP_VERSION || "unknown",
    },
    body: JSON.stringify(data),
  });

  return response;
}
```

### Request Signing
```typescript
import crypto from "crypto";

function signRequest(method: string, url: string, body: string): string {
  const timestamp = Date.now().toString();
  const message = `${method}:${url}:${body}:${timestamp}`;

  const signature = crypto
    .createHmac("sha256", process.env.API_SECRET!)
    .update(message)
    .digest("hex");

  return `${timestamp}.${signature}`;
}

export async function signedApiCall(endpoint: string, data: unknown) {
  const body = JSON.stringify(data);
  const signature = signRequest("POST", endpoint, body);

  return fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Signature": signature,
    },
    body,
  });
}
```

## Webhook Verification

### Stripe Webhook Verification
```typescript
import Stripe from "stripe";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return Response.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Process verified event...
}
```

### Generic Webhook HMAC Verification
```typescript
function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}
```

## Certificate Pinning (Advanced)

```typescript
import https from "https";
import tls from "tls";

const EXPECTED_FINGERPRINT = "XX:XX:XX:XX:..."; // SHA256 fingerprint

const agent = new https.Agent({
  checkServerIdentity: (host, cert) => {
    const fingerprint = cert.fingerprint256;
    if (fingerprint !== EXPECTED_FINGERPRINT) {
      throw new Error("Certificate fingerprint mismatch");
    }
    // Continue with normal hostname verification
    return tls.checkServerIdentity(host, cert);
  },
});
```

## Testing API Security

### Using cURL
```bash
# Check HTTPS redirect
curl -v http://example.com/api/data

# Check TLS version
curl -v --tlsv1.2 https://example.com/api/data

# Check certificate
openssl s_client -connect example.com:443 -showcerts
```

### Using Browser DevTools
1. Network tab → Check Protocol column
2. Security tab → View certificate details
3. Console → Check for mixed content warnings

## OWASP Mapping

- **A02:2021 Cryptographic Failures** - Weak crypto, missing TLS
- **A05:2021 Security Misconfiguration** - Disabled TLS verification

## Sitecore API Considerations

```typescript
// Ensure HTTPS for Experience Edge
const SITECORE_EDGE_URL = "https://edge.sitecorecloud.io";

// Verify API key is server-side only
const sitecoreConfig = {
  apiKey: process.env.SITECORE_API_KEY, // Not NEXT_PUBLIC_
  apiHost: process.env.SITECORE_API_HOST,
};
```
