# Identity Provider Security - Detailed Patterns

## NextAuth.js Provider Security

### Secure Google Provider
```typescript
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "openid email profile",
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
};
```

### Secure Azure AD Provider
```typescript
import AzureADProvider from "next-auth/providers/azure-ad";

AzureADProvider({
  clientId: process.env.AZURE_AD_CLIENT_ID!,
  clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
  tenantId: process.env.AZURE_AD_TENANT_ID!,
  authorization: {
    params: {
      scope: "openid profile email User.Read",
    },
  },
})
```

### Custom OAuth Provider
```typescript
import type { OAuthConfig } from "next-auth/providers";

const CustomProvider: OAuthConfig<any> = {
  id: "custom",
  name: "Custom IDP",
  type: "oauth",
  authorization: {
    url: "https://idp.example.com/authorize",
    params: {
      scope: "openid profile email",
      response_type: "code",
    },
  },
  token: "https://idp.example.com/token",
  userinfo: "https://idp.example.com/userinfo",
  clientId: process.env.CUSTOM_CLIENT_ID!,
  clientSecret: process.env.CUSTOM_CLIENT_SECRET!,
  checks: ["pkce", "state"], // Enable both!
  profile(profile) {
    return {
      id: profile.sub,
      name: profile.name,
      email: profile.email,
    };
  },
};
```

## Callback Security

### Vulnerable Redirect Callback
```typescript
// VULNERABLE - Open redirect
callbacks: {
  redirect({ url }) {
    return url; // Attacker: ?callbackUrl=https://evil.com
  },
}
```

### Secure Redirect Callback
```typescript
// SECURE - Strict validation
callbacks: {
  redirect({ url, baseUrl }) {
    // Only allow relative URLs
    if (url.startsWith("/")) {
      return `${baseUrl}${url}`;
    }
    // Only allow same origin
    try {
      const urlObj = new URL(url);
      const baseUrlObj = new URL(baseUrl);
      if (urlObj.origin === baseUrlObj.origin) {
        return url;
      }
    } catch {
      // Invalid URL
    }
    return baseUrl;
  },
}
```

### Allowlisted External Redirects
```typescript
const ALLOWED_REDIRECT_HOSTS = [
  "app.example.com",
  "dashboard.example.com",
];

callbacks: {
  redirect({ url, baseUrl }) {
    try {
      const urlObj = new URL(url);
      if (ALLOWED_REDIRECT_HOSTS.includes(urlObj.hostname)) {
        return url;
      }
      if (url.startsWith(baseUrl)) {
        return url;
      }
    } catch {}
    return baseUrl;
  },
}
```

## Token Security

### JWT Callback Security
```typescript
callbacks: {
  jwt({ token, user, account }) {
    if (account && user) {
      token.accessToken = account.access_token;
      token.refreshToken = account.refresh_token;
      token.accessTokenExpires = account.expires_at! * 1000;
      token.id = user.id;
    }

    // Return if not expired
    if (Date.now() < (token.accessTokenExpires as number)) {
      return token;
    }

    // Token expired, refresh it
    return refreshAccessToken(token);
  },

  session({ session, token }) {
    // Only pass safe data to client
    session.user.id = token.id as string;
    // DON'T pass tokens to client:
    // session.accessToken = token.accessToken; // DANGEROUS
    return session;
  },
}
```

### Token Refresh Pattern
```typescript
async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    const response = await fetch("https://idp.example.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: process.env.CLIENT_ID!,
        client_secret: process.env.CLIENT_SECRET!,
        grant_type: "refresh_token",
        refresh_token: token.refreshToken as string,
      }),
    });

    const tokens = await response.json();

    if (!response.ok) throw tokens;

    return {
      ...token,
      accessToken: tokens.access_token,
      accessTokenExpires: Date.now() + tokens.expires_in * 1000,
      refreshToken: tokens.refresh_token ?? token.refreshToken,
    };
  } catch (error) {
    return { ...token, error: "RefreshAccessTokenError" };
  }
}
```

## PKCE Implementation

### What is PKCE?
Proof Key for Code Exchange prevents authorization code interception attacks.

### NextAuth PKCE (Automatic)
```typescript
// NextAuth uses PKCE by default for OAuth 2.0 providers
// Verify it's not disabled:
{
  checks: ["pkce", "state"], // Both should be present
}
```

### Manual PKCE Implementation
```typescript
import crypto from "crypto";

// Generate code verifier
function generateCodeVerifier(): string {
  return crypto.randomBytes(32).toString("base64url");
}

// Generate code challenge
function generateCodeChallenge(verifier: string): string {
  return crypto.createHash("sha256").update(verifier).digest("base64url");
}

// On auth start
const codeVerifier = generateCodeVerifier();
const codeChallenge = generateCodeChallenge(codeVerifier);
// Store codeVerifier in session
session.set("code_verifier", codeVerifier);

// Authorization URL
const authUrl = new URL("https://idp.example.com/authorize");
authUrl.searchParams.set("code_challenge", codeChallenge);
authUrl.searchParams.set("code_challenge_method", "S256");

// On callback - token request
const tokenResponse = await fetch("https://idp.example.com/token", {
  method: "POST",
  body: new URLSearchParams({
    code: authorizationCode,
    code_verifier: session.get("code_verifier"),
    // ... other params
  }),
});
```

## State Parameter (CSRF Protection)

### Proper State Handling
```typescript
// Generate state
const state = crypto.randomUUID();
cookies.set("oauth_state", state, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 60 * 10, // 10 minutes
});

// Include in auth URL
authUrl.searchParams.set("state", state);

// Verify on callback
const callbackState = searchParams.get("state");
const storedState = cookies.get("oauth_state");
if (!callbackState || callbackState !== storedState) {
  throw new Error("Invalid state parameter");
}
cookies.delete("oauth_state");
```

## Scope Security

### Minimal Scopes Principle
```typescript
// VULNERABLE - Excessive scopes
scope: "openid email profile admin:all write:all delete:all"

// SECURE - Minimal required scopes
scope: "openid email profile" // Only what's needed
```

### Dynamic Scope Requests
```typescript
// Request additional scopes only when needed
async function requestAdditionalAccess(userId: string) {
  const authUrl = new URL("https://idp.example.com/authorize");
  authUrl.searchParams.set("scope", "openid email calendar.read");
  authUrl.searchParams.set("prompt", "consent"); // Force consent for new scope
  // Redirect user...
}
```

## Session Configuration

### Secure Session Settings
```typescript
export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
    updateAge: 60 * 60, // Update every hour
  },
  jwt: {
    maxAge: 24 * 60 * 60,
  },
  cookies: {
    sessionToken: {
      name: `__Secure-next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: true,
      },
    },
  },
};
```

## Multi-Tenant Considerations

### Tenant Isolation
```typescript
callbacks: {
  signIn({ user, account, profile }) {
    // Verify user belongs to allowed tenant
    const allowedTenants = process.env.ALLOWED_TENANTS?.split(",") || [];
    const userTenant = profile?.tenant_id;

    if (!allowedTenants.includes(userTenant)) {
      return false; // Reject sign in
    }
    return true;
  },
}
```

## Testing OAuth Security

### Using cURL to Test Callbacks
```bash
# Test open redirect
curl -v "http://localhost:3000/api/auth/signin?callbackUrl=https://evil.com"

# Test callback with manipulated state
curl -v "http://localhost:3000/api/auth/callback/google?code=xxx&state=manipulated"
```

### Using Browser DevTools
- Check Network tab for OAuth redirects
- Verify state parameter is present and validated
- Check cookies for secure flags

## OWASP Mapping

- **A01:2021 Broken Access Control** - Improper callback validation
- **A07:2021 Identification and Authentication Failures** - Weak OAuth config

## Sitecore Identity Considerations

When using Sitecore Identity:
- Verify CM/CD authentication separation
- Check that editing tokens are properly scoped
- Ensure preview mode uses appropriate auth
- Validate that personalization doesn't bypass auth
