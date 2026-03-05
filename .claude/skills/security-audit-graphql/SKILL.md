---
description: Audit GraphQL security in Next.js apps. Use for "GraphQL security", "query depth", "introspection check", "GraphQL audit", or "resolver security".
---

# GraphQL Security Audit

## Quick Reference

Check for:
- Introspection enabled in production
- No query depth/complexity limits
- Missing authentication on resolvers
- Batching attacks possible
- Field-level authorization gaps

## Files to Examine

```
app/api/graphql/route.ts
pages/api/graphql.ts
graphql/schema.ts, schema.graphql
graphql/resolvers/**/*.ts
lib/graphql.ts, apollo.ts
codegen.ts (GraphQL Codegen config)
```

## Search Patterns

```bash
# Find GraphQL setup
grep -r "ApolloServer\|createYoga\|graphql-http\|makeExecutableSchema" --include="*.ts"

# Find introspection settings
grep -r "introspection\|__schema" --include="*.ts"

# Find depth limit
grep -r "depthLimit\|queryDepth\|maxDepth" --include="*.ts"

# Find resolvers
grep -r "Query:\|Mutation:\|resolvers" --include="*.ts"

# Find auth in resolvers
grep -r "context.user\|context.session\|isAuthenticated" --include="*.ts"
```

## Critical Checks

### 1. Introspection in Production
```typescript
// VULNERABLE - Introspection always on:
const server = new ApolloServer({
  schema,
  introspection: true, // Should be false in production
});

// SECURE:
const server = new ApolloServer({
  schema,
  introspection: process.env.NODE_ENV !== "production",
});
```

### 2. Query Depth Limits
```typescript
// Required for DoS prevention:
import depthLimit from "graphql-depth-limit";

const server = new ApolloServer({
  schema,
  validationRules: [depthLimit(10)],
});
```

### 3. Query Complexity
```typescript
// Prevent expensive queries:
import { createComplexityLimitRule } from "graphql-validation-complexity";

const complexityRule = createComplexityLimitRule(1000);
```

### 4. Resolver Authentication
```typescript
// Every sensitive resolver must check auth:
const resolvers = {
  Query: {
    user: async (_, { id }, context) => {
      if (!context.user) throw new AuthenticationError("Not authenticated");
      return db.user.findUnique({ where: { id } });
    },
  },
};
```

## Severity Guidelines

| Finding | Severity |
|---------|----------|
| No auth on sensitive resolvers | Critical |
| Introspection enabled in prod | High |
| No query depth limit | High |
| No complexity limit | Medium |
| Batching without rate limit | Medium |
| Verbose error messages | Low |

## Common Findings

1. **Introspection always enabled** - Schema exposed to attackers
2. **Missing depth limits** - Nested query DoS attacks
3. **Resolver auth gaps** - Some resolvers skip auth checks
4. **No rate limiting** - Batched queries overwhelm server
5. **Sensitive data in errors** - Stack traces exposed

For detailed patterns and edge cases, see `references/patterns.md`
