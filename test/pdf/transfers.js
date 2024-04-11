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
      smt: "pdf|./test/data/input/pdf/|helloworld.pdf|*",
      options: {
        headers: [ "Greating" ]
      }
    },
    terminal: {
      smt: "json|./test/data/output/pdf/|transfer_0.json|*",
      output: "./test/data/output/pdf/transfer_0.json"
    }
  })) return 1;

  logger.info("=== pdf transfer ClassCodes");
  if (await transfer({
    origin: {
      smt: "pdf|./test/data/input/pdf/|ClassCodes.pdf|*",
    },
    terminal: {
      smt: "json|./test/data/output/pdf/|transfer_1.json|*",
      output: "./test/data/output/pdf/transfer_1.json"
    }
  })) return 1;

  logger.info("=== pdf transfer Nat_State_Topic_File_formats");
  if (await transfer({
    origin: {
      smt: "pdf|./test/data/input/pdf/Nat_State_Topic_File_formats.pdf||*",
      options: {
        heading: "Government Units File Format",
        cells: 3,
        orderXY: false
      }
    },
    terminal: {
      smt: "json|./test/data/output/pdf/|transfer_2.json|*",
      output: "./test/data/output/pdf/transfer_2.json"
    }
  })) return 1;

  logger.info("=== pdf transfer CongNov22 District 4");
  if (await transfer({
    origin: {
      smt: "pdf|./test/data/input/pdf/CongNov22.pdf||*",
      options: {
        heading: "US Representative District 4",
        cells: 8
      }
    },
    terminal: {
      smt: "json|./test/data/output/pdf/|transfer_3.json|*",
      output: "./test/data/output/pdf/transfer_3.json"
    }
  })) return 1;

}

(async () => {
  await tests();
})();
