#!/bin/sh

set -e

# Make it easy to pull the branch or tag from the script
export BRANCH_OR_TAG=$(basename $GITHUB_REF)

curl \
  -X POST \
  -H 'Content-type: application/json' \
  -d "$(echo -e $* | envsubst)" \
  https://hooks.slack.com$SLACK_PATH
