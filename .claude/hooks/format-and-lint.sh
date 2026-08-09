#!/usr/bin/env bash
# PostToolUse hook: format and lint-fix a single edited file.
#
# Reads the hook payload on stdin, formats the touched file with Prettier,
# then runs ESLint --fix on it. Anything ESLint cannot fix is written to
# stderr with exit 2, which feeds the errors back to the agent so it fixes
# them in the same turn instead of leaving a broken tree behind.
set -uo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

payload="$(cat)"
file="$(printf '%s' "$payload" | jq -r '.tool_response.filePath // .tool_input.file_path // empty')"

# Nothing to do: no path, deleted file, or a path outside the project.
[ -n "$file" ] || exit 0
[ -f "$file" ] || exit 0
case "$file" in
  "$ROOT"/*) ;;
  *) exit 0 ;;
esac

# Generated and vendored trees are not ours to format.
case "$file" in
  */node_modules/* | */.next/* | */pnpm-lock.yaml) exit 0 ;;
esac

case "$file" in
  *.ts | *.tsx | *.js | *.jsx | *.mjs | *.cjs) lintable=1 ;;
  *.css | *.json | *.md) lintable=0 ;;
  *) exit 0 ;;
esac

cd "$ROOT" || exit 0

pnpm exec prettier --write --ignore-unknown "$file" >/dev/null 2>&1

[ "$lintable" = "1" ] || exit 0

if ! output="$(pnpm exec eslint --fix "$file" 2>&1)"; then
  {
    echo "ESLint found problems in $file that --fix could not resolve:"
    echo "$output"
    echo
    echo "Fix these before moving on — the repo is expected to pass 'pnpm lint' at all times."
  } >&2
  exit 2
fi

exit 0
