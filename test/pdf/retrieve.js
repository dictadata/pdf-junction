/**
 * test/pdf/retrieve
 */
"use strict";

require("../register");
const { logger } = require("@dictadata/storage-junctions/utils");
const { retrieve } = require("@dictadata/storage-junctions/test");

logger.info("=== Test: pdf");

async function tests() {

  logger.info("=== pdf retrieve");
  if (await retrieve({
    origin: {
      smt: "pdf|/var/data/us/census.gov/reference/ClassCodes.pdf|*|*",
      pattern: {}
    },
    terminal: {
      output: "./data/output/pdf/retrieve_1.json"
    }
  })) return 1;

}

(async () => {
  await tests();
})();
