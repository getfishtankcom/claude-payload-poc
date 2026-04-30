# Spike — `@fishtank/payload-plugin-content-tree` Code Sketch

> **Companion to** `.ai-reports/spike-content-tree-plugin.md`.
> Sister doc covers the *what & why*. This doc is the *here's the code shape* — file-by-file skeleton a dev can open the repo with and start filling in on day 1.
>
> **Decisions locked from the grill-me session:**
> - Goal: consumer hack-a-thon, separate public repo, FRAS dogfoods.
> - Repo: `github.com/getfishtank/payload-plugin-content-tree`, MIT, no npm in v0.1 (install via tag).
> - Tech: built on `react-arborist` (not the homegrown DnD).
> - Sequence: plugin first, FRAS swaps after v0.1 tag.
> - Field model: contract (consumer defines fields, plugin validates), no injection.
> - Package manager: pnpm workspaces.
> - Bundle: ESM-only, two entry points (`.`, `./client`), tsup.

---

## 1. Final v0.1 requirements (locked)

Anchored from Q6 of the grilling session.

**Functional**
- F1. `contentTreePlugin(opts)` plugin factory; throws on bad config at `buildConfig` time.
- F2. Custom admin view at `opts.adminPath` (default `/tree`).
- F3. Tree built on `react-arborist` — virtualized, lazy-load on expand, persisted expand state.
- F4. Right-click menu — Insert (config-driven), Open in new tab, Duplicate, Rename, Delete.
- F5. DnD reorder + reparent via arborist; server reorder is atomic on `parent` + `sortOrder`.
- F6. Deep search — server endpoint, returns ancestor IDs for client auto-expand.
- F7. Optional gutter — workflow dot + lock icon, only when fields are mapped.
- F8. `editUrlBuilder?: (node) => string` — Puck consumers override iframe target.

**Non-functional**
- NF1. `payload@^3` peer; React 18 + 19 compat; ESM-only; admin chunk ≤ 80 kB gzip.
- NF2. Generated TS types, exported and round-tripped through `examples/basic`.
- NF3. Validation throws with a copy-pasteable error pointing at the missing field.

**Distribution**
- D1. Public repo, MIT, tag `v0.1.0`, install via `pnpm add github:getfishtank/payload-plugin-content-tree#v0.1.0`.
- D2. `examples/basic` boots Payload 3 + SQLite + 50-node fixture with `pnpm i && pnpm dev`.
- D3. `pnpm compat-check $DATABASE_URI` validates a real consumer DB before adoption.

**Docs**
- DOC1. README — 6-line snippet, GIF, "is/isn't."
- DOC2. MIGRATING.md — FRAS-shaped step-by-step swap.
- DOC3. CONTRIBUTING.md — sandbox boot, feature loop, release cut.

**Tests**
- T1. Vitest ≥ 80% on utility code (insertOptions, ancestors, validation, reorder math).
- T2. One Playwright happy-path against `examples/basic` (drag node, persist, reload).
- T3. Bundle-size CI check.

**Out-of-scope (v0.2+)**
- Storybook. i18n. Theming. Multi-collection trees. WCAG cert. Keyboard a11y audit. npm publish.

---

## 2. Repo file tree (final)

```
payload-plugin-content-tree/
├── .github/workflows/
│   ├── ci.yml
│   └── release.yml
├── packages/plugin/
│   ├── src/
│   │   ├── index.ts                    # server entry
│   │   ├── client.ts                   # client entry
│   │   ├── plugin.ts                   # buildConfig wiring
│   │   ├── server/
│   │   │   ├── endpoints/
│   │   │   │   ├── tree.ts
│   │   │   │   └── search.ts
│   │   │   ├── helpers/
│   │   │   │   ├── buildTreeNodes.ts
│   │   │   │   ├── resolveAncestors.ts
│   │   │   │   ├── reorderNodes.ts
│   │   │   │   └── validateCollection.ts
│   │   │   └── compat-check.ts
│   │   ├── client/
│   │   │   ├── ContentTreeView.tsx     # registered admin view
│   │   │   ├── TreeArborist.tsx        # arborist wrapper
│   │   │   ├── TreeContextMenu.tsx
│   │   │   ├── EditIframePane.tsx
│   │   │   ├── icons/index.tsx
│   │   │   ├── ui/Modal.tsx
│   │   │   └── styles.css
│   │   └── shared/
│   │       ├── types.ts
│   │       ├── insertOptions.ts
│   │       └── constants.ts
│   ├── tests/unit/*.test.ts
│   ├── package.json
│   ├── tsup.config.ts
│   ├── tsconfig.json
│   └── vitest.config.ts
├── examples/basic/
│   ├── src/
│   │   ├── collections/Pages.ts
│   │   ├── seed/seed-tree.ts
│   │   └── payload.config.ts
│   ├── package.json
│   └── tsconfig.json
├── tests/e2e/tree-dnd.spec.ts
├── playwright.config.ts
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── package.json                         # workspace root
├── README.md
├── MIGRATING.md
├── CONTRIBUTING.md
├── LICENSE
├── .nvmrc
├── .editorconfig
└── .gitignore
```

---

## 3. Code skeleton — fill-in-the-blanks ready

### 3.1 `pnpm-workspace.yaml`

```yaml
packages:
  - 'packages/*'
  - 'examples/*'
```

### 3.2 Root `package.json`

```jsonc
{
  "name": "payload-plugin-content-tree-monorepo",
  "private": true,
  "type": "module",
  "scripts": {
    "build":        "pnpm -r --filter ./packages/* build",
    "dev":          "pnpm --filter examples/basic dev",
    "test":         "pnpm -r test",
    "test:e2e":     "playwright test",
    "lint":         "eslint . --max-warnings 0",
    "typecheck":    "pnpm -r typecheck",
    "compat-check": "pnpm --filter @fishtank/payload-plugin-content-tree compat-check"
  },
  "devDependencies": {
    "@playwright/test": "^1.49.0",
    "eslint": "^9.0.0",
    "prettier": "^3.0.0",
    "typescript": "^5.6.0"
  },
  "packageManager": "pnpm@9.0.0",
  "engines": { "node": ">=20.9.0" }
}
```

### 3.3 `packages/plugin/package.json`

```jsonc
{
  "name": "@fishtank/payload-plugin-content-tree",
  "version": "0.1.0",
  "type": "module",
  "license": "MIT",
  "description": "Sitecore-style content tree view for Payload CMS 3.x admin.",
  "repository": "github:getfishtank/payload-plugin-content-tree",
  "exports": {
    ".":        { "types": "./dist/index.d.ts",  "default": "./dist/index.js" },
    "./client": { "types": "./dist/client.d.ts", "default": "./dist/client.js" }
  },
  "bin": { "compat-check": "./dist/compat-check.js" },
  "files": ["dist", "README.md", "LICENSE"],
  "scripts": {
    "build":        "tsup",
    "dev":          "tsup --watch",
    "test":         "vitest run",
    "typecheck":    "tsc --noEmit",
    "compat-check": "node ./dist/compat-check.js"
  },
  "peerDependencies": {
    "payload":           "^3.0.0",
    "@payloadcms/ui":    "^3.0.0",
    "react":             "^18.0.0 || ^19.0.0",
    "react-dom":         "^18.0.0 || ^19.0.0"
  },
  "dependencies": {
    "react-arborist":      "^3.4.0",
    "@tanstack/react-query": "^5.59.0"
  },
  "devDependencies": {
    "@types/react":     "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "payload":          "^3.84.0",
    "@payloadcms/ui":   "^3.84.0",
    "react":            "^19.0.0",
    "react-dom":        "^19.0.0",
    "tsup":             "^8.3.0",
    "typescript":       "^5.6.0",
    "vitest":           "^2.1.0"
  }
}
```

### 3.4 `packages/plugin/tsup.config.ts`

```ts
import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    index:        'src/index.ts',
    client:       'src/client.ts',
    'compat-check': 'src/server/compat-check.ts',
  },
  format: ['esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  // Preserve "use client" directives in client output.
  esbuildOptions(opts) { opts.banner = { js: '' } },
  external: ['react', 'react-dom', 'payload', '@payloadcms/ui'],
})
```

### 3.5 `packages/plugin/src/shared/types.ts`

```ts
export interface ContentTreePluginOptions {
  /** Slug of the collection that backs the tree. Required. */
  collectionSlug: string

  /**
   * Field-name overrides. The plugin validates that these fields exist on
   * the collection at buildConfig time. Required fields throw if missing;
   * optional fields silently disable their UI affordance.
   */
  fields?: {
    parent?: string         // default 'parent'   — required, self-relationship
    sortOrder?: string      // default 'sortOrder' — required, number
    contentType?: string    // default 'contentType' — required, select
    title?: string          // default 'title'   — required, text-ish
    slug?: string           // default 'slug'    — optional
    workflowState?: string | false  // default 'workflowState' — optional
    lockedBy?: string | false       // default 'lockedBy' — optional
  }

  /** Mount path for the admin view. Default '/tree'. */
  adminPath?: string

  /**
   * Map of parent contentType → allowed child contentTypes.
   * Default: `{}` (no insert menu shown — the plugin treats this as
   * "tree is read-only via context menu insert"). To enable insert,
   * always pass at least `{ root: ['page'] }`.
   */
  insertOptions?: Record<string, string[]>
  contentTypeLabels?: Record<string, string>
  maxDepth?: number   // default 5

  /** Override the right-rail iframe target. */
  editUrlBuilder?: (node: TreeNode) => string

  /**
   * Authorization callback. Default: always-true. Plugin calls this
   * before showing destructive actions in the context menu.
   */
  canPerformAction?: (
    action: 'insert' | 'duplicate' | 'rename' | 'delete' | 'move',
    user: { id: string | number; role?: string } | null,
    node: TreeNode,
  ) => boolean

  /** Per-feature toggles. */
  features?: {
    dragAndDrop?: boolean   // default true
    contextMenu?: boolean   // default true
    deepSearch?: boolean    // default true
  }
}

export interface TreeNode {
  id: string | number
  title: string
  slug?: string
  contentType: string
  parent: string | number | null
  sortOrder: number
  hasChildren: boolean
  workflowState?: string
  lockedBy?: string | number | null
  children?: TreeNode[]
}
```

### 3.6 `packages/plugin/src/index.ts` — server entry

```ts
export { contentTreePlugin } from './plugin'
export type { ContentTreePluginOptions, TreeNode } from './shared/types'
```

### 3.7 `packages/plugin/src/client.ts` — client entry

```ts
'use client'

export { ContentTreeView } from './client/ContentTreeView'
```

### 3.8 `packages/plugin/src/plugin.ts` — the buildConfig wiring

```ts
import type { Config, Plugin } from 'payload'
import type { ContentTreePluginOptions } from './shared/types'
import { validateCollection } from './server/helpers/validateCollection'
import { treeEndpoint } from './server/endpoints/tree'
import { searchEndpoint } from './server/endpoints/search'

const VIEW_KEY = 'fishtankContentTree'

/**
 * Drop-in admin view for browsing a hierarchical Payload collection.
 *
 * Validates at buildConfig time that the target collection exposes
 * `parent`, `sortOrder`, `contentType`, and `title`. Throws with a
 * copy-pasteable error if any are missing.
 */
export const contentTreePlugin =
  (opts: ContentTreePluginOptions): Plugin =>
  (incoming: Config): Config => {
    const adminPath = opts.adminPath ?? '/tree'

    // Throws on missing/wrong-typed fields. Runs before mutating config.
    validateCollection(incoming, opts)

    const config: Config = { ...incoming }
    config.admin = { ...(config.admin ?? {}) }
    config.admin.components = { ...(config.admin.components ?? {}) }
    config.admin.components.views = { ...(config.admin.components.views ?? {}) }

    // Register the custom view via importMap path string.
    // The path resolves to the plugin's "./client" export's `ContentTreeView`.
    config.admin.components.views[VIEW_KEY] = {
      Component: '@fishtank/payload-plugin-content-tree/client#ContentTreeView',
      path: adminPath,
      // Pass plugin opts through to the client component as serializable props.
      // Functions (editUrlBuilder, canPerformAction) are NOT serializable —
      // those get stripped here and re-resolved client-side via a registry.
      // (See "Function-prop hand-off" gotcha below.)
      clientProps: serializableOpts(opts, adminPath),
    }

    // Register endpoints. Names are slug-suffixed so two instances coexist.
    const slug = opts.collectionSlug
    config.endpoints = [
      ...(config.endpoints ?? []),
      treeEndpoint(opts),
      searchEndpoint(opts),
    ]

    return config
  }

function serializableOpts(opts: ContentTreePluginOptions, adminPath: string) {
  return {
    collectionSlug: opts.collectionSlug,
    fields: opts.fields ?? {},
    adminPath,
    insertOptions: opts.insertOptions ?? {},
    contentTypeLabels: opts.contentTypeLabels ?? {},
    maxDepth: opts.maxDepth ?? 5,
    features: {
      dragAndDrop: opts.features?.dragAndDrop ?? true,
      contextMenu: opts.features?.contextMenu ?? true,
      deepSearch:  opts.features?.deepSearch  ?? true,
    },
    // editUrlBuilder + canPerformAction are NOT serialized.
    // The view falls back to defaults; advanced consumers wrap
    // ContentTreeView themselves and pass these as React props.
  }
}
```

### 3.9 `packages/plugin/src/server/helpers/validateCollection.ts`

```ts
import type { Config } from 'payload'
import type { ContentTreePluginOptions } from '../../shared/types'

const REQUIRED: Array<{ key: keyof NonNullable<ContentTreePluginOptions['fields']>; type: string; default: string }> = [
  { key: 'parent',      type: 'relationship', default: 'parent' },
  { key: 'sortOrder',   type: 'number',       default: 'sortOrder' },
  { key: 'contentType', type: 'select',       default: 'contentType' },
  { key: 'title',       type: 'text',         default: 'title' },
]

/** Throws if the target collection is missing required fields. */
export function validateCollection(config: Config, opts: ContentTreePluginOptions): void {
  const collection = config.collections?.find((c) => c.slug === opts.collectionSlug)
  if (!collection) {
    throw new Error(
      `[content-tree-plugin] No collection with slug "${opts.collectionSlug}" found. ` +
      `Define the collection before registering the plugin.`,
    )
  }

  for (const req of REQUIRED) {
    const fieldName = opts.fields?.[req.key] ?? req.default
    const field = findField(collection.fields, fieldName)
    if (!field) {
      throw new Error(
        `[content-tree-plugin] Collection "${opts.collectionSlug}" is missing required field "${fieldName}". ` +
        `Add it to the collection (type: "${req.type}"${req.key === 'parent' ? `, relationTo: "${opts.collectionSlug}"` : ''}) ` +
        `or pass fields.${req.key} to point at an existing field.`,
      )
    }
    if (req.type === 'relationship' && field.type !== 'relationship') {
      throw new Error(`[content-tree-plugin] Field "${fieldName}" must be type "relationship".`)
    }
    if (req.type === 'number' && field.type !== 'number') {
      throw new Error(`[content-tree-plugin] Field "${fieldName}" must be type "number".`)
    }
    // (etc — see tests for the full matrix)
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function findField(fields: any[], name: string): any | undefined {
  for (const f of fields) {
    if (f.name === name) return f
    if (f.type === 'tabs' && Array.isArray(f.tabs)) {
      for (const tab of f.tabs) {
        const found = findField(tab.fields ?? [], name)
        if (found) return found
      }
    }
  }
  return undefined
}
```

### 3.10 `packages/plugin/src/server/endpoints/tree.ts`

```ts
import type { Endpoint } from 'payload'
import type { ContentTreePluginOptions } from '../../shared/types'
import { buildTreeNodes } from '../helpers/buildTreeNodes'

export const treeEndpoint = (opts: ContentTreePluginOptions): Endpoint => ({
  path: `/tree-${opts.collectionSlug}`,
  method: 'get',
  handler: async (req) => {
    const parentIdParam = req.query?.parentId as string | undefined
    const result = await req.payload.find({
      collection: opts.collectionSlug,
      limit: 0,
      depth: 1,
      sort: opts.fields?.sortOrder ?? 'sortOrder',
    })

    const { roots, byParent } = buildTreeNodes(result.docs as any[], opts)

    if (parentIdParam) {
      const numericId = Number.isNaN(Number(parentIdParam)) ? parentIdParam : Number(parentIdParam)
      const children = byParent.get(parentIdParam) ?? byParent.get(numericId) ?? []
      return Response.json({ nodes: children, total: children.length })
    }

    return Response.json({ nodes: roots, total: result.totalDocs })
  },
})
```

### 3.11 `packages/plugin/src/server/helpers/buildTreeNodes.ts`

```ts
import type { ContentTreePluginOptions, TreeNode } from '../../shared/types'

/**
 * Convert a flat list of Payload docs into a nested tree.
 * Lifted directly from the homegrown route handler — same logic,
 * config-driven field names instead of hardcoded.
 */
export function buildTreeNodes(
  docs: Record<string, unknown>[],
  opts: ContentTreePluginOptions,
): { roots: TreeNode[]; byParent: Map<string | number | 'ROOT', TreeNode[]> } {
  const f = opts.fields ?? {}
  const fParent = f.parent ?? 'parent'
  const fSort   = f.sortOrder ?? 'sortOrder'
  const fType   = f.contentType ?? 'contentType'
  const fTitle  = f.title ?? 'title'
  const fSlug   = f.slug ?? 'slug'

  const nodesById = new Map<string | number, TreeNode>()
  const byParent = new Map<string | number | 'ROOT', TreeNode[]>()

  for (const doc of docs) {
    const node = toNode(doc, { fParent, fSort, fType, fTitle, fSlug, fWorkflow: f.workflowState, fLocked: f.lockedBy })
    nodesById.set(node.id, node)
    const key: string | number | 'ROOT' = node.parent ?? 'ROOT'
    const bucket = byParent.get(key)
    if (bucket) bucket.push(node)
    else byParent.set(key, [node])
  }

  for (const node of nodesById.values()) {
    node.hasChildren = byParent.has(node.id)
  }

  const attach = (n: TreeNode): TreeNode => {
    const kids = byParent.get(n.id) ?? []
    return { ...n, children: kids.length ? kids.map(attach) : undefined }
  }

  const roots = (byParent.get('ROOT') ?? []).map(attach)
  return { roots, byParent }
}

function toNode(doc: Record<string, unknown>, m: {
  fParent: string; fSort: string; fType: string; fTitle: string; fSlug: string;
  fWorkflow?: string | false; fLocked?: string | false;
}): TreeNode {
  return {
    id: doc.id as string | number,
    title: (doc[m.fTitle] as string) ?? 'Untitled',
    slug: m.fSlug ? (doc[m.fSlug] as string) : undefined,
    contentType: (doc[m.fType] as string) ?? 'page',
    parent: relId(doc[m.fParent]),
    sortOrder: (doc[m.fSort] as number) ?? 0,
    hasChildren: false,
    workflowState: m.fWorkflow ? (doc[m.fWorkflow] as string) : undefined,
    lockedBy: m.fLocked ? relId(doc[m.fLocked]) : undefined,
  }
}

function relId(v: unknown): string | number | null {
  if (v && typeof v === 'object' && v !== null && 'id' in v) return (v as any).id ?? null
  return (v as string | number | null) ?? null
}
```

### 3.12 `packages/plugin/src/client/ContentTreeView.tsx` — view shell

```tsx
'use client'

import React from 'react'
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'
import { Tree, type NodeApi, type TreeApi } from 'react-arborist'
import { useAuth } from '@payloadcms/ui'
import type { TreeNode, ContentTreePluginOptions } from '../shared/types'
import { TreeContextMenu } from './TreeContextMenu'
import { EditIframePane } from './EditIframePane'

interface ViewProps {
  // serialized opts forwarded by Payload via clientProps
  collectionSlug: string
  adminPath: string
  fields: NonNullable<ContentTreePluginOptions['fields']>
  insertOptions: Record<string, string[]>
  contentTypeLabels: Record<string, string>
  maxDepth: number
  features: { dragAndDrop: boolean; contextMenu: boolean; deepSearch: boolean }
  // function props are passed by user-side wrapper, not by Payload
  editUrlBuilder?: (node: TreeNode) => string
  canPerformAction?: ContentTreePluginOptions['canPerformAction']
}

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 30_000, refetchOnWindowFocus: false } },
})

export function ContentTreeView(props: ViewProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ContentTreeInner {...props} />
    </QueryClientProvider>
  )
}

function ContentTreeInner(props: ViewProps) {
  const { user } = useAuth()
  const treeRef = React.useRef<TreeApi<TreeNode> | null>(null)
  const [selected, setSelected] = React.useState<TreeNode | null>(null)
  const [contextMenu, setContextMenu] = React.useState<{ x: number; y: number; node: TreeNode } | null>(null)

  const { data, refetch, isLoading } = useQuery<TreeNode[]>({
    queryKey: ['content-tree', props.collectionSlug],
    queryFn: async () => {
      const res = await fetch(`/api/tree-${props.collectionSlug}`)
      if (!res.ok) throw new Error(`tree fetch failed: ${res.status}`)
      const json = await res.json()
      return json.nodes ?? []
    },
  })

  const editUrl = (n: TreeNode) =>
    props.editUrlBuilder?.(n) ?? `/admin/collections/${props.collectionSlug}/${n.id}`

  const onMove = async ({ dragIds, parentId, index }: {
    dragIds: string[]; parentId: string | null; index: number;
  }) => {
    await fetch(`/api/${props.collectionSlug}/${dragIds[0]}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        [props.fields.parent ?? 'parent']: parentId,
        [props.fields.sortOrder ?? 'sortOrder']: index,
      }),
    })
    refetch()
  }

  if (isLoading) return <div data-testid="page-content-tree">Loading…</div>

  return (
    <div data-testid="page-content-tree" style={{ display: 'flex', height: 'calc(100vh - 60px)' }}>
      <div style={{ width: 360, borderRight: '1px solid var(--theme-elevation-150)' }}>
        <Tree<TreeNode>
          ref={treeRef}
          data={data ?? []}
          openByDefault={false}
          rowHeight={28}
          onMove={props.features.dragAndDrop ? onMove : undefined}
          onSelect={(nodes) => setSelected(nodes[0]?.data ?? null)}
        >
          {(nodeProps) => (
            <TreeRow
              {...nodeProps}
              onContextMenu={(e, n) => {
                if (!props.features.contextMenu) return
                e.preventDefault()
                setContextMenu({ x: e.clientX, y: e.clientY, node: n })
              }}
            />
          )}
        </Tree>
      </div>

      <EditIframePane node={selected} editUrl={selected ? editUrl(selected) : null} />

      {contextMenu && (
        <TreeContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          node={contextMenu.node}
          insertOptions={props.insertOptions}
          contentTypeLabels={props.contentTypeLabels}
          maxDepth={props.maxDepth}
          collectionSlug={props.collectionSlug}
          user={user as { id: string | number; role?: string } | null}
          canPerformAction={props.canPerformAction}
          onClose={() => setContextMenu(null)}
          onAction={() => { setContextMenu(null); refetch() }}
        />
      )}
    </div>
  )
}

function TreeRow({ node, style, dragHandle, onContextMenu }: {
  node: NodeApi<TreeNode>;
  style: React.CSSProperties;
  dragHandle?: (el: HTMLDivElement | null) => void;
  onContextMenu: (e: React.MouseEvent, n: TreeNode) => void;
}) {
  return (
    <div
      ref={dragHandle}
      style={style}
      onContextMenu={(e) => onContextMenu(e, node.data)}
      data-testid={`tree-item-${node.id}`}
    >
      <span onClick={() => node.toggle()}>{node.isOpen ? '▾' : '▸'}</span>
      <span>{node.data.title}</span>
    </div>
  )
}
```

### 3.13 `examples/basic/src/payload.config.ts` — the consumer-side proof

```ts
import { buildConfig } from 'payload'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { contentTreePlugin } from '@fishtank/payload-plugin-content-tree'
import { Pages } from './collections/Pages'

export default buildConfig({
  collections: [Pages],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || 'dev-secret',
  db: sqliteAdapter({ client: { url: 'file:./dev.db' } }),
  plugins: [
    contentTreePlugin({
      collectionSlug: 'pages',
      insertOptions: {
        root:   ['page', 'folder'],
        folder: ['page', 'folder'],
        page:   ['page'],
      },
      contentTypeLabels: { page: 'Page', folder: 'Folder' },
    }),
  ],
})
```

---

## 4. Gotchas — what to debug first

1. **importMap path string.** `'@fishtank/payload-plugin-content-tree/client#ContentTreeView'` — typo here = white screen. First test in `examples/basic` should be "open `/admin` and see the view mount."
2. **`'use client'` preservation through tsup.** Verify with `cat dist/client.js | head -1` after first build. If missing, `dts` strips it — switch to `tsup`'s `banner` config or postprocess.
3. **clientProps serialization.** Functions inside `clientProps` will silently drop. Documented in `serializableOpts`. Power users wrap `<ContentTreeView>` themselves to pass function props (this is the "advanced" path in the README).
4. **arborist controlled vs uncontrolled tree.** v0.1 is uncontrolled; arborist owns expand state. We persist via arborist's `initialOpenState` prop hydrated from localStorage.
5. **Concurrent reorder + parent change.** The naive `PATCH` in `onMove` doesn't reindex siblings. Move siblings into a single bulk update OR accept "sortOrder gaps grow over time" for v0.1, fix in v0.2 with a proper reorder helper.

---

## 5. FRAS-swap PR — what disappears when v0.1 lands

Files to delete from FRAS once `@fishtank/payload-plugin-content-tree@^0.1.0` is installed:

```
src/admin/views/ContentTree.tsx           (- 19 LOC)
src/admin/views/ContentTreeClient.tsx     (- 1067 LOC)
src/admin/views/ContentTree.stories.tsx
src/admin/components/TreeContextMenu.tsx  (- 375 LOC)
src/admin/components/TreeContextMenu.stories.tsx
src/admin/components/TreeDndWrapper.tsx   (- 351 LOC)
src/admin/components/TreeDndWrapper.stories.tsx
src/admin/types/tree.ts                   (- 32 LOC)
src/admin/config/insertOptions.ts         (move to plugin config)
src/app/api/tree/route.ts                 (- 119 LOC)
src/app/api/tree/search/route.ts          (- 126 LOC)
```

Net delete: ~2,100 LOC out of FRAS. Replaced by ~10 lines in `payload.config.ts`:

```ts
plugins: [
  contentTreePlugin({
    collectionSlug: 'pages',
    fields: { workflowState: 'workflowState', lockedBy: 'lockedBy' },
    insertOptions: {
      root: ['page', 'folder'],
      'boards-folder': ['board-detail'],
      // …rest moved from src/admin/config/insertOptions.ts
    },
    contentTypeLabels: { /* ditto */ },
    canPerformAction: (action, user, _node) =>
      // FRAS-specific: admin/editor only for delete
      !(action === 'delete' && user?.role === 'author'),
  }),
]
```

---

## 6. Day-1 build order for whoever opens the new repo

Roughly mapped to ~2 working days:

1. Init repo, `pnpm-workspace.yaml`, root `package.json`, LICENSE, .nvmrc.
2. `packages/plugin/` skeleton (3.3, 3.4, types, empty entries).
3. `examples/basic/` skeleton — Payload config + a minimal Pages collection + seed.
4. Get `pnpm dev` to boot the example admin (no plugin yet) — sanity check.
5. Implement `validateCollection` + unit tests. **First green test.**
6. Implement `buildTreeNodes` + unit tests + the tree endpoint.
7. Wire `contentTreePlugin` into `examples/basic` — verify view registers.
8. Implement `ContentTreeView` shell with arborist + iframe pane (no DnD yet).
9. Add DnD `onMove` + reorder helper.
10. Add context menu (insert / duplicate / rename / delete).
11. Add deep search endpoint + client wiring.
12. Playwright smoke test.
13. README, MIGRATING.md, CONTRIBUTING.md.
14. Tag `v0.1.0`.
15. FRAS-swap PR in `vivid-splashing-glade` worktree.

---

## 7. Open issues parked for later

- `move-to` action with a tree-picker modal (v0.2).
- Stories (v0.2).
- i18n labels (v0.2).
- Multi-collection trees (v0.3).
- Theme tokens (`--ct-*`) for restyling without forking (v0.2).
- WCAG 2.1 AA cert + keyboard a11y audit (v0.2).
- npm publish (v0.2 once API stable).
