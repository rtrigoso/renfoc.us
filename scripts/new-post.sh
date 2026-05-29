#!/usr/bin/env bash
set -euo pipefail

if [ $# -lt 1 ]; then
  echo "Usage: $(basename "$0") <post title>" >&2
  exit 1
fi

TITLE="$*"
TIMESTAMP=$(date +%s)
SLUG=$(echo "$TITLE" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/_/g' | sed 's/__*/_/g' | sed 's/^_//;s/_$//')
DATE=$(date +%m-%d-%Y)

CONTENT_DIR="$(cd "$(dirname "$0")/../content" && pwd)"
FILENAME="${TIMESTAMP}-${SLUG}.md"
FILEPATH="${CONTENT_DIR}/${FILENAME}"

cat > "$FILEPATH" <<EOF
###### ${DATE}
## ${TITLE}

EOF

echo "Created: content/${FILENAME}"
