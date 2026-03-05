# GraphQL Security - Detailed Patterns

## Apollo Server Configuration

### Secure Apollo Server Setup
```typescript
import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import depthLimit from "graphql-depth-limit";
import { createComplexityLimitRule } from "graphql-validation-complexity";

const server = new ApolloServer({
  schema,
  introspection: process.env.NODE_ENV !== "production",
  validationRules: [
    depthLimit(10),
    createComplexityLimitRule(1000, {
      scalarCost: 1,
      objectCost: 10,
      listFactor: 20,
    }),
  ],
  formatError: (error) => {
    // Don't expose internal errors in production
    if (process.env.NODE_ENV === "production") {
      return { message: "Internal server error" };
    }
    return error;
  },
});
```

### GraphQL Yoga Setup
```typescript
import { createYoga } from "graphql-yoga";
import { useDepthLimit } from "@envelop/depth-limit";
import { useDisableIntrospection } from "@envelop/disable-introspection";

const yoga = createYoga({
  schema,
  plugins: [
    process.env.NODE_ENV === "production" && useDisableIntrospection(),
    useDepthLimit({ maxDepth: 10 }),
  ].filter(Boolean),
});
```

## Query Depth Attack

### Vulnerable Schema
```graphql
type User {
  id: ID!
  name: String!
  friends: [User!]!  # Self-referential = depth attack vector
}

type Query {
  user(id: ID!): User
}
```

### Attack Query
```graphql
query DeepNested {
  user(id: "1") {
    friends {
      friends {
        friends {
          friends {
            friends {
              friends {
                # ... exponential resource consumption
              }
            }
          }
        }
      }
    }
  }
}
```

### Prevention
```typescript
import depthLimit from "graphql-depth-limit";

// Limit query depth to 10 levels
const server = new ApolloServer({
  validationRules: [depthLimit(10)],
});
```

## Batching Attacks

### Attack Example
```json
[
  { "query": "{ user(id: \"1\") { email } }" },
  { "query": "{ user(id: \"2\") { email } }" },
  // ... thousands more
]
```

### Prevention
```typescript
// Limit batch size
const server = new ApolloServer({
  allowBatchedHttpRequests: false, // Disable batching
  // OR limit batch size:
  // plugins: [ApolloServerPluginLandingPageDisabled()],
});

// Rate limit per client
import rateLimit from "express-rate-limit";
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
```

## Resolver Authorization

### Vulnerable: No Auth Check
```typescript
const resolvers = {
  Query: {
    // VULNERABLE - Anyone can query any user
    user: async (_, { id }) => {
      return db.user.findUnique({ where: { id } });
    },
  },
  Mutation: {
    // VULNERABLE - Anyone can delete
    deleteUser: async (_, { id }) => {
      return db.user.delete({ where: { id } });
    },
  },
};
```

### Secure: With Auth Checks
```typescript
import { AuthenticationError, ForbiddenError } from "apollo-server-micro";

const resolvers = {
  Query: {
    user: async (_, { id }, context) => {
      if (!context.user) {
        throw new AuthenticationError("Must be logged in");
      }
      // Users can only query themselves unless admin
      if (context.user.id !== id && context.user.role !== "admin") {
        throw new ForbiddenError("Not authorized");
      }
      return db.user.findUnique({ where: { id } });
    },
  },
  Mutation: {
    deleteUser: async (_, { id }, context) => {
      if (!context.user || context.user.role !== "admin") {
        throw new ForbiddenError("Admin access required");
      }
      return db.user.delete({ where: { id } });
    },
  },
};
```

### Directive-Based Auth
```graphql
directive @auth(requires: Role = USER) on FIELD_DEFINITION

enum Role {
  USER
  ADMIN
}

type Query {
  publicData: String
  userData: User @auth
  adminData: AdminInfo @auth(requires: ADMIN)
}
```

## Field-Level Authorization

### Vulnerable: Leaking Sensitive Fields
```typescript
const resolvers = {
  User: {
    // All fields exposed to anyone who can query user
    email: (parent) => parent.email,
    password: (parent) => parent.password, // CRITICAL: Never expose!
    ssn: (parent) => parent.ssn,
  },
};
```

### Secure: Field-Level Checks
```typescript
const resolvers = {
  User: {
    email: (parent, _, context) => {
      // Only show email to self or admin
      if (context.user?.id === parent.id || context.user?.role === "admin") {
        return parent.email;
      }
      return null;
    },
    // Never include password field in schema
    // Sensitive fields require explicit auth
  },
};
```

## Introspection Queries

### What Attackers Get from Introspection
```graphql
# Full schema discovery
{
  __schema {
    types {
      name
      fields {
        name
        type { name }
      }
    }
  }
}

# Find all queries
{
  __schema {
    queryType {
      fields { name description }
    }
    mutationType {
      fields { name description }
    }
  }
}
```

### Disable in Production
```typescript
// Apollo
const server = new ApolloServer({
  introspection: process.env.NODE_ENV !== "production",
});

// Yoga with plugin
import { useDisableIntrospection } from "@envelop/disable-introspection";

const yoga = createYoga({
  plugins: [
    process.env.NODE_ENV === "production" && useDisableIntrospection(),
  ],
});
```

## Error Information Leakage

### Vulnerable Error Handling
```typescript
// VULNERABLE - Exposes internal details
const resolvers = {
  Query: {
    user: async (_, { id }) => {
      try {
        return await db.user.findUnique({ where: { id } });
      } catch (error) {
        throw new Error(`Database error: ${error.message}`);
        // Exposes: "Database error: connection refused to postgres:5432"
      }
    },
  },
};
```

### Secure Error Handling
```typescript
import { GraphQLError } from "graphql";

const resolvers = {
  Query: {
    user: async (_, { id }) => {
      try {
        return await db.user.findUnique({ where: { id } });
      } catch (error) {
        console.error("User query failed:", error);
        throw new GraphQLError("Unable to fetch user", {
          extensions: { code: "INTERNAL_ERROR" },
        });
      }
    },
  },
};

// Global error formatter
const server = new ApolloServer({
  formatError: (error) => {
    // Log full error server-side
    console.error(error);

    // Return sanitized error to client
    if (process.env.NODE_ENV === "production") {
      if (error.extensions?.code === "INTERNAL_SERVER_ERROR") {
        return { message: "Internal server error" };
      }
    }
    return error;
  },
});
```

## Persisted Queries

### Secure Approach
```typescript
import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginPersistedQueries } from "@apollo/server/plugin/persistedQueries";
import { createHash } from "crypto";

const server = new ApolloServer({
  plugins: [
    ApolloServerPluginPersistedQueries({
      cache,
      generateHash: (query) =>
        createHash("sha256").update(query).digest("hex"),
    }),
  ],
});
```

## OWASP Mapping

- **A01:2021 Broken Access Control** - Missing resolver auth
- **A04:2021 Insecure Design** - No depth/complexity limits
- **A05:2021 Security Misconfiguration** - Introspection enabled

## Sitecore GraphQL Considerations

When using Sitecore's GraphQL:
- Check if Sitecore's GraphQL endpoint requires auth
- Verify preview mode doesn't expose draft content
- Ensure Experience Edge queries are rate-limited
- Check that personalization data isn't leaked via GraphQL

## Testing Commands

```bash
# Check for introspection
curl -X POST http://localhost:3000/api/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ __schema { types { name } } }"}'

# Test depth
curl -X POST http://localhost:3000/api/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ user { friends { friends { friends { id } } } } }"}'
```
