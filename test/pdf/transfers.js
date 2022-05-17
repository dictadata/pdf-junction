/**
 * test/pdf/transfer
 */
"use strict";

require("../register");
const { logger } = require("@dictadata/storage-junctions/utils");
const { transfer } = require("@dictadata/storage-junctions/test");

logger.info("=== Test: pdf");

async function tests() {

  logger.info("=== pdf writer");
  if (await transfer({
    origin: {
      smt: "csv|./test/data/input/|foofile.csv|*",
      options: {
        header: true
      }
    },
    terminal: {
      smt: "pdf|connection string|foo_schema|*"
    }
  })) return 1;

  logger.info("=== pdf reader");
  if (await transfer({
    origin: {
      smt: "pdf|connection string|foo_schema|*"
    },
    terminal: {
      smt: "json|./test/output/pdf/|foo_file.json|*"
    }
  })) return 1;
}

(async () => {
  await tests();
})();
