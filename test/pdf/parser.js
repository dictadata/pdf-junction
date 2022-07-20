
/**
 * test the pdf-data-parser
 */
"use strict";

const { PdfDataParser } = require("pdf-data-parser");
const fs = require("fs");
const path = require("path");

async function test(options) {
  console.log(">>> input: " + options.url);

  let parser = new PdfDataParser(options);
  let rows = [];

  parser.on('data', (data) => {
    rows.push(data);
  });

  parser.on('end', () => {
    let output = options.url.replace("/input/", "/output/").replace(".pdf", ".json");
    console.log(">>> output: " + output);
    fs.mkdirSync(path.dirname(output), { recursive: true });
    fs.writeFileSync(output, JSON.stringify(rows, null, 2));
  });

  parser.on('error', (err) => {
    console.error(err);
  });

  await parser.parse();
}

(async () => {
  if (await test({ url: "./data/input/pdf/ClassCodes.pdf" })) return;
  if (await test({ url: "./data/input/pdf/Nat_State_Topic_File_formats.pdf", heading: "Government Units File Format", cells: 3 })) return;
})();
