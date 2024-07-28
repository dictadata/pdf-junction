/**
 * test/pdf/transfer
 */
"use strict";

require("../_register");
const { transfer } = require("@dictadata/storage-junctions/test");
const { logger } = require("@dictadata/lib");

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

  logger.info("=== pdf transfer repeating cell");
  if (await transfer({
    origin: {
      smt: "pdf|./test/data/input/pdf/state_voter_registration_jan2024.pdf||*",
      options: {
        pages: [ 1 ],
        pageHeader: 64,
        cells: 9,
        missingValue: "*",
        column: 0
      },
      pattern: {}
    },
    terminal: {
      smt: "json|./test/data/output/pdf/|transfer_4.json|*",
      output: "./test/data/output/pdf/transfer_4.json"
    }
  })) return 1;

  logger.info("=== pdf transfer repeating heading");
  if (await transfer({
    origin: {
      smt: "pdf|./test/data/input/pdf/state_voter_registration_jan2024.pdf||*",
      options: {
        pages: [ 2 ],
        pageHeader: 64,
        header: "County:1:0"
      },
      pattern: {}
    },
    terminal: {
      smt: "json|./test/data/output/pdf/|transfer_5.json|*",
      output: "./test/data/output/pdf/transfer_5.json"
    }
  })) return 1;

  logger.info("=== pdf transfer helloworld");
  if (await transfer({
    origin: {
      smt: "pdf|./test/data/input/pdf/|2023-Registered-Voter-Count.pdf|*",
      options: {
        pageHeader: 125,
        repeatingHeaders: true,
        cells: 3,
        hasHeader: true,
        encoding: {
          "County": "keyword",
          "Active": "integer",
          "Registered": "integer"
        }
      }
    },
    terminal: {
      smt: "json|./test/data/output/pdf/|transfer_rv_count.json|*",
      output: "./test/data/output/pdf/transfer_rv_count.json"
    }
  })) return 1;

}

(async () => {
  await tests();
})();
