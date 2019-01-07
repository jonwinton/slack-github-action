#!/bin/sh

set -e

# Make it easy to pull the branch or tag from the script
export BRANCH_OR_TAG=$(basename $GITHUB_REF)

node /node_scripts/index.js --arg="$*"
