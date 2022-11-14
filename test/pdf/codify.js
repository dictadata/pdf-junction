/**
 * test/codify
 */
"use strict";

require("../register");
const { codify } = require("@dictadata/storage-junctions/test")
const { logger } = require("@dictadata/storage-junctions/utils");

logger.info("=== tests: pdf codify");

async function tests() {
  logger.verbose("=== codify helloworld.pdf");
  if (await codify({
    origin: {
      smt: "pdf|./data/input/pdf/|helloworld.pdf|*",
      options: {
        headers: [ "Greating" ]
      }
    },
    output: "./data/output/pdf/codify_0.json"
  })) return 1;

  logger.verbose("=== codify ClassCodes.pdf");
  if (await codify({
    origin: {
      smt: "pdf|./data/input/pdf/|ClassCodes.pdf|*",
      options: {}
    },
    output: "./data/output/pdf/codify_1.json"
  })) return 1;

  logger.verbose("=== codify Nat_State_Topic_File_formats.pdf");
  if (await codify({
    origin: {
      smt: "pdf|./data/input/pdf/Nat_State_Topic_File_formats.pdf||*",
      options: {
        heading: "Government Units File Format",
        cells: 3
      }
    },
    output: "./data/output/pdf/codify_2.json"
  })) return 1;

  logger.verbose("=== codify CongNov22.pdf");
  if (await codify({
    origin: {
      smt: "pdf|./data/input/pdf/CongNov22.pdf||*",
      options: {
        heading: "US Representative District 1",
        cells: 10
      }
    },
    output: "./data/output/pdf/codify_3.json"
  })) return 1;
}

(async () => {
  if (await tests()) return 1;
})();
