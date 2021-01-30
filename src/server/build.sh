#/bin/bash
npm install -only=dev # installs only dev dependencies
npm install            # installs prod dependencies
tsc
node server.js          # builds the Vue.js app