/**
 * test/pdf/retrieve
 */
"use strict";

require("../_register");
const { logger } = require("@dictadata/lib");
const { retrieve } = require("@dictadata/storage-junctions/test");

logger.info("=== Test: pdf");

async function tests() {

  logger.info("=== pdf retrieve helloworld");
  if (await retrieve({
    origin: {
      smt: "pdf|./test/data/input/pdf/|helloworld.pdf|*",
      options: {
        headers: [ "Greating" ]
      },
      pattern: {}
    },
    terminal: {
      output: "./test/data/output/pdf/retrieve_0.json"
    }
  })) return 1;

  logger.info("=== pdf retrieve ClassCodes");
  if (await retrieve({
    origin: {
      smt: "pdf|./test/data/input/pdf/|ClassCodes.pdf|*",
      pattern: {}
    },
    terminal: {
      output: "./test/data/output/pdf/retrieve_1.json"
    }
  })) return 1;

  logger.info("=== pdf retrieve Nat_State_Topic_File_formats");
  if (await retrieve({
    origin: {
      smt: "pdf|./test/data/input/pdf/Nat_State_Topic_File_formats.pdf||*",
      options: {
        heading: "Government Units File Format",
        cells: 3,
        orderXY: false
      },
      pattern: {}
    },
    terminal: {
      output: "./test/data/output/pdf/retrieve_2.json"
    }
  })) return 1;

  logger.info("=== pdf retrieve CongNov22 District 2");
  if (await retrieve({
    origin: {
      smt: "pdf|./test/data/input/pdf/CongNov22.pdf||*",
      options: {
        heading: "US Representative District 2",
        cells: 10
      },
      pattern: {}
    },
    terminal: {
      output: "./test/data/output/pdf/retrieve_3.json"
    }
  })) return 1;

  logger.info("=== pdf retrieve repeating cell");
  if (await retrieve({
    origin: {
      smt: "pdf|./test/data/input/pdf/state_voter_registration_jan2024.pdf||*",
      options: {
        pages: [ 1 ],
        pageHeader: 64,
        cells: 7,
        column: 0
      },
      pattern: {}
    },
    terminal: {
      output: "./test/data/output/pdf/retrieve_4.json"
    }
  })) return 1;

  logger.info("=== pdf retrieve repeating heading");
  if (await retrieve({
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
      output: "./test/data/output/pdf/retrieve_5.json"
    }
  })) return 1;

}

(async () => {
  await tests();
})();
