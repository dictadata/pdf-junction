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
      smt: "json|./test/output/pdf/|transfer_01.json|*"
    }
  })) return 1;
}

(async () => {
  await tests();
})();
