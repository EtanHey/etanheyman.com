#!/usr/bin/env bash
set -euo pipefail

guard="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/guard-no-docslocal.sh"
fixture="$(mktemp -d)"
trap 'rm -rf "$fixture"' EXIT
# AIDEV-NOTE: Isolate fixtures from inherited hook/worktree Git variables.
unset GIT_DIR GIT_WORK_TREE GIT_INDEX_FILE GIT_COMMON_DIR
cd "$fixture"
git init -q
printf 'docs.local/\n' > .gitignore
mkdir -p docs.local/nested
printf 'synthetic fixture\n' > docs.local/nested/example.txt

expect_status() {
  local expected="$1" actual=0
  bash "$guard" > "$fixture/output" 2>&1 || actual=$?
  if [ "$actual" -ne "$expected" ]; then
    cat "$fixture/output"
    echo "FAIL: $2 (expected $expected, got $actual)" >&2
    exit 1
  fi
  echo "PASS: $2"
}

expect_status 0 'clean index with ignored local file'
git add -f docs.local/nested/example.txt
expect_status 1 'force-staged docs.local file'
git -c user.name=GuardTest -c user.email=guard@example.invalid -c core.hooksPath=/dev/null commit -qm fixture
expect_status 1 'committed docs.local file'
