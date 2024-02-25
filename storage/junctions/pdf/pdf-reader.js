/**
 * pdf-junction/pdf-reader
 */
"use strict";

const { StorageReader } = require('@dictadata/storage-junctions');
const { PdfDataReader, RowAsObjects } = require('@dictadata/pdf-data-parser');
const { logger } = require('@dictadata/storage-junctions/utils');
const { pipeline } = require('node:stream/promises');

module.exports = class PDFReader extends StorageReader {

  /**
   *
   * @param {*} storageJunction
   * @param {*} options
   */
  constructor(storageJunction, options = null) {
    super(storageJunction, options);

    let pdfOptions = {
      url: this.junction.smt.locus + this.junction.smt.schema
    };
    if (options.heading) pdfOptions.heading = options.heading;
    if (options.cells) pdfOptions.cells = options.cells;
    if (options.newlines) pdfOptions.newlines = options.newlines;
    if (options.artifacts) pdfOptions.artifacts = options.artifacts;
    if (options.pageHeader) pdfOptions.pageHeader = options.pageHeader;
    if (options.pageFooter) pdfOptions.pageFooter = options.pageFooter;
    if (options.repeatingHeaders) pdfOptions.repeatingHeaders = options.repeatingHeaders;
    if (options.lineHeight) pdfOptions.lineHeight = options.lineHeight;
    if (options.headers) pdfOptions.headers = options.headers;

    let pdfReader = this.pdfReader = new PdfDataReader(pdfOptions);
    let rowAsObjects = this.rowAsObjects = new RowAsObjects(pdfOptions);

    var encoder = this.junction.createEncoder(options);

    var reader = this;
    this.started = false;

    // eslint-disable-next-line arrow-parens
    rowAsObjects.on('data', (construct) => {
      if (construct) {
        //let construct = this.rowAsObject(data);
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

    rowAsObjects.on('end', () => {
      reader.push(null);
    });

    rowAsObjects.on('error', function (err) {
      //logger.error(err);
      throw err;
    });

  }

  /*
  async _construct(callback) {
    logger.debug("PDFReader._construct");

    try {
      try {
        // initialize
      }
      catch (err) {
        logger.warn(`PDFReader read error: ${err.message}`);
        this.destroy(err);
      }

      callback();
    }
    catch (err) {
      logger.warn(err);
      callback(new Error('PDFReader construct error'));
    }
  }
  */

  /**
   * Fetch data from the underlying resource.
   * @param {*} size <number> Number of bytes to read asynchronously
   */
  async _read(size) {
    logger.debug('PDFReader._read');

    // read up to size constructs
    try {
      if (!this.started) {
        this.started = true;
        this.pdfReader.pipe(this.rowAsObjects);
      }
    }
    catch (err) {
      logger.error(err.message);
      this.push(null);
    }

  }

};
