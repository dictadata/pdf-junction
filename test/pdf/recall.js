/**
 * test/pdf/recall
 */
"use strict";

require("../register");
const { logger } = require("@dictadata/storage-junctions/utils");
const { recall } = require("@dictadata/storage-junctions/test");

logger.info("=== Test: pdf");

async function tests() {

  logger.info("=== pdf recall");
  if (await recall({
    origin: {
      smt: "pdf|connection string|foo_schema|=Foo",
      pattern: {
        match: {
          Foo: 'twenty'
        }
      }
    },
    terminal: {
      output: "./test/data/output/pdf/recall_01.json"
    }
  })) return 1;

  logger.info("=== pdf recall");
  if (await recall({
    origin: {
      smt: "pdf|connection string|foo_schema|=Foo",
      pattern: {
        match: {
          Foo: 'ten'
        }
      }
    },
    terminal: {
      output: "./test/data/output/pdf/recall_02.json"
    }
  })) return 1;

}

(async () => {
  await tests();
})();
