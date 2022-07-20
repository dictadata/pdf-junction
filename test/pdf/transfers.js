/**
 * test/pdf/transfer
 */
"use strict";

require("../register");
const { transfer } = require("@dictadata/storage-junctions/test");
const { logger } = require("@dictadata/storage-junctions/utils");

logger.info("=== Test: pdf");

async function tests() {
  logger.info("=== pdf transfer helloworld");
  if (await transfer({
    origin: {
      smt: "pdf|./data/input/pdf/helloworld.pdf|*|*",
      options: {
        headers: [ "Greating" ]
      }
    },
    terminal: {
      smt: "json|./data/output/pdf/|transfer_0.json|*",
      output: "./data/output/pdf/transfer_0.json"
    }
  })) return 1;

  logger.info("=== pdf transfer ClassCodes");
  if (await transfer({
    origin: {
      smt: "pdf|./data/input/pdf/ClassCodes.pdf|*|*",
    },
    terminal: {
      smt: "json|./data/output/pdf/|transfer_1.json|*",
      output: "./data/output/pdf/transfer_1.json"
    }
  })) return 1;

  logger.info("=== pdf transfer Nat_State_Topic_File_formats");
  if (await transfer({
    origin: {
      smt: "pdf|./data/input/pdf/Nat_State_Topic_File_formats.pdf|*|*",
      options: {
        heading: "Government Units File Format",
        cells: 3
      }
    },
    terminal: {
      smt: "json|./data/output/pdf/|transfer_2.json|*",
      output: "./data/output/pdf/transfer_2.json"
    }
  })) return 1;
}

(async () => {
  await tests();
})();
