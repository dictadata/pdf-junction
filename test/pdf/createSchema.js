/**
 * test/pdf/encoding
 */
"use strict";

require("../register");
const { logger } = require("@dictadata/storage-junctions/utils");
const { createSchema } = require("@dictadata/storage-junctions/test");

logger.info("=== Test: pdf");

async function tests() {

  logger.info("=== pdf createSchema");
  if (await createSchema({
    origin: {
      smt: "pdf|connection string|foo_schema|*",
      options: {
        encoding: "./test/data/input/foo_schema.encoding.json"
      }
    }
  })) return 1;

}

(async () => {
  await tests();
})();
