/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

//
// Basic node example that prints document metadata and text content.
// Requires single file built version of PDF.js -- please run
// `gulp singlefile` before running the example.
//

const pdfjsLib = require("../../lib/pdfjs-dist/build/pdf.js");
//pdfjsLib.GlobalWorkerOptions.workerSrc = '../../lib/pdfjs-dist/build/pdf.worker.js';

// Loading file from file system into typed array
// const pdfPath = "./helloworld.pdf"
const pdfPath = process.argv[ 2 ] || "/var/data/us/census.gov/reference/ClassCodes.pdf";

const fs = require("fs");

async function getAsJson() {
  try {
    var loadingTask = pdfjsLib.getDocument({ url: pdfPath });
    var doc = await loadingTask.promise;

    const numPages = doc.numPages;
    console.log("# Document Loaded");

    let docdata = await doc.getMetadata();
    console.log("# Metadata Loaded");
    console.log(docdata.info.title);

    let markInfo = await doc.getMarkInfo();
    console.log("Marked = " + markInfo.Marked)

    var data = {
      rows: [],
      header: null
    }

    for (let i = 1; i <= numPages; i++) {
      await parsePage(doc, i, data);
    }

    console.log("# End of Document");

    console.log("write content_rows.json");
    fs.writeFileSync("./content_rows.json", JSON.stringify(data.rows, null, 2));
  }
  catch (err) {
    console.error("Error: " + err);
  }
}

async function parsePage(doc, pageNum, data) {
  try {
    let page = await doc.getPage(pageNum)
    console.log("# Page " + pageNum);

    const { width, height } = page.getViewport({ scale: 1.0 });
    console.log("Size: " + width + "x" + height);

    let content = await page.getTextContent({ includeMarkedContent: true });
    console.log("## Text Content");

    let row = []
    let cell = {
      text: "",
      // cell lower-left
      x: width,
      y: height
    }
    let prevCell = {
      text: "",
      // cell lower-left
      x: 0,
      y: 0
    }

    for (let item of content.items) {
      if (item.type === "beginMarkedContentProps") {
        cell = {
          text: "",
          // cell lower-left
          x: width,
          y: height
        }
      }
      else if (item.type === "endMarkedContent") {
        row.push(cell.text);
        prevCell = cell;
      }
      else {
        let x = item.transform[ 4 ];
        let y = item.transform[ 5 ];

        // determine if new row
        if (x < prevCell.x && y < prevCell.y) {
          if (row.length > 0) {
            if (!data.header)
              data.header = row;
            else {
              let obj = {};
              for (let i = 0; i < data.header.length; i++)
                obj[ data.header[ i ] ] = (i < row.length) ? row[ i ] : undefined;
              data.rows.push(obj);
            }
            row = [];
          }
        }

        // check cell bounding box
        if (x < cell.x) cell.x = x;
        if (y < cell.y) cell.y = y;

        // append text to cell
        if (item.height > 0)
          cell.text += item.str;
      }

    };

    // Release page resources.
    page.cleanup();
  }
  catch (err) {
    console.error("Error: " + err);
  }
};


(async () => {
  await getAsJson();
})();
