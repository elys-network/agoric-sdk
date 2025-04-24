#!/bin/bash

set -e

# --- Configuration ---
CONTAINER="stridelocal-genesis-0"
CHAIN_BINARY="strided"
GAS_SUBMIT="9000000"
GAS_VOTE="90000"
SLEEP_INTERVAL=2
VERBOSE=false

# Proposals and voting metadata
declare -a FILES=("add_ica_allowed_msgs_proposal.json" "add_hostzones_proposal.json")
declare -a LOCAL_PATHS=(
  "./scripts/add_ica_allowed_msgs_proposal.json"
  "./scripts/add_hostzones_proposal.json"
)
declare -a REMOTE_PATHS=(
  "/tmp/add_ica_allowed_msgs_proposal.json"
  "/tmp/add_hostzones_proposal.json"
)
declare -a SUBMIT_CMDS=(
  "tx gov submit-legacy-proposal param-change"
  "tx gov submit-proposal"
)
declare -a VOTERS=(
  "genesis"
  "genesis"
)

# --- Handle CLI flags ---
for arg in "$@"; do
  if [[ "$arg" == "--verbose" ]]; then
    VERBOSE=true
  fi
done

log() {
  if $VERBOSE; then
    echo "$@"
  fi
}

submit_and_vote() {
  local local_path="$1"
  local remote_path="$2"
  local submit_cmd="$3"
  local voter="$4"

  echo "📄 Copying $local_path to container..."
  kubectl cp "$local_path" "$CONTAINER:$remote_path"

  echo "📤 Submitting proposal: $remote_path"
  kubectl exec -i $CONTAINER -- $CHAIN_BINARY $submit_cmd "$remote_path" \
    --from genesis --gas "$GAS_SUBMIT" -y > /dev/null

  sleep 1  # give time for proposal to be indexed

  log "🔍 Fetching latest proposal ID..."
  PROPOSAL_ID=$(kubectl exec -i $CONTAINER -- $CHAIN_BINARY q gov proposals --output json \
    | jq -r '.proposals | sort_by(.id) | last | .id')

  echo "✅ Submitted proposal ID: $PROPOSAL_ID"

  echo "🗳️ Voting 'yes' with $voter..."
  kubectl exec -i $CONTAINER -- $CHAIN_BINARY tx gov vote "$PROPOSAL_ID" yes \
    --from "$voter" --gas "$GAS_VOTE" -y > /dev/null

  echo "⏳ Waiting for proposal $PROPOSAL_ID to exit voting period..."
  while true; do
    STATUS=$(kubectl exec -i $CONTAINER -- $CHAIN_BINARY q gov proposal "$PROPOSAL_ID" --output json \
      | jq -r '.status')

    if [[ "$STATUS" == "PROPOSAL_STATUS_VOTING_PERIOD" ]]; then
      log "  ⏱️  Still voting... (status: $STATUS)"
      sleep "$SLEEP_INTERVAL"
    else
      echo "✅ Proposal $PROPOSAL_ID finalized with status: $STATUS"
      break
    fi
  done

  echo "📊 Final tally for proposal $PROPOSAL_ID:"
  kubectl exec -i $CONTAINER -- $CHAIN_BINARY q gov proposal "$PROPOSAL_ID" --output json \
    | jq '.final_tally_result'

  echo "------------------------------------------------"
}

# --- Main ---
for i in "${!FILES[@]}"; do
  submit_and_vote "${LOCAL_PATHS[$i]}" "${REMOTE_PATHS[$i]}" "${SUBMIT_CMDS[$i]}" "${VOTERS[$i]}"
done
echo "✅ All proposals submitted and voted successfully!"
echo "------------------------------------------------"