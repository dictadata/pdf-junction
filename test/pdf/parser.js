
/**
 * test the pdf-data-parser
 */
"use strict";

const pdfDataParser = require("../../storage/junctions/pdf/pdf-data-parser");
const fs = require("fs");
const path = require("path");

async function test(input) {
  console.log(">>> input: " + input);

  const options = {
    url: input
  };
  let parser = new pdfDataParser(options);
  let rows = [];

  parser.on('data', (data) => {
    rows.push(data);
  });

  parser.on('end', () => {
    let output = input.replace("/input/", "/output/").replace(".pdf", ".json");
    console.log(">>> output: " + output);
    fs.mkdirSync(path.dirname(output), { recursive: true });
    fs.writeFileSync(output, JSON.stringify(rows, null, 2));
  });

  parser.on('error', (err) => {
    console.error(err);
  });

  await parser.parsePDF();
}

(async () => {
  if (await test("./data/input/pdf/ClassCodes.pdf")) return;
  //if (await test("./data/input/pdf/Nat_State_Topic_File_formats.pdf")) return;
})();
