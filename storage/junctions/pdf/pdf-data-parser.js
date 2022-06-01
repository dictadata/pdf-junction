/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

//
// Basic node example that prints document metadata and text content.
// Requires single file built version of PDF.js -- please run
// `gulp singlefile` before running the example.
//

const pdfjsLib = require("../../../lib/pdfjs-dist/build/pdf.js");
//pdfjsLib.GlobalWorkerOptions.workerSrc = '../../lib/pdfjs-dist/build/pdf.worker.js';

const EventEmitter = require('node:events');

const { logger } = require('@dictadata/storage-junctions/utils');

module.exports = exports = class PdfDataParser extends EventEmitter {

  constructor(options) {
    super();

    this.options = options;
    this.doc;
    this.header;
  }

  async parsePDF() {
    try {
      var loadingTask = pdfjsLib.getDocument({
        url: this.options.url
      });
      this.doc = await loadingTask.promise;

      const numPages = this.doc.numPages;
      logger.debug("# Document Loaded");

      let docdata = await this.doc.getMetadata();
      logger.debug("# Metadata Loaded");
      logger.debug(docdata.info.title);

      let markInfo = await this.doc.getMarkInfo();
      logger.debug("Marked = " + markInfo.Marked);

      for (let i = 1; i <= numPages; i++) {
        await this.parsePage(i);
      }

      this.emit("end");
      logger.debug("# End of Document");
    }
    catch (err) {
      logger.error("Error: " + err);
      this.emit("error", err);
    }
  }

  async parsePage(pageNum) {
    try {
      let page = await this.doc.getPage(pageNum);
      logger.debug("# Page " + pageNum);

      const { width, height } = page.getViewport({ scale: 1.0 });
      logger.debug("Size: " + width + "x" + height);

      let content = await page.getTextContent({
        includeMarkedContent: true
      });
      logger.debug("## Text Content");

      let row = [];
      let cell = {
        text: "",
        // cell lower-left
        x: width,
        y: height
      };
      let prevCell = {
        text: "",
        // cell lower-left
        x: 0,
        y: 0
      };

      for (let item of content.items) {
        if (item.type === "beginMarkedContent") {
          console.log(item.type + " " + item.tag);
        }
        else if (item.type === "beginMarkedContentProps") {
          if (item.tag === 'P') {
            cell = {
              text: "",
              // cell lower-left
              x: width,
              y: height
            };
          }
          else {
            console.log(item.type + " " + item.tag);
          }
        }
        else if (item.type === "endMarkedContent") {
          row.push(cell.text);
          prevCell = cell;
        }
        else if (item.type) {
          // do nothing
          console.log(item.type + " " + item.tag);
        }
        else {
          let x = item.transform[ 4 ];
          let y = item.transform[ 5 ];

          // determine if new row
          if (x < prevCell.x && y < prevCell.y) {
            if (row.length > 0) {
              if (!this.header)
                // header row
                this.header = row;
              else {
                // data row
                let obj = {};
                for (let i = 0; i < this.header.length; i++)
                  obj[ this.header[ i ] ] = (i < row.length) ? row[ i ] : undefined;
                this.emit("data", obj);
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
      }

      // Release page resources.
      page.cleanup();
    }
    catch (err) {
      logger.error("Error: " + err);
      this.emit("error", err);
    }
  }

};
