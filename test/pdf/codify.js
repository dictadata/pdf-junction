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
      smt: "pdf|./data/input/pdf/ClassCodes.pdf|*|*",
      options: {}
    },
    output: "./data/output/pdf/codify_1.json"
  })) return 1;
}

(async () => {
  if (await tests()) return 1;
})();
