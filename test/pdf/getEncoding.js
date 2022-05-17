/**
 * test/pdf/encoding
 */
"use strict";

require("../register");
const { logger } = require("@dictadata/storage-junctions/utils");
const { getEncoding } = require("@dictadata/storage-junctions/test");

logger.info("=== Test: pdf");

async function tests() {

  logger.info("=== pdf getEncoding");
  if (await getEncoding({
    origin: {
      smt: "pdf|connection string|foo_schema|*",
      options: {}
    },
    terminal: {
      output: './test/data/output/pdf/foo_schema.encoding.json'
    }
  })) return 1;

}

(async () => {
  await tests();
})();
