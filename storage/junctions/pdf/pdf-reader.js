/**
 * pdf-junction/pdf-reader
 */
"use strict";

const { StorageReader } = require('@dictadata/storage-junctions');
const { PdfDataReader, RowAsObjectTransform, RepeatCellTransform, RepeatHeadingTransform } = require('@dictadata/pdf-data-parser');
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

    let pdfOptions = this.pdfOptions = {
      url: this.junction.smt.locus + this.junction.smt.schema
    };
    if (Object.hasOwn(options, "pages")) pdfOptions.pages = options.pages;
    if (Object.hasOwn(options, "heading")) pdfOptions.heading = options.heading;
    if (Object.hasOwn(options, "cells")) pdfOptions.cells = options.cells;
    if (Object.hasOwn(options, "newlines")) pdfOptions.newlines = options.newlines;
    if (Object.hasOwn(options, "artifacts")) pdfOptions.artifacts = options.artifacts;
    if (Object.hasOwn(options, "pageHeader")) pdfOptions.pageHeader = options.pageHeader;
    if (Object.hasOwn(options, "pageFooter")) pdfOptions.pageFooter = options.pageFooter;
    if (Object.hasOwn(options, "repeatingHeaders")) pdfOptions.repeatingHeaders = options.repeatingHeaders;
    if (Object.hasOwn(options, "lineHeight")) pdfOptions.lineHeight = options.lineHeight;
    if (Object.hasOwn(options, "orderXY")) pdfOptions.orderXY = options.orderXY;

    if (Object.hasOwn(options, "headers")) pdfOptions.headers = options.headers;
    if (Object.hasOwn(options, "RowAsObject.headers")) pdfOptions.headers = options[ "RowAsObject.headers" ];

    if (Object.hasOwn(options, "column")) pdfOptions.column = options.column;
    if (Object.hasOwn(options, "RepeatCell.column")) pdfOptions.column = options[ "RepeatCell.column" ];

    if (Object.hasOwn(options, "header")) pdfOptions.header = options.header;
    if (Object.hasOwn(options, "RepeatHeading.header")) pdfOptions.header = options[ "RepeatHeading.header" ];

  }

  async _construct(callback) {
    logger.debug("PDFReader._construct");

    this.pipes = [];

    try {
      let pdfReader = new PdfDataReader(this.pdfOptions);
      this.pipes.push(pdfReader);

      if (Object.hasOwn( this.pdfOptions,  "RepeatCell.column") || Object.hasOwn( this.pdfOptions, "column")) {
        let transform = new RepeatCellTransform(this.pdfOptions);
        pipes.push(transform);
      }

      if (Object.hasOwn( this.pdfOptions, "RepeatHeading.header") || Object.hasOwn( this.pdfOptions, "header")) {
        let transform = new RepeatHeadingTransform(this.pdfOptions);
        pipes.push(transform);
      }

      let rowAsObjects = new RowAsObjectTransform(this.pdfOptions);
      this.pipes.push(rowAsObjects);

      var encoder = this.junction.createEncoder(this.options);

      var reader = this;
      this.started = false;

      // eslint-disable-next-line arrow-parens
      rowAsObjects.on('data', (construct) => {
        if (construct) {
          // use junction's encoder functions
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
    catch (err) {
      logger.warn(err);
      this.destroy(this.junction.StorageError(err));
    }

    callback();
  }

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
        pipeline(this.pipes);
      }
    }
    catch (err) {
      logger.error(err.message);
      this.push(null);
    }

  }

};
