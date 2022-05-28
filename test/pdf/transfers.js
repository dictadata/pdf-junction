/**
 * test/pdf/transfer
 */
"use strict";

require("../register");
const { transfer } = require("@dictadata/storage-junctions/test");
const { logger } = require("@dictadata/storage-junctions/utils");

logger.info("=== Test: pdf");

async function tests() {
  logger.info("=== pdf reader");
  if (await transfer({
    origin: {
      smt: "pdf|/var/data/us/census.gov/reference/ClassCodes.pdf|*|*",
    },
    terminal: {
      smt: "json|./data/output/pdf/|transfer_1.json|*",
      output: "./data/output/pdf/transfer_1.json"
    }
  })) return 1;
}

(async () => {
  await tests();
})();
