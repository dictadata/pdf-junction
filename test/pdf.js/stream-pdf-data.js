/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/
*/
"use strict";

const pdfjsLib = require("../../lib/pdfjs-dist/build/pdf.js");
const fs = require("fs");
const { Readable } = require('stream');
const PdfReader = require("../../storage/junctions/pdf-junction/pdf-reader.js");
const { join } = require("path");


class StreamPdfData extends Readable {

  constructor(options) {
    let streamOptions = {
      objectMode: true,
      highWaterMark: 128,
      autoDestroy: false
    };
    super(streamOptions);

    this.options = options;
    this.doc;
    this.header;
  }

  /**
 * Fetch data from the underlying resource.
 * @param {*} size <number> Number of bytes to read asynchronously
 */
  async _read(size) {
    console.log('StreamPdfData._read');

    // read up to size constructs
    try {
      await this.parsePDF();
      // when done reading from source
      this.push(null);
    }
    catch (err) {
      console.error(err.message);
      this.push(null);
    }

  }

  async parsePDF() {
    try {
      var loadingTask = pdfjsLib.getDocument({
        url: this.options.url
      });
      this.doc = await loadingTask.promise;

      const numPages = this.doc.numPages;
      console.log("# Document Loaded");

      let docdata = await this.doc.getMetadata();
      console.log("# Metadata Loaded");
      console.log(docdata.info.title);

      let markInfo = await this.doc.getMarkInfo();
      console.log("Marked = " + markInfo.Marked)

      for (let i = 1; i <= numPages; i++) {
        await this.parsePage(i);
      }

      console.log("# End of Document");
    }
    catch (err) {
      console.error("Error: " + err);
    }
  }

  async parsePage(pageNum) {
    try {
      let page = await this.doc.getPage(pageNum)
      console.log("# Page " + pageNum);

      const { width, height
      } = page.getViewport({
        scale: 1.0
      });
      console.log("Size: " + width + "x" + height);

      let content = await page.getTextContent({
        includeMarkedContent: true
      });
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
              this.push(row);
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

}

(async () => {
  const options = {
    url: process.argv[ 2 ] || "/var/data/us/census.gov/reference/ClassCodes.pdf"
  }
  let reader = new StreamPdfData(options);
  let writer = fs.createWriteStream("./content_stream.json");
  reader.pipe(writer);
})();
