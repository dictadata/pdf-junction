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
      smt: "pdf|/var/data/us/census.gov/reference/ClassCodes.pdf|*|*",
      options: {}
    },
    terminal: {
      output: './test/data/output/pdf/schema.encoding.json'
    }
  })) return 1;

}

(async () => {
  await tests();
})();
