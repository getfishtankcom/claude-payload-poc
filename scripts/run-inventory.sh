#!/usr/bin/env bash
#
# @description
# FRAS Canada Site Inventory Pipeline — runs all 4 steps in sequence.
#
# Steps:
#   1. Crawl sitemap (or discover links via fallback)
#   2. Classify URLs into page types
#   3. Deep inspect sample pages (screenshots + metadata)
#   4. Generate markdown reports
#
# Usage:
#   bash scripts/run-inventory.sh          # Run all steps
#   bash scripts/run-inventory.sh --from 3 # Resume from step 3
#

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

# Parse --from flag for resuming from a specific step
START_STEP=1
if [[ "${1:-}" == "--from" ]] && [[ -n "${2:-}" ]]; then
  START_STEP=$2
  echo "Resuming from step $START_STEP"
fi

echo "========================================="
echo " FRAS Canada — Site Inventory Pipeline"
echo "========================================="
echo ""

# Ensure data directory exists
mkdir -p "$ROOT_DIR/data"

# Step 1: Crawl sitemap
if [[ $START_STEP -le 1 ]]; then
  echo "[Step 1/4] Crawling sitemap..."
  echo "-----------------------------------------"
  node "$SCRIPT_DIR/crawl-sitemap.mjs"
  echo ""
fi

# Step 2: Classify pages
if [[ $START_STEP -le 2 ]]; then
  echo "[Step 2/4] Classifying page types..."
  echo "-----------------------------------------"
  node "$SCRIPT_DIR/classify-pages.mjs"
  echo ""
fi

# Step 3: Inspect sample pages
if [[ $START_STEP -le 3 ]]; then
  echo "[Step 3/4] Inspecting sample pages..."
  echo "-----------------------------------------"
  node "$SCRIPT_DIR/inspect-pages.mjs"
  echo ""
fi

# Step 4: Generate reports
if [[ $START_STEP -le 4 ]]; then
  echo "[Step 4/4] Generating reports..."
  echo "-----------------------------------------"
  node "$SCRIPT_DIR/generate-reports.mjs"
  echo ""
fi

echo "========================================="
echo " Pipeline Complete!"
echo "========================================="
echo ""
echo "Output files:"
echo "  data/sitemap-urls.json"
echo "  data/page-types.json"
echo "  data/page-inspections.json"
echo "  .ai-reports/dogfood-frascanada/report.md"
echo "  .ai-reports/dogfood-frascanada/page-types.md"
echo "  .ai-reports/dogfood-frascanada/components.md"
echo "  .ai-reports/dogfood-frascanada/screenshots/"
