/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

// source copied from PDF.js examples/node/getInfo.js.

//
// Basic node example that prints document metadata and text content.
// Requires single file built version of PDF.js -- please run
// `gulp singlefile` before running the example.
//

const pdfjsLib = require("../../lib/pdfjs-dist/build/pdf.js");
//pdfjsLib.GlobalWorkerOptions.workerSrc = '../../lib/pdfjs-dist/build/pdf.worker.js';

const fs = require("fs");
const path = require("path");

var pdfPath;
var doc;

async function getContent() {
  try {
    var loadingTask = pdfjsLib.getDocument({ url: pdfPath, fontExtraProperties: true });
    doc = await loadingTask.promise;

    const numPages = doc.numPages;
    console.log("# Document Loaded");
    console.log("Number of Pages: " + numPages);
    console.log();

    let docdata = await doc.getMetadata();
    console.log("# Metadata Is Loaded");
    console.log("## Info");
    console.log(JSON.stringify(docdata.info, null, 2));
    console.log();

    if (docdata.metadata) {
      console.log("## Metadata");
      console.log(JSON.stringify(docdata.metadata.getAll(), null, 2));
      console.log();
    }

    let markInfo = await doc.getMarkInfo();
    console.log("Marked = " + markInfo.Marked);

    for (let n = 1; n <= numPages; n++) {
      await loadPage(n);
    }

    console.log("# End of Document");
  }
  catch (err) {
    console.error("Error: " + err);
  }
}

async function loadPage(pageNum) {
  let page = await doc.getPage(pageNum);
  console.log("# Page " + pageNum);

  const viewport = page.getViewport({ scale: 1.0 });
  console.log("Size: " + viewport.width + "x" + viewport.height);

  let content = await page.getTextContent({ includeMarkedContent: true });
  /*
  // Content contains lots of information about the text layout and
  // styles, but we need only strings at the moment
  const strings = content.items.map(function (item) {
    return item.str ? item.str : '';
  });
  console.log("## Text Content");
  console.log(strings.join(" "));
  */

  let output = "./data/output/pdf.js/" + path.parse(pdfPath).name + "_content" + pageNum + ".json";
  console.log("output: " + output);
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, JSON.stringify(content.items, null, 2));

  // Release page resources.
  page.cleanup();

  console.log();
}

(async () => {
  // Loading file from file system into typed array
  // pdfPath = "./helloworld.pdf";
  // pdfPath = process.argv[ 2 ] || "./data/input/pdf/ClassCodes.pdf";
  pdfPath = process.argv[ 2 ] || "./data/input/pdf/Nat_State_Topic_File_formats.pdf";

  await getContent();
})();
