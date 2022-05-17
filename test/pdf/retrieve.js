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
      smt: "pdf|connection string|foo_schema|*",
      pattern: {
        match: {
          "Foo": 'twenty'
        }
      }
    },
    terminal: {
      output: "./test/data/output/pdf/retrieve_01.json"
    }
  })) return 1;

  logger.info("=== pdf retrieve with pattern");
  if (await retrieve({
    origin: {
      smt: "pdf|connection string|foo_transfer|*",
      pattern: {
        match: {
          "Foo": "first",
          "Baz": { "gte": 0, "lte": 1000 }
        },
        count: 3,
        order: { "Dt Test": "asc" },
        fields: [ "Foo", "Baz" ]
      }
    },
    terminal: {
      output: "./test/data/output/pdf/retrieve_02.json"
    }
  })) return 1;

}

(async () => {
  await tests();
})();
