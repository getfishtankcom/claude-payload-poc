# Data Protection & Privacy - Detailed Patterns

## Cookie Consent Implementation

### Cookie Consent Component
```typescript
// components/CookieConsent.tsx
"use client";

import { useState, useEffect } from "react";

interface ConsentState {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [consent, setConsent] = useState<ConsentState>({
    necessary: true, // Always required
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const savedConsent = localStorage.getItem("cookieConsent");
    if (!savedConsent) {
      setShowBanner(true);
    } else {
      setConsent(JSON.parse(savedConsent));
    }
  }, []);

  const handleAcceptAll = () => {
    const fullConsent = { necessary: true, analytics: true, marketing: true };
    localStorage.setItem("cookieConsent", JSON.stringify(fullConsent));
    setConsent(fullConsent);
    setShowBanner(false);
    updateTracking(fullConsent);
  };

  const handleAcceptNecessary = () => {
    const minimalConsent = { necessary: true, analytics: false, marketing: false };
    localStorage.setItem("cookieConsent", JSON.stringify(minimalConsent));
    setConsent(minimalConsent);
    setShowBanner(false);
    updateTracking(minimalConsent);
  };

  if (!showBanner) return null;

  return (
    <div className="cookie-banner">
      <p>We use cookies to improve your experience.</p>
      <button onClick={handleAcceptNecessary}>Necessary Only</button>
      <button onClick={handleAcceptAll}>Accept All</button>
    </div>
  );
}
```

### Google Analytics with Consent
```typescript
// lib/analytics.ts
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

export function initializeAnalytics(consent: boolean) {
  // Start with consent denied
  window.gtag("consent", "default", {
    analytics_storage: "denied",
    ad_storage: "denied",
  });

  if (consent) {
    window.gtag("consent", "update", {
      analytics_storage: "granted",
    });
  }
}

export function updateAnalyticsConsent(granted: boolean) {
  window.gtag("consent", "update", {
    analytics_storage: granted ? "granted" : "denied",
  });
}
```

## PII Handling

### Encryption for Sensitive Data
```typescript
// lib/encryption.ts
import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const KEY = Buffer.from(process.env.ENCRYPTION_KEY!, "hex"); // 32 bytes

export function encryptPII(plaintext: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);

  let encrypted = cipher.update(plaintext, "utf8", "hex");
  encrypted += cipher.final("hex");

  const authTag = cipher.getAuthTag();

  return `${iv.toString("hex")}:${authTag.toString("hex")}:${encrypted}`;
}

export function decryptPII(encryptedData: string): string {
  const [ivHex, authTagHex, encrypted] = encryptedData.split(":");

  const iv = Buffer.from(ivHex, "hex");
  const authTag = Buffer.from(authTagHex, "hex");

  const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}
```

### Database Model with Encrypted Fields
```typescript
// prisma/schema.prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  // Sensitive fields stored encrypted
  ssn       String?  // Encrypted
  taxId     String?  // Encrypted
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

// lib/user-service.ts
export async function createUser(data: {
  email: string;
  ssn?: string;
  taxId?: string;
}) {
  return prisma.user.create({
    data: {
      email: data.email,
      ssn: data.ssn ? encryptPII(data.ssn) : null,
      taxId: data.taxId ? encryptPII(data.taxId) : null,
    },
  });
}
```

## GDPR Data Rights

### Data Export (Right to Portability)
```typescript
// app/api/user/export/route.ts
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Gather all user data
  const userData = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      posts: true,
      comments: true,
      orders: true,
      preferences: true,
    },
  });

  // Decrypt sensitive fields before export
  if (userData?.ssn) {
    userData.ssn = decryptPII(userData.ssn);
  }

  // Return as downloadable JSON
  return new Response(JSON.stringify(userData, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="user-data-${session.user.id}.json"`,
    },
  });
}
```

### Data Deletion (Right to Erasure)
```typescript
// app/api/user/delete/route.ts
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Use transaction to ensure complete deletion
  await prisma.$transaction([
    // Delete related data first
    prisma.comment.deleteMany({ where: { userId: session.user.id } }),
    prisma.post.deleteMany({ where: { userId: session.user.id } }),
    prisma.order.deleteMany({ where: { userId: session.user.id } }),
    prisma.preference.deleteMany({ where: { userId: session.user.id } }),
    // Delete user last
    prisma.user.delete({ where: { id: session.user.id } }),
  ]);

  // Clear session
  // Notify user via email about successful deletion

  return Response.json({
    success: true,
    message: "Your account and all associated data have been deleted",
  });
}
```

### Data Anonymization (Alternative to Deletion)
```typescript
// For cases where deletion isn't possible (legal requirements, etc.)
export async function anonymizeUser(userId: string) {
  const anonymousId = `anon_${crypto.randomUUID()}`;

  await prisma.user.update({
    where: { id: userId },
    data: {
      email: `${anonymousId}@deleted.local`,
      name: "Deleted User",
      ssn: null,
      taxId: null,
      phone: null,
      address: null,
      deletedAt: new Date(),
    },
  });
}
```

## Cookie Configuration

### Secure Cookie Settings
```typescript
// lib/cookies.ts
import { cookies } from "next/headers";

export function setSecureCookie(
  name: string,
  value: string,
  options: {
    httpOnly?: boolean;
    secure?: boolean;
    sameSite?: "strict" | "lax" | "none";
    maxAge?: number;
  } = {}
) {
  cookies().set(name, value, {
    httpOnly: options.httpOnly ?? true,
    secure: process.env.NODE_ENV === "production",
    sameSite: options.sameSite ?? "strict",
    maxAge: options.maxAge ?? 60 * 60 * 24 * 7, // 1 week default
    path: "/",
  });
}

// Cookie categories
export const COOKIE_CATEGORIES = {
  necessary: [
    "session-token",
    "csrf-token",
  ],
  functional: [
    "language",
    "theme",
  ],
  analytics: [
    "_ga",
    "_gid",
    "_gat",
  ],
  marketing: [
    "_fbp",
    "fr",
  ],
};
```

## Third-Party Data Sharing

### Disclosure Requirements
```typescript
// Track third-party services
const THIRD_PARTY_SERVICES = [
  {
    name: "Google Analytics",
    purpose: "Website analytics",
    dataShared: ["Page views", "Device info", "Location (country)"],
    privacyPolicy: "https://policies.google.com/privacy",
  },
  {
    name: "Stripe",
    purpose: "Payment processing",
    dataShared: ["Name", "Email", "Payment info"],
    privacyPolicy: "https://stripe.com/privacy",
  },
  // List all third parties
];

// Generate privacy policy content
export function generateThirdPartyDisclosure() {
  return THIRD_PARTY_SERVICES.map(service => ({
    ...service,
    consentRequired: service.purpose !== "Payment processing", // Essential services may not need consent
  }));
}
```

## Data Retention

### Automatic Data Cleanup
```typescript
// lib/data-retention.ts
import { prisma } from "@/lib/prisma";

const RETENTION_POLICIES = {
  sessions: 30, // days
  logs: 90,
  analytics: 365,
  deletedUsers: 30, // soft delete retention
};

export async function cleanupOldData() {
  const now = new Date();

  // Clean old sessions
  const sessionCutoff = new Date(
    now.getTime() - RETENTION_POLICIES.sessions * 24 * 60 * 60 * 1000
  );
  await prisma.session.deleteMany({
    where: { updatedAt: { lt: sessionCutoff } },
  });

  // Permanently delete soft-deleted users after retention period
  const deletedUserCutoff = new Date(
    now.getTime() - RETENTION_POLICIES.deletedUsers * 24 * 60 * 60 * 1000
  );
  await prisma.user.deleteMany({
    where: {
      deletedAt: { not: null, lt: deletedUserCutoff },
    },
  });
}
```

## Privacy-By-Design Patterns

### Minimal Data Collection
```typescript
// Only collect what's necessary
interface RegistrationData {
  email: string;
  // Don't ask for data you don't need:
  // phoneNumber?: string;
  // dateOfBirth?: Date;
  // address?: string;
}
```

### Purpose Limitation
```typescript
// Document and enforce data usage purposes
const DATA_PURPOSES = {
  email: ["account-recovery", "order-notifications"],
  // If adding marketing, must get explicit consent
};

function canUseDataFor(field: string, purpose: string): boolean {
  return DATA_PURPOSES[field]?.includes(purpose) ?? false;
}
```

## OWASP Mapping

- **A02:2021 Cryptographic Failures** - Unencrypted PII
- **A01:2021 Broken Access Control** - User data access controls

## Compliance Checklist

### GDPR Requirements
- [ ] Cookie consent banner
- [ ] Privacy policy
- [ ] Data export capability
- [ ] Data deletion capability
- [ ] Data processing records
- [ ] Consent management
- [ ] Breach notification process
- [ ] Data protection impact assessment (if applicable)

### CCPA Requirements
- [ ] "Do Not Sell" option
- [ ] Privacy policy with CCPA disclosures
- [ ] Data access request handling
- [ ] Data deletion request handling
