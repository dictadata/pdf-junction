/**
 * test/pdf/dull
 */
"use strict";

require("../register");
const { logger } = require("@dictadata/storage-junctions/utils");
const { dull } = require("@dictadata/storage-junctions/test");

logger.info("=== Test: pdf");

async function tests() {

  logger.info("=== pdf dull");
  if (await dull({
    origin: {
      smt: "pdf|connection string|foo_schema|*",
      pattern: {
        match: {
          Foo: 'twenty'
        }
      }
    }
  })) return 1;

}

(async () => {
  await tests();
})();
