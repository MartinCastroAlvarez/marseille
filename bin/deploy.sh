#!/bin/bash
echo "Deploying Marseille."
STAGE="$1"
if [ -z "${STAGE}" ]
then
    STAGE="master"
    echo "WARNING: Stage is master."
fi
cat "$HOME/.marseille"
if [ $? != 0 ]
then
    echo "ERROR: Failed to load config."
    exit 1824
fi
export AWS_PROFILE=$(cat "$HOME/.marseille" | jq -r '.profile')
export AWS_DEFAULT_REGION=$(cat "$HOME/.marseille" | jq -r '.region')
export MARSEILLE_SHOP=$(cat "$HOME/.marseille " | jq -r '.shop')
export MARSEILLE_USER=$(cat "$HOME/.marseille " | jq -r '.user')
export MARSEILLE_PASS=$(cat "$HOME/.marseille " | jq -r '.pass')
export MARSEILLE_DEPLOY=$(cat "$HOME/.deploy" | jq -r '.deploy')
export MARSEILLE_KEY=$(cat "$HOME/.marseille " | jq -r '.key')
if [ $? != 0 ]
then
    echo "ERROR: Failed to load config keys."
    exit 1824
fi
npm install
if [ $? != 0 ]
then
    echo "ERROR: Failed to install NPM dependencies."
    exit 1824
fi
ROOT=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
cd "$ROOT/../app"
serverless deploy \
    --region "${AWS_DEFAULT_REGION}" \
    --config "serverless.yml" \
    --force \
    --conceal \
    --stage "${STAGE}"
if [ $? != 0 ]
then
    echo "ERROR: Failed to deploy."
    exit 1824
fi
