#!/usr/bin/env bash
node_modules/documentation/bin/documentation.js readme alive-push.js --section 'API'
node_modules/markdown-styles/bin/generate-md --layout mixu-bootstrap-2col --input ./README.md --output ./dist/alivepushapi