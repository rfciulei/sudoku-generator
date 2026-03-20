#! /usr/bin/env bash

npm install --ignore-scripts \
  && npx node-gyp@10 rebuild --target="$(node -p "require('./node_modules/electron/package.json').version")" --arch=arm64 --dist-url=https://electronjs.org/headers \
  && npx electron .
