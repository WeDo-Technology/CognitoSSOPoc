#!/bin/bash
MAINDIR=$(pwd)

echo "Deploying all apps"
echo "Deploying IdentityRelay"
cd $MAINDIR/IdentityRelay/identity-relay/
pnpm run build
swa deploy

echo "Deploying ReactFullExample"
cd $MAINDIR/ReactFullExample
pnpm run build
swa deploy

echo "Deploying ReactMiniExample"
cd $MAINDIR/ReactMiniExample
pnpm run build
swa deploy --env forbidden
swa deploy --env preview

echo "Deploying SimplePage"
cd $MAINDIR/SimplePage
cp index.html dist/index.html
swa deploy

echo "Deployed all apps"
