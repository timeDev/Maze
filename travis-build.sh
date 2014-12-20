#!/bin/bash
git clone $REPO_URL temp
cd temp
git checkout gh-pages
cp -r ../build/ ./
git add -A
git config user.name "Travis Build"
git config user.email "oshomburg@gmail.com"
git commit -m "push to github pages (auto)" -m "$TRAVIS_COMMIT_MSG"
git push origin gh-pages
