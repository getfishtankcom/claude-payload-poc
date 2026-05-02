---
name: local-dev
description: Manage the FRAS Canada local development environment. Use when asked to "start dev", "reset database", "check services", "docker status", "fix dev environment", "seed data", or troubleshoot local development issues.
argument-hint: <command> (start|stop|reset|status|logs|seed|nuke)
---

# FRAS Canada — Local Development Environment

Manage the Docker-based local development services and Next.js dev server for the FRAS Canada project.

## Architecture

```
┌─────────────────────────────────┐
│  Host Machine                   │
│  ┌───────────────────────────┐  │
│  │  Next.js dev server       │  │
│  │  (npm run dev :3000)      │  │
│  │  ┌─────────────────────┐  │  │
│  │  │  Payload CMS Admin  │  │  │
│  │  │  (/admin)           │  │  │
│  │  └─────────────────────┘  │  │
│  └──────────┬────────────────┘  │
│             │                    │
│  ┌──────────▼────────────────┐  │
│  │  Docker Compose           │  │
│  │  ┌──────────────────────┐ │  │
│  │  │ PostgreSQL 16 Alpine │ │  │
│  │  │ :5432                │ │  │
│  │  │ user: postgres       │ │  │
│  │  │ pass: postgres       │ │  │
│  │  │ db:   fras           │ │  │
│  │  └──────────────────────┘ │  │
│  └───────────────────────────┘  │
└─────────────────────────────────┘
```

Meilisearch will be added in Epic 5 (Search).

## Commands

### Starting Up

```bash
# 1. Start database
docker compose up -d

# 2. Verify it's healthy
docker compose ps

# 3. Start the dev server
npm run dev
```

First run: Payload auto-creates tables via Drizzle push (dev mode). Visit `/admin` to create your first admin user.

### Stopping

```bash
# Stop services (preserves data)
docker compose down

# Stop services AND delete all data
docker compose down -v
```

### Checking Status

```bash
# Service health
docker compose ps

# PostgreSQL connectivity
docker compose exec postgres pg_isready -U postgres

# Check what's in the database
docker compose exec postgres psql -U postgres -d fras -c '\dt'

# View recent logs
docker compose logs --tail=50 postgres
```

### Database Operations

```bash
# Connect to PostgreSQL directly
docker compose exec postgres psql -U postgres -d fras

# Dump database (backup)
docker compose exec postgres pg_dump -U postgres fras > backup.sql

# Restore from backup
docker compose exec postgres psql -U postgres -d fras < backup.sql

# Reset database (keeps container, drops all tables)
docker compose exec postgres psql -U postgres -d fras -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
# Then restart dev server — Drizzle push recreates everything
```

### Full Reset (Nuclear)

When everything is broken and you want a clean slate:

```bash
# 1. Stop everything
docker compose down -v        # Remove containers + volumes

# 2. Clean Next.js cache
rm -rf .next

# 3. Restart
docker compose up -d
npm run dev
```

## Environment Variables

The local dev setup uses these defaults from `.env.example`:

| Variable | Default | Notes |
|----------|---------|-------|
| `DATABASE_URI` | `postgresql://postgres:postgres@localhost:5432/fras` | Matches docker-compose |
| `PAYLOAD_SECRET` | Must generate | `openssl rand -hex 32` |
| `NEXT_PUBLIC_SERVER_URL` | `http://localhost:3000` | Used by Payload for links |

### First-Time Setup

```bash
cp .env.example .env
# Edit .env — at minimum set:
#   PAYLOAD_SECRET=<output of: openssl rand -hex 32>
```

## Troubleshooting

### Port 5432 already in use
Another PostgreSQL instance is running. Either:
- Stop it: `brew services stop postgresql` (macOS) or `sudo systemctl stop postgresql` (Linux)
- Or change the port in `docker-compose.yml`: `'5433:5432'` and update `DATABASE_URI`

### Port 3000 already in use
Another Next.js/Node process is running:
```bash
lsof -i :3000          # Find the process
kill -9 <PID>           # Kill it
```

### "connection refused" to database
1. Check if container is running: `docker compose ps`
2. Check health: `docker compose exec postgres pg_isready -U postgres`
3. Check logs: `docker compose logs postgres`
4. If container won't start: `docker compose down -v && docker compose up -d`

### Payload admin shows "Internal Server Error"
1. Check terminal output for the actual error
2. Common causes:
   - Missing `PAYLOAD_SECRET` in `.env`
   - Database not running
   - Schema mismatch — restart dev server to trigger Drizzle push

### "ECONNREFUSED" on first `npm run dev`
Docker container might not be ready yet. The healthcheck has a 5s interval. Wait a few seconds and try again, or run:
```bash
docker compose exec postgres pg_isready -U postgres
```

### Slow dev server startup
Payload initializes the database schema on first boot. This is normal for the first run after a schema change. Subsequent startups are faster.

## Port Map

| Service | Port | URL |
|---------|------|-----|
| Next.js (frontend + Payload admin) | 3000 | http://localhost:3000 |
| Payload Admin Panel | 3000 | http://localhost:3000/admin |
| Payload REST API | 3000 | http://localhost:3000/api |
| Payload GraphQL | 3000 | http://localhost:3000/graphql |
| PostgreSQL | 5432 | `postgresql://postgres:postgres@localhost:5432/fras` |

## Data Persistence

- **PostgreSQL data** persists in a Docker named volume (`postgres_data`)
- **Media uploads** persist in `./media/` on the host filesystem
- **`docker compose down`** preserves volumes (data survives)
- **`docker compose down -v`** deletes volumes (data is lost)
