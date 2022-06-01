/**
 * parsepdf
 *
 * Example of using pdf-parse.js
 */

const parser = require('./pdf-parse-rawText.js');
const fs = require('fs');
const path = require('path');

var dataBuffer = fs.readFileSync('./data/input/pdf/ClassCodes.pdf');

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
  let output = "./data/output/pdf.js/pdf.txt";
  console.log("output: " + output);
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, data.text);
});
