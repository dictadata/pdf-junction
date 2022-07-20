/**
 * pdf-junction/pdf-reader
 */
"use strict";

const { StorageReader } = require('@dictadata/storage-junctions');
const { logger } = require('@dictadata/storage-junctions/utils');
const { PdfDataParser } = require('pdf-data-parser');

module.exports = class PdfReader extends StorageReader {

  /**
   *
   * @param {*} storageJunction
   * @param {*} options
   */
  constructor(storageJunction, options = null) {
    super(storageJunction, options);

    var encoder = this.junction.createEncoder(options);

    let pdfOptions = {
      url: this.junction.smt.locus
    };
    if (options.heading) pdfOptions.heading = options.heading;
    if (options.columns) pdfOptions.columns = options.columns;
    if (options.newlines) pdfOptions.newlines = options.newlines;
    if (options.artifacts) pdfOptions.artifacts = options.artifacts;
    if (options.pageHeader) pdfOptions.pageHeader = options.pageHeader;
    if (options.pageFooter) pdfOptions.pageFooter = options.pageFooter;
    if (options.repeatingHeaders) pdfOptions.repeatingHeaders = options.repeatingHeaders;
    if (options.lineHeight) pdfOptions.lineHeight = options.lineHeight;

    this.headers = options.headers || undefined;

    this.started = false;
    let parser = this.parser = new PdfDataParser(pdfOptions);
    var reader = this;

    // eslint-disable-next-line arrow-parens
    parser.on('data', (data) => {
      if (data) {
        let construct = this.rowAsObject(data);
        construct = encoder.cast(construct);
        construct = encoder.filter(construct);
        construct = encoder.select(construct);
        //logger.debug(JSON.stringify(construct));

        if (construct) {
          reader.push(construct);
          //parser.pause();  // If push() returns false stop reading from source.
        }
      }

    });

    parser.on('end', () => {
      reader.push(null);
    });

    parser.on('error', function (err) {
      //logger.error(err);
      throw err;
    });

  }

  rowAsObject(row) {
    if (!this.headers) {
      this.headers = row;
    }
    else {
      let obj = {};
      for (let i = 0; i < row.length; i++) {
        let prop = (i < this.headers.length) ? this.headers[ i ] : i;
        obj[ prop ] = row[ i ];
      }
      this.push(obj);
    }
  }

  /**
   * Fetch data from the underlying resource.
   * @param {*} size <number> Number of bytes to read asynchronously
   */
  async _read(size) {
    logger.debug('PdfReader._read');

    // read up to size constructs
    try {
      if (!this.started) {
        this.started = true;
        this.parser.parse();
      }
    }
    catch (err) {
      logger.error(err.message);
      this.push(null);
    }

  }

};
