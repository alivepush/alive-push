#!/usr/bin/env bash
node_modules/babel-cli/bin/babel.js alive-push.js | node_modules/uglify-js/bin/uglifyjs -o ./index.js