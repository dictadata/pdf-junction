/**
 * test/pdf/list
 */
"use strict";

require("../register");
const { logger } = require('@dictadata/storage-junctions/utils');
const { list } = require('@dictadata/storage-junctions/test');

logger.info("=== tests: pdf list");

async function tests() {

  logger.info("=== list pdf sheets (forEach)");
  if (await list({
    origin: {
      smt: "pdf|path|document.pdf|*",
      options: {
        schema: "foo*"
      }
    },
    terminal: {
      output: "./data/output/pdf/list.json"
    }
  })) return 1;

}

(async () => {
  await tests();
})();
