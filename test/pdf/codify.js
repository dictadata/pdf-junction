/**
 * test/codify
 */
"use strict";

require("../register");
const { codify } = require("@dictadata/storage-junctions/test")
const { logger } = require("@dictadata/storage-junctions/utils");

logger.info("=== tests: pdf codify");

async function tests() {
  logger.verbose("=== ClassCodes.pdf");
  if (await codify({
    origin: {
      smt: "pdf|/var/data/us/census.gov/reference/ClassCodes.pdf|*|*",
      options: {}
    },
    outputFile1: './test/data/output/pdf/ClassCodes.encoding.json'
  })) return 1;
}

(async () => {
  if (await tests()) return 1;
})();
