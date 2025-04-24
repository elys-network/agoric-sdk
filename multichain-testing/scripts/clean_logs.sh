#!/bin/bash

# Optional: stream logs from a live process or a log file
# Example: yarn logs | ./clean_cosmos_logs.sh

# Define patterns that are routine and should be filtered out
ROUTINE_PATTERNS=(
  "state updated"
  "commit synced"
  "committed state"
  "indexed block events"
  "executed block"
  "Timed out"
  "received proposal"
  "received complete proposal block"
  "finalizing commit"
  "minted coins from module account"
  "block-manager: block .* (begin|commit)"
  "Ensure peers"
  "No addresses to dial"
)

# Convert patterns into a single grep -v expression
FILTER_CMD="cat"
for pattern in "${ROUTINE_PATTERNS[@]}"; do
  FILTER_CMD="$FILTER_CMD | grep -v -E '$pattern'"
done

# Run the filter on stdin
eval "$FILTER_CMD"
