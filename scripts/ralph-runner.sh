#!/usr/bin/env bash
##
# ralph-runner.sh — Orchestrate Ralph Wiggum loops for FRAS Canada
#
# Launches Claude Code headless sessions in git worktrees.
# Each epic runs in isolation with its own branch, DB, and log.
#
# Usage:
#   ./scripts/ralph-runner.sh epic-00          # Run single epic
#   ./scripts/ralph-runner.sh phase1           # Run all Phase 1 sequentially
#   ./scripts/ralph-runner.sh parallel 12-14 15-16   # Run two epics in parallel
#   ./scripts/ralph-runner.sh status           # Check running/completed loops
#   ./scripts/ralph-runner.sh cleanup [epic]   # Remove worktree + branch
#
# Requirements:
#   - claude CLI in PATH
#   - git worktree support
#   - psql or Docker (for per-worktree Postgres DBs)
#
# Compatible with macOS bash 3.2+
##

set -eo pipefail

# ── Config ───────────────────────────────────────────────────────────────

PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
WORKTREE_BASE="$(dirname "$PROJECT_ROOT")/fras-ralph"
LOG_DIR="$PROJECT_ROOT/.ai-reports/ralph-logs"
PROMPT_DIR="$PROJECT_ROOT/.ai-reports/ralph-prompts"
EXIT_PROTOCOL="$PROMPT_DIR/_exit-protocol.md"
MAX_ITERATIONS=30
BASE_BRANCH="develop"

# Gate epics — require human approval before next epic starts
GATE_EPICS="epic-00 epic-01 epic-05 epic-17-20 epic-18 epic-22 epic-25-26"

# ── Epic-to-Prompt Mapping (bash 3.2 compatible) ────────────────────────

get_prompt_file() {
  local epic="$1"
  case "$epic" in
    epic-00)    echo "epic-00-scaffold-design-system.md" ;;
    epic-01)    echo "epic-01-cms-collections.md" ;;
    epic-02-03) echo "epic-02-03-layout-atomic.md" ;;
    epic-04)    echo "epic-04-homepage.md" ;;
    epic-05)    echo "epic-05-search-meilisearch.md" ;;
    epic-06-09) echo "epic-06-07-08-09-board-project-listings.md" ;;
    epic-10)    echo "epic-10-integration-polish.md" ;;
    epic-11)    echo "epic-11-phase2-collections.md" ;;
    epic-12-14) echo "epic-12-13-14-content-people-standards.md" ;;
    epic-15-16) echo "epic-15-16-documents-listings.md" ;;
    epic-17-20) echo "epic-17-20-forms-auth-gaps.md" ;;
    epic-18)    echo "epic-18-i18n.md" ;;
    epic-21)    echo "epic-21-phase2-polish.md" ;;
    epic-22)    echo "epic-22-admin-foundation.md" ;;
    epic-23)    echo "epic-23-content-tree.md" ;;
    epic-24)    echo "epic-24-media-library.md" ;;
    epic-25-26) echo "epic-25-26-page-builder.md" ;;
    epic-27)    echo "epic-27-workbox.md" ;;
    *) echo "" ;;
  esac
}

ALL_EPICS="epic-00 epic-01 epic-02-03 epic-04 epic-05 epic-06-09 epic-10 epic-11 epic-12-14 epic-15-16 epic-17-20 epic-18 epic-21 epic-22 epic-23 epic-24 epic-25-26 epic-27"

# Port assignments for parallel worktrees (prevents port conflicts during self-tests)
get_epic_port() {
  local epic="$1"
  case "$epic" in
    epic-12-14) echo "3001" ;;
    epic-15-16) echo "3002" ;;
    epic-17-20) echo "3003" ;;
    epic-18)    echo "3004" ;;
    epic-23)    echo "3005" ;;
    epic-24)    echo "3006" ;;
    *)          echo "" ;;
  esac
}

# ── Helpers ──────────────────────────────────────────────────────────────

log() { echo "[ralph] $(date '+%H:%M:%S') $*"; }
err() { echo "[ralph] ERROR: $*" >&2; }

is_gate() {
  local epic="$1"
  case " $GATE_EPICS " in
    *" $epic "*) return 0 ;;
    *) return 1 ;;
  esac
}

# Permission mode for headless sessions
# Using --dangerously-skip-permissions because:
# 1. Worktrees are isolated (can't affect main repo)
# 2. git push is never called (exit protocol forbids it)
# 3. Shell glob expansion mangles --allowedTools patterns like Bash(git add:*)
# 4. No human present to approve — that's the whole point of headless
CLAUDE_PERMISSION_FLAG="--dangerously-skip-permissions"

# Allow launching Claude from within a Claude session (worktree runners)
# Claude Code sets both of these — both must be unset or child `claude` calls
# detect nesting and silently produce no output
unset CLAUDECODE 2>/dev/null || true
unset CLAUDE_CODE_ENTRYPOINT 2>/dev/null || true

# ── Worktree Management ─────────────────────────────────────────────────

setup_worktree() {
  local epic="$1"
  local worktree_dir="$WORKTREE_BASE/$epic"
  local branch="ralph/$epic"

  if [ -d "$worktree_dir" ]; then
    log "Worktree already exists: $worktree_dir"
    return 0
  fi

  log "Creating worktree: $worktree_dir (branch: $branch)"
  cd "$PROJECT_ROOT"

  # Create branch from base if it doesn't exist
  if git rev-parse --verify "$branch" >/dev/null 2>&1; then
    git worktree add "$worktree_dir" "$branch"
  else
    git worktree add -b "$branch" "$worktree_dir" "$BASE_BRANCH"
  fi

  # Copy .env (never committed, needed for DB connection)
  if [ -f "$PROJECT_ROOT/.env" ]; then
    cp "$PROJECT_ROOT/.env" "$worktree_dir/.env"
  fi

  # Install dependencies in worktree
  log "Installing dependencies in worktree..."
  cd "$worktree_dir"
  npm install --silent 2>/dev/null || npm install

  log "Worktree ready: $worktree_dir"
}

setup_worktree_db() {
  local epic="$1"
  local db_name
  db_name="fras_ralph_$(echo "$epic" | tr '-' '_')"

  # Extract connection details from .env
  local db_uri
  db_uri=$(grep '^DATABASE_URI=' "$PROJECT_ROOT/.env" | cut -d= -f2-)

  # Parse host/user/password from URI: postgresql://user:pass@host:port/dbname
  local db_user db_host db_port db_pass
  db_user=$(echo "$db_uri" | sed 's|postgresql://\([^:]*\):.*|\1|')
  db_pass=$(echo "$db_uri" | sed 's|postgresql://[^:]*:\([^@]*\)@.*|\1|')
  db_host=$(echo "$db_uri" | sed 's|.*@\([^:]*\):.*|\1|')
  db_port=$(echo "$db_uri" | sed 's|.*:\([0-9][0-9]*\)/.*|\1|')

  # Defaults if parsing fails
  db_user="${db_user:-postgres}"
  db_host="${db_host:-localhost}"
  db_port="${db_port:-5432}"
  db_pass="${db_pass:-postgres}"

  log "Creating database: $db_name (on $db_host:$db_port)"

  # Try psql directly (OrbStack / local Postgres)
  if command -v psql >/dev/null 2>&1; then
    PGPASSWORD="$db_pass" psql -h "$db_host" -p "$db_port" -U "$db_user" \
      -c "CREATE DATABASE $db_name;" 2>/dev/null || true
  # Fallback: try docker compose exec
  elif docker compose -f "$PROJECT_ROOT/docker-compose.yml" ps --quiet postgres >/dev/null 2>&1; then
    docker compose -f "$PROJECT_ROOT/docker-compose.yml" exec -T postgres \
      psql -U "$db_user" -c "CREATE DATABASE $db_name;" 2>/dev/null || true
  else
    err "No psql available and no Docker Postgres running. Create DB manually:"
    err "  createdb -h $db_host -p $db_port -U $db_user $db_name"
    return 1
  fi

  # Update .env in worktree to use isolated DB
  local worktree_dir="$WORKTREE_BASE/$epic"
  if [ -f "$worktree_dir/.env" ]; then
    sed -i.bak "s|DATABASE_URI=.*|DATABASE_URI=postgresql://${db_user}:${db_pass}@${db_host}:${db_port}/${db_name}|" \
      "$worktree_dir/.env"
    rm -f "$worktree_dir/.env.bak"
    log "Worktree .env updated to use $db_name"

    # Set PORT for parallel worktrees (prevents port conflicts during self-tests)
    local epic_port
    epic_port=$(get_epic_port "$epic")
    if [ -n "$epic_port" ]; then
      if grep -q '^PORT=' "$worktree_dir/.env"; then
        sed -i.bak "s|^PORT=.*|PORT=$epic_port|" "$worktree_dir/.env"
      else
        echo "PORT=$epic_port" >> "$worktree_dir/.env"
      fi
      rm -f "$worktree_dir/.env.bak"
      log "Worktree .env PORT set to $epic_port"
    fi
  fi
}

cleanup_worktree() {
  local epic="$1"
  local worktree_dir="$WORKTREE_BASE/$epic"
  local branch="ralph/$epic"

  if [ -d "$worktree_dir" ]; then
    log "Removing worktree: $worktree_dir"
    cd "$PROJECT_ROOT"
    git worktree remove "$worktree_dir" --force 2>/dev/null || true
  fi

  log "Worktree removed. Branch $branch preserved for review."
}

# ── Claude Session ───────────────────────────────────────────────────────

run_ralph_loop() {
  local epic="$1"
  local prompt_filename
  prompt_filename=$(get_prompt_file "$epic")
  local prompt_file="$PROMPT_DIR/$prompt_filename"
  local worktree_dir="$WORKTREE_BASE/$epic"
  local log_file="$LOG_DIR/${epic}.log"
  local pid_file="$LOG_DIR/${epic}.pid"
  local status_file="$LOG_DIR/${epic}.status"

  if [ -z "$prompt_filename" ]; then
    err "Unknown epic: $epic"
    return 1
  fi

  if [ ! -f "$prompt_file" ]; then
    err "Prompt file not found: $prompt_file"
    return 1
  fi

  mkdir -p "$LOG_DIR"

  # Build the full prompt (prompt + exit protocol + port hint for parallel worktrees)
  local port_hint=""
  local epic_port
  epic_port=$(get_epic_port "$epic")
  if [ -n "$epic_port" ]; then
    port_hint="

NOTE: This worktree uses port ${epic_port}. When running self-tests, use:
  node scripts/self-test.mjs --epic $epic --port ${epic_port}
When running dev server, use:
  npm run dev -- --port ${epic_port}"
  fi

  local full_prompt
  full_prompt="$(cat "$prompt_file")

$(cat "$EXIT_PROTOCOL")${port_hint}"

  log "Starting Ralph loop for $epic"
  log "  Worktree: $worktree_dir"
  log "  Prompt: $prompt_file"
  log "  Log: $log_file"
  log "  Max iterations: $MAX_ITERATIONS"

  echo "RUNNING" > "$status_file"

  # Run the Ralph loop: feed the same prompt repeatedly
  # Claude processes it, checks MASTER_TODO, does work, outputs <promise> when done
  #
  # IMPORTANT: We use `tee` to stream output to the log file in real-time instead
  # of capturing into a bash variable. Long-running sessions (30+ min) can exceed
  # bash variable buffer limits, causing empty $result despite successful work.
  (
    cd "$worktree_dir"
    iteration=0

    while [ "$iteration" -lt "$MAX_ITERATIONS" ]; do
      iteration=$((iteration + 1))
      log "[$epic] Iteration $iteration/$MAX_ITERATIONS"

      # Write iteration header to log
      echo "=== ITERATION $iteration ===" >> "$log_file"

      # Use a temp file to capture output via tee (streams to log in real-time)
      local_tmp="$LOG_DIR/${epic}.iter${iteration}.tmp"

      # First iteration: fresh conversation. Subsequent: --continue
      # env -u strips Claude nesting detection vars (safe to run from within Claude Code)
      if [ "$iteration" -gt 1 ]; then
        echo "$full_prompt" | env -u CLAUDECODE -u CLAUDE_CODE_ENTRYPOINT claude --print --verbose --continue $CLAUDE_PERMISSION_FLAG 2>>"$log_file.stderr" | tee "$local_tmp" >> "$log_file" || true
      else
        echo "$full_prompt" | env -u CLAUDECODE -u CLAUDE_CODE_ENTRYPOINT claude --print --verbose $CLAUDE_PERMISSION_FLAG 2>>"$log_file.stderr" | tee "$local_tmp" >> "$log_file" || true
      fi

      echo "" >> "$log_file"

      # Guard: if claude produced no output, it was likely blocked
      if [ ! -s "$local_tmp" ]; then
        log "[$epic] WARNING: claude returned empty output on iteration $iteration"
        log "[$epic] This may indicate a nested session issue or API error"
        # Check if we've had 3 consecutive empty results
        empty_count=$((${empty_count:-0} + 1))
        if [ "$empty_count" -ge 3 ]; then
          log "[$epic] 3 consecutive empty outputs — aborting to prevent wasted iterations"
          echo "ABORTED_EMPTY" > "$status_file"
          rm -f "$local_tmp"
          break
        fi
        rm -f "$local_tmp"
        sleep 10
        continue
      fi
      empty_count=0

      # Check for completion signals in the iteration output
      # NOTE: Use simple fixed-string grep (-F) to avoid regex issues with
      # multibyte chars (em dashes, etc.) that break .* patterns
      if grep -qF 'COMPLETE</promise>' "$local_tmp"; then
        log "[$epic] COMPLETE at iteration $iteration"
        echo "COMPLETE" > "$status_file"
        rm -f "$local_tmp"
        break
      fi

      if grep -qF 'BLOCKED</promise>' "$local_tmp" || grep -qF 'BLOCKED<' "$local_tmp"; then
        log "[$epic] BLOCKED at iteration $iteration"
        echo "BLOCKED" > "$status_file"
        rm -f "$local_tmp"
        break
      fi

      if grep -qF 'ABORTED</promise>' "$local_tmp" || grep -qF 'ABORTED<' "$local_tmp"; then
        log "[$epic] ABORTED at iteration $iteration"
        echo "ABORTED" > "$status_file"
        rm -f "$local_tmp"
        break
      fi

      rm -f "$local_tmp"

      # Brief pause between iterations to avoid rate limits
      sleep 5
    done

    # Clean up any leftover tmp files
    rm -f "$LOG_DIR/${epic}".iter*.tmp

    if [ "$iteration" -ge "$MAX_ITERATIONS" ]; then
      log "[$epic] Hit max iterations ($MAX_ITERATIONS)"
      echo "MAX_ITERATIONS" > "$status_file"
    fi
  ) &

  local pid=$!
  echo "$pid" > "$pid_file"
  log "[$epic] Background PID: $pid"
}

# ── Orchestration ────────────────────────────────────────────────────────

run_single_epic() {
  local epic="$1"
  local prompt_filename
  prompt_filename=$(get_prompt_file "$epic")

  if [ -z "$prompt_filename" ]; then
    err "Unknown epic: $epic"
    err "Available: $ALL_EPICS"
    return 1
  fi

  setup_worktree "$epic"
  setup_worktree_db "$epic"
  run_ralph_loop "$epic"

  local pid
  pid=$(cat "$LOG_DIR/${epic}.pid")

  log "Waiting for $epic (PID: $pid)..."
  wait "$pid" 2>/dev/null || true

  local status
  status=$(cat "$LOG_DIR/${epic}.status" 2>/dev/null || echo "UNKNOWN")
  log "[$epic] Final status: $status"

  if is_gate "$epic"; then
    echo ""
    echo "============================================"
    echo "  GATE: $epic requires human approval"
    echo "  Status: $status"
    echo "  Worktree: $WORKTREE_BASE/$epic"
    echo "  Log: $LOG_DIR/${epic}.log"
    echo ""
    echo "  Review the work, then either:"
    echo "    ./scripts/ralph-runner.sh approve $epic"
    echo "    ./scripts/ralph-runner.sh reject $epic"
    echo "============================================"
    echo ""
  fi

  return 0
}

run_parallel_epics() {
  shift  # remove "parallel" from args
  local pids=""
  local epic_list=""

  for epic in "$@"; do
    setup_worktree "$epic"
    setup_worktree_db "$epic"
    run_ralph_loop "$epic"
    pids="$pids $(cat "$LOG_DIR/${epic}.pid")"
    epic_list="$epic_list $epic"
  done

  log "Waiting for parallel epics:$epic_list"
  for pid in $pids; do
    wait "$pid" 2>/dev/null || true
  done

  for epic in "$@"; do
    local status
    status=$(cat "$LOG_DIR/${epic}.status" 2>/dev/null || echo "UNKNOWN")
    log "[$epic] Finished: $status"
  done
}

run_sequence() {
  local sequence_name="$1"
  local entries=""

  case "$sequence_name" in
    PHASE1)
      entries="epic-00 epic-01 epic-02-03 epic-04 epic-05 epic-06-09 epic-10"
      ;;
    PHASE2)
      entries="epic-11 epic-12-14|epic-15-16 epic-17-20|epic-18 epic-21"
      ;;
    ADMIN)
      entries="epic-22 epic-23|epic-24 epic-25-26 epic-27"
      ;;
  esac

  for entry in $entries; do
    case "$entry" in
      *"|"*)
        # Parallel pair — split on pipe
        local epic_a="${entry%%|*}"
        local epic_b="${entry##*|}"
        log "Running parallel: $epic_a + $epic_b"

        setup_worktree "$epic_a"
        setup_worktree_db "$epic_a"
        run_ralph_loop "$epic_a"
        local pid_a
        pid_a=$(cat "$LOG_DIR/${epic_a}.pid")

        setup_worktree "$epic_b"
        setup_worktree_db "$epic_b"
        run_ralph_loop "$epic_b"
        local pid_b
        pid_b=$(cat "$LOG_DIR/${epic_b}.pid")

        wait "$pid_a" 2>/dev/null || true
        wait "$pid_b" 2>/dev/null || true

        for epic in "$epic_a" "$epic_b"; do
          local status
          status=$(cat "$LOG_DIR/${epic}.status" 2>/dev/null || echo "UNKNOWN")
          log "[$epic] Finished: $status"

          if is_gate "$epic"; then
            log "GATE: $epic needs approval before continuing."
            log "Run: ./scripts/ralph-runner.sh approve $epic"
            echo "Halting sequence at gate. Re-run to continue after approval."
            return 0
          fi

          if [ "$status" != "COMPLETE" ]; then
            err "[$epic] did not complete (status: $status). Halting sequence."
            return 1
          fi
        done
        ;;
      *)
        # Single epic
        run_single_epic "$entry"
        local status
        status=$(cat "$LOG_DIR/${entry}.status" 2>/dev/null || echo "UNKNOWN")

        if is_gate "$entry"; then
          log "GATE: $entry needs approval. Halting."
          log "After review: ./scripts/ralph-runner.sh approve $entry"
          log "Then re-run the sequence to continue."
          return 0
        fi

        if [ "$status" != "COMPLETE" ]; then
          err "[$entry] did not complete (status: $status). Halting sequence."
          return 1
        fi
        ;;
    esac
  done

  log "Sequence complete!"
}

approve_epic() {
  local epic="${1:?Usage: ralph-runner.sh approve <epic>}"
  local worktree_dir="$WORKTREE_BASE/$epic"
  local branch="ralph/$epic"

  if [ ! -d "$worktree_dir" ]; then
    err "No worktree for $epic"
    return 1
  fi

  log "Merging $branch into $BASE_BRANCH..."
  cd "$PROJECT_ROOT"
  git checkout "$BASE_BRANCH"
  git merge "$branch" --no-ff -m "feat($epic): merge Ralph loop — approved"
  git checkout -  # go back to previous branch

  echo "APPROVED" > "$LOG_DIR/${epic}.status"
  log "[$epic] Approved and merged into $BASE_BRANCH"

  # Optionally clean up worktree
  printf "Remove worktree? (y/n) "
  read -r REPLY
  case "$REPLY" in
    [Yy]*) cleanup_worktree "$epic" ;;
  esac
}

show_status() {
  echo ""
  echo "Ralph Loop Status"
  echo "================="
  echo ""

  mkdir -p "$LOG_DIR"

  for epic in $ALL_EPICS; do
    local status_file="$LOG_DIR/${epic}.status"
    local pid_file="$LOG_DIR/${epic}.pid"
    local status="NOT STARTED"
    local running=""

    if [ -f "$status_file" ]; then
      status=$(cat "$status_file")
    fi

    if [ -f "$pid_file" ]; then
      local pid
      pid=$(cat "$pid_file")
      if kill -0 "$pid" 2>/dev/null; then
        running=" (PID: $pid)"
      fi
    fi

    local gate=""
    if is_gate "$epic"; then
      gate=" [GATE]"
    fi

    printf "  %-15s  %-15s%s%s\n" "$epic" "$status" "$gate" "$running"
  done

  echo ""
}

# ── Main ─────────────────────────────────────────────────────────────────

cmd="${1:-help}"

case "$cmd" in
  epic-*)
    run_single_epic "$cmd"
    ;;
  phase1)
    run_sequence PHASE1
    ;;
  phase2)
    run_sequence PHASE2
    ;;
  admin)
    run_sequence ADMIN
    ;;
  all)
    run_sequence PHASE1
    run_sequence PHASE2
    run_sequence ADMIN
    ;;
  parallel)
    run_parallel_epics "$@"
    ;;
  approve)
    approve_epic "${2:-}"
    ;;
  reject)
    echo "REJECTED" > "$LOG_DIR/${2}.status"
    log "[${2}] Marked as rejected. Fix issues in worktree and re-run."
    ;;
  cleanup)
    cleanup_worktree "${2:?Usage: ralph-runner.sh cleanup <epic>}"
    ;;
  status)
    show_status
    ;;
  help|*)
    echo "Ralph Runner — FRAS Canada build orchestrator"
    echo ""
    echo "Usage:"
    echo "  ./scripts/ralph-runner.sh epic-00          Run single epic"
    echo "  ./scripts/ralph-runner.sh phase1           Run Phase 1 (sequential, stops at gates)"
    echo "  ./scripts/ralph-runner.sh phase2           Run Phase 2 (with parallel pairs)"
    echo "  ./scripts/ralph-runner.sh admin            Run Admin Panel epics"
    echo "  ./scripts/ralph-runner.sh all              Run everything (stops at gates)"
    echo "  ./scripts/ralph-runner.sh parallel e1 e2   Run specific epics in parallel"
    echo "  ./scripts/ralph-runner.sh status           Show all epic statuses"
    echo "  ./scripts/ralph-runner.sh approve <epic>   Approve gate + merge to develop"
    echo "  ./scripts/ralph-runner.sh reject <epic>    Mark gate as rejected"
    echo "  ./scripts/ralph-runner.sh cleanup <epic>   Remove worktree (preserves branch)"
    echo ""
    echo "Epics: $ALL_EPICS"
    echo ""
    echo "Gates (require approval): $GATE_EPICS"
    ;;
esac
