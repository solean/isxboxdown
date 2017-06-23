#!/usr/bin/env node

const isXboxDown = require('./lib/isxboxdown');
const utils = require('./lib/utils');

function main() {
  isXboxDown.getServiceStatuses()
    .then(utils.printPrettyServiceStatuses)
    .catch(console.log);
}


main();
