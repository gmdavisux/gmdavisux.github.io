#!/bin/bash
# Local preview without Jekyll or Ruby.
cd "$(dirname "$0")"
PORT="${1:-4000}"
echo "Portfolio preview: http://localhost:${PORT}"
echo "Press Ctrl+C to stop."
python3 -m http.server "$PORT"