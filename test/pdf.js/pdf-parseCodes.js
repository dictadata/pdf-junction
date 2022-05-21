/**
 * parsepdf
 *
 * Example of using pdf-parse.js
 */

const fs = require('fs');
const parser = require('./pdf-parse.js');

var dataBuffer = fs.readFileSync('/var/data/us/census.gov/reference/ClassCodes.pdf');

parser(dataBuffer).then(function (data) {

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
