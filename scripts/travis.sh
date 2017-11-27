#!/bin/bash

set -e

echo "Running code checks & build"

npm run lint
npm run test
npm run build

# Pull requests and commits to other branches shouldn't try to deploy, just build to verify
if [ "$TRAVIS_PULL_REQUEST" != "false" -o "$TRAVIS_BRANCH" != "master" ]; then
  echo "Branch check completed"

  exit 0
fi

echo "Setting up GitHub config"

git config push.default simple
git config merge.ours.driver true
git config user.name "Travis CI"
git config user.email "$COMMIT_AUTHOR_EMAIL"

echo "Bumping package version"

git remote set-url origin https://${GH_TOKEN}@github.com/${TRAVIS_REPO_SLUG}.git > /dev/null 2>&1
npm --no-git-tag-version version
npm version patch -m "[CI Skip] Version bump"
git push --quiet origin HEAD:refs/heads/$TRAVIS_BRANCH > /dev/null 2>&1

echo "Publishing build"

PACKAGE_VERSION=$(cat package.json \
  | grep version \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g')

git clone https://github.com/dist-${TRAVIS_REPO_SLUG}-dist.git dist
cd dist
git remote set-url origin https://${GH_TOKEN}@github.com/${TRAVIS_REPO_SLUG}-dist.git > /dev/null 2>&1
git checkout $TRAVIS_BRANCH
rm -rf static
cp -rf ../build/ .
cp -f ../icon.png ../package.json .
sed "s/VERSION/$PACKAGE_VERSION/" < ../manifest.json >manifest.json
git add .
git commit -m "Version $PACKAGE_VERSION"
git push --quiet origin HEAD:refs/heads/$TRAVIS_BRANCH > /dev/null 2>&1
cd ..

echo "Release completed"

exit 0
