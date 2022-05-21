
/**
 * test the pdf-data-parser
 */
"use strict";

const pdfDataParser = require("../../storage/junctions/pdf-junction/pdf-data-parser");
const fs = require("fs");

(async () => {
  const options = {
    url: process.argv[ 2 ] || "/var/data/us/census.gov/reference/ClassCodes.pdf"
  }
  let parser = new pdfDataParser(options)
  let rows = [];

  parser.on('data', (data) => {
    rows.push(data);
  })

  parser.on('end', () => {
    console.log("write content_rows.json");
    fs.writeFileSync("./test/data/output/pdf/content_rows.json", JSON.stringify(rows, null, 2));
  });

  parser.on('error', (err) => {
    console.error(err);
  });

  parser.parsePDF();
})();
