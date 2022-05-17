/**
 * parsepdf
 *
 * Parse the Tiger Shapfile field description document.
 */
const fs = require('fs');
const pdf = require('./pdf-parse.js');

var dataBuffer = fs.readFileSync('/var/data/us/census.gov/reference/Nat_State_Topic_File_formats.pdf');

pdf(dataBuffer).then(function (data) {

  // number of pages
  console.log(data.numpages);
  // number of rendered pages
  console.log(data.numrender);
  // PDF info
  console.log(data.info);
  // PDF metadata
  console.log(data.metadata);
  // PDF.js version
  // check https://mozilla.github.io/pdf.js/getting_started/
  console.log(data.version);

  // PDF text
  fs.writeFileSync("pdf.txt", data.text);
});
