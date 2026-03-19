#!/bin/bash
# generate-golems-stats.sh — Collect all ecosystem stats into one JSON
# Run locally before deploy: ./scripts/generate-golems-stats.sh
# Output: app/(golems)/golems/lib/golems-stats.json
#
# Stats are committed to the repo so Vercel can read them at build time.
# The golems repo, BrainLayer DB, and MCP configs are only available locally.

set -euo pipefail

GOLEMS_DIR="${GOLEMS_DIR:-$HOME/Gits/golems}"
BRAINLAYER_DB="${BRAINLAYER_DB:-$HOME/.local/share/brainlayer/brainlayer.db}"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(dirname "$SCRIPT_DIR")"
OUTPUT="$REPO_ROOT/app/(golems)/golems/lib/golems-stats.json"
CONTENT_DIR="$REPO_ROOT/content/golems"

# ── Helpers ──────────────────────────────────────────────────────
count_dirs() { ls -d "$1"/*/ 2>/dev/null | wc -l | tr -d ' '; }
list_basenames() { ls -d "$1"/*/ 2>/dev/null | while read -r d; do basename "$d"; done | sort | paste -sd',' -; }

echo "📊 Generating golems ecosystem stats..."

# ── 1. Skills ────────────────────────────────────────────────────
SKILLS_DIR="$GOLEMS_DIR/skills/golem-powers"
skills_count=$(count_dirs "$SKILLS_DIR")
skills_with_evals=$(ls "$SKILLS_DIR"/*/evals/evals.json 2>/dev/null | wc -l | tr -d ' ')
skills_with_skillmd=$(ls "$SKILLS_DIR"/*/SKILL.md 2>/dev/null | wc -l | tr -d ' ')
echo "  Skills: $skills_count dirs, $skills_with_skillmd with SKILL.md, $skills_with_evals with evals"

# ── 2. Packages ──────────────────────────────────────────────────
packages_count=$(count_dirs "$GOLEMS_DIR/packages")
packages_list=$(list_basenames "$GOLEMS_DIR/packages")
echo "  Packages: $packages_count ($packages_list)"

# ── 3. Tests (optional — slow) ──────────────────────────────────
tests_passing=0
tests_failing=0
tests_skipped=0
tests_files=0
tests_total=0

if [[ "${RUN_TESTS:-0}" == "1" ]]; then
  echo "  Running tests (this takes a minute)..."
  test_output=$(cd "$GOLEMS_DIR" && bun test 2>&1 || true)
  # Parse bun test summary line: "X pass, Y fail, Z skip | N files"
  tests_passing=$(echo "$test_output" | grep -oE '[0-9]+ pass' | head -1 | grep -oE '[0-9]+' || echo "0")
  tests_failing=$(echo "$test_output" | grep -oE '[0-9]+ fail' | head -1 | grep -oE '[0-9]+' || echo "0")
  tests_skipped=$(echo "$test_output" | grep -oE '[0-9]+ skip' | head -1 | grep -oE '[0-9]+' || echo "0")
  tests_files=$(echo "$test_output" | grep -oE '[0-9]+ files' | head -1 | grep -oE '[0-9]+' || echo "0")
  tests_total=$((tests_passing + tests_failing + tests_skipped))
  echo "  Tests: $tests_passing pass, $tests_failing fail, $tests_skipped skip ($tests_files files)"
else
  echo "  Tests: skipped (set RUN_TESTS=1 to run)"
  # Use last known values from existing JSON if available
  if [[ -f "$OUTPUT" ]]; then
    tests_passing=$(python3 -c "import json; d=json.load(open('$OUTPUT')); print(d.get('tests',{}).get('passing',0))" 2>/dev/null || echo "0")
    tests_failing=$(python3 -c "import json; d=json.load(open('$OUTPUT')); print(d.get('tests',{}).get('failing',0))" 2>/dev/null || echo "0")
    tests_skipped=$(python3 -c "import json; d=json.load(open('$OUTPUT')); print(d.get('tests',{}).get('skipped',0))" 2>/dev/null || echo "0")
    tests_files=$(python3 -c "import json; d=json.load(open('$OUTPUT')); print(d.get('tests',{}).get('files',0))" 2>/dev/null || echo "0")
    tests_total=$((tests_passing + tests_failing + tests_skipped))
    echo "  Tests (cached): $tests_passing pass"
  fi
fi

# ── 4. BrainLayer chunks ────────────────────────────────────────
chunks_count=0
if [[ -f "$BRAINLAYER_DB" ]]; then
  chunks_count=$(sqlite3 "$BRAINLAYER_DB" 'SELECT COUNT(*) FROM chunks' 2>/dev/null || echo "0")
  echo "  BrainLayer: $chunks_count chunks"
else
  # Fall back to cached value
  if [[ -f "$OUTPUT" ]]; then
    chunks_count=$(python3 -c "import json; d=json.load(open('$OUTPUT')); print(d.get('brainlayer',{}).get('chunks',0))" 2>/dev/null || echo "0")
    echo "  BrainLayer (cached): $chunks_count chunks"
  fi
fi
# Round to nearest K for display
chunks_display="${chunks_count}"
if (( chunks_count > 1000 )); then
  chunks_k=$(( chunks_count / 1000 ))
  chunks_display="${chunks_k}K+"
fi

# ── 5. MCP servers ───────────────────────────────────────────────
mcp_servers=()
# Check common MCP config locations
for cfg in "$HOME/Gits/.mcp.json" "$HOME/.claude/mcp.json" "$GOLEMS_DIR/.mcp.json"; do
  if [[ -f "$cfg" ]]; then
    servers=$(python3 -c "
import json
with open('$cfg') as f:
    d = json.load(f)
    servers = d.get('mcpServers', {})
    for s in sorted(servers.keys()):
        print(s)
" 2>/dev/null || true)
    while IFS= read -r s; do
      [[ -n "$s" ]] && mcp_servers+=("$s")
    done <<< "$servers"
  fi
done
# Deduplicate and filter out disabled servers
mcp_list=$(printf '%s\n' "${mcp_servers[@]}" | grep -v '^_disabled' | sort -u | paste -sd',' -)
mcp_count=$(printf '%s\n' "${mcp_servers[@]}" | grep -v '^_disabled' | sort -u | wc -l | tr -d ' ')
echo "  MCP servers: $mcp_count"

# ── 6. Agents/golems count ───────────────────────────────────────
agents_count=7  # Known: ClaudeGolem, RecruiterGolem, TellerGolem, JobGolem, CoachGolem, ContentGolem, Services
echo "  Agents: $agents_count"

# ── 7. Per-skill eval data ───────────────────────────────────────
evals_json="["
first=true
for eval_file in "$SKILLS_DIR"/*/evals/evals.json; do
  [[ -f "$eval_file" ]] || continue
  skill_name=$(basename "$(dirname "$(dirname "$eval_file")")")
  eval_data=$(python3 -c "
import json
with open('$eval_file') as f:
    d = json.load(f)
    evals = d.get('evals', d if isinstance(d, list) else [])
    if not isinstance(evals, list):
        evals = []
    eval_count = len(evals)
    total_assertions = sum(len(e.get('assertions', [])) for e in evals if isinstance(e, dict))
    print(f'{eval_count},{total_assertions}')
" 2>/dev/null || echo "0,0")
  eval_count=$(echo "$eval_data" | cut -d, -f1)
  assertion_count=$(echo "$eval_data" | cut -d, -f2)

  has_fixtures="false"
  [[ -d "$(dirname "$eval_file")/fixtures" ]] && has_fixtures="true"

  if [[ "$first" == "true" ]]; then
    first=false
  else
    evals_json+=","
  fi
  evals_json+="{\"skill\":\"$skill_name\",\"evalCount\":$eval_count,\"assertionCount\":$assertion_count,\"hasFixtures\":$has_fixtures}"
done
evals_json+="]"

# ── 8. Write JSON ────────────────────────────────────────────────
generated_at=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

cat > "$OUTPUT" << JSONEOF
{
  "generatedAt": "$generated_at",
  "skills": {
    "count": $skills_count,
    "withSkillMd": $skills_with_skillmd,
    "withEvals": $skills_with_evals,
    "evalCoverage": "$(echo "scale=0; $skills_with_evals * 100 / $skills_count" | bc)%"
  },
  "packages": {
    "count": $packages_count,
    "list": "$(echo "$packages_list" | sed 's/,/, /g')"
  },
  "tests": {
    "passing": $tests_passing,
    "failing": $tests_failing,
    "skipped": $tests_skipped,
    "total": $tests_total,
    "files": $tests_files
  },
  "brainlayer": {
    "chunks": $chunks_count,
    "chunksDisplay": "$chunks_display"
  },
  "mcp": {
    "count": $mcp_count,
    "servers": "$(echo "$mcp_list" | sed 's/,/, /g')"
  },
  "agents": {
    "count": $agents_count
  },
  "evals": $evals_json
}
JSONEOF

echo ""
echo "✅ Stats written to $OUTPUT"
echo "   Generated at: $generated_at"

# ── 9. Update markdown content files ─────────────────────────────
# Replace known patterns in content/golems/*.md so docs stay fresh
if [[ -d "$CONTENT_DIR" ]]; then
  echo ""
  echo "📝 Updating content markdown files..."

  # Function to do safe in-place replacement on macOS
  replace_in_files() {
    local pattern="$1"
    local replacement="$2"
    local glob="$3"
    find "$CONTENT_DIR" -name "$glob" -exec sed -i '' "s|$pattern|$replacement|g" {} +
  }

  # Package count: "N packages" in bold or plain
  replace_in_files '\*\*[0-9]* packages\*\*' "**$packages_count packages**" "*.md"
  replace_in_files 'with [0-9]* packages' "with $packages_count packages" "*.md"
  replace_in_files 'all [0-9]* packages' "all $packages_count packages" "*.md"

  # Test count: "N tests" in bold
  replace_in_files '\*\*[0-9,]* tests\*\*' "**$tests_passing tests**" "*.md"

  # Skills count: "N skills" or "N+ skills"
  replace_in_files 'The [0-9]* skills' "The $skills_count skills" "*.md"
  replace_in_files '[0-9]* reusable Claude Code skills' "$skills_count reusable Claude Code skills" "*.md"

  echo "  Done."
fi
