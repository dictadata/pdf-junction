/**
 * test/codify
 */
"use strict";

require("../_register");
const { codify } = require("@dictadata/storage-junctions/test")
const { logger } = require("@dictadata/lib");

logger.info("=== tests: pdf codify");

async function tests() {
  logger.verbose("=== codify helloworld.pdf");
  if (await codify({
    origin: {
      smt: "pdf|./test/data/input/pdf/|helloworld.pdf|*",
      options: {
        headers: [ "Greating" ]
      }
    },
    "terminal": {
      output: "./test/data/output/pdf/codify_0.json"
    }
  })) return 1;

  logger.verbose("=== codify ClassCodes.pdf");
  if (await codify({
    origin: {
      smt: "pdf|./test/data/input/pdf/|ClassCodes.pdf|*",
      options: {}
    },
    "terminal": {
      output: "./test/data/output/pdf/codify_1.json"
    }
  })) return 1;

  logger.verbose("=== codify Nat_State_Topic_File_formats.pdf");
  if (await codify({
    origin: {
      smt: "pdf|./test/data/input/pdf/|Nat_State_Topic_File_formats.pdf|*",
      options: {
        heading: "Government Units File Format",
        cells: 3
      }
    },
    "terminal": {
      output: "./test/data/output/pdf/codify_2.json"
    }
  })) return 1;

  logger.verbose("=== codify CongNov22.pdf");
  if (await codify({
    origin: {
      smt: "pdf|./test/data/input/pdf/|CongNov22.pdf|*",
      options: {
        heading: "US Representative District 1",
        cells: 10
      }
    },
    "terminal": {
      output: "./test/data/output/pdf/codify_3.json"
    }
  })) return 1;

  logger.verbose("=== codify voter_registration");
  if (await codify({
    origin: {
      smt: "pdf|file:/var/dictadata/AZ/azsos.gov/election/VoterReg/2024/|state_voter_registration_jan2024.pdf|*",
      "options": {
        "pages": [ 1 ],
        "pageHeader": 64,
        "cells": 9,
        "RepeatCell.column": 0,
        "missingValue": "*"
      }
    },
    "terminal": {
      output: "./test/data/output/pdf/codify_4.json"
    }
  })) return 1;
}

(async () => {
  if (await tests()) return 1;
})();
