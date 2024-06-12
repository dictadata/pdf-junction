/**
 * pdf-junction/pdf-reader
 */
"use strict";

const { StorageReader } = require('@dictadata/storage-junctions');
const { PdfDataReader, RowAsObjectTransform, RepeatCellTransform, RepeatHeadingTransform } = require('pdf-data-parser');
const { StorageError } = require('@dictadata/storage-junctions/types');
const { logger } = require("@dictadata/lib");
const { pipeline } = require('node:stream/promises');

module.exports = class PDFReader extends StorageReader {

  /**
   *
   * @param {object}   junction - parent StorageJunction
   * @param {object}   options
   * @param {number[]} [options.pages] - array of page numbers to process, if undefined defaults to all pages
   * @param {string}   [options.heading] - PDF section heading or text before data table, default: none
   * @param {string}   [options.stopHeading] - PDF section heading or text after data table, default: none
   * @param {number}   [options.cells] - minimum number of cells in a tabular data, default: 1
   * @param {boolean}  [options.newlines] - preserve new lines in cell data, default: false
   * @param {boolean}  [options.artifacts] - parse artifacts content, default: false
   * @param {number}   [options.pageHeader] - height of page header area in points, default: 0
   * @param {number}   [options.pageFooter] - height of page footer area in points, default: 0
   * @param {boolean}  [options.repeating] - indicates if table headers are repeated on each page, default: false
   * @param {number}   [options.lineHeight] - approximate line height ratio based on font size; default 1.67
   * @param {boolean}  [options.orderXY] - order cells by XY coordinates on page; default true
   * @param {string[]} [options.headers] - RowAsObject: array of column names for data, default none, first table row contains names.
   * @param {number}   [options.column] - RepeatCellTransform: column index of cell to repeat, default 0
   * @param {string}   [options.header] - RepeatHeadingTransform: column name for the repeating heading field, default "heading:0"
   */
  constructor(junction, options) {
    super(junction, options);

    this.options.url = this.junction.smt.locus + this.junction.smt.schema;

    this.pipes = [];
  }

  async _construct(callback) {
    logger.debug("PDFReader._construct");

    try {
      let pdfReader = new PdfDataReader(this.options);
      this.pipes.push(pdfReader);

      if (Object.hasOwn( this.options,  "RepeatCell.column") || Object.hasOwn( this.options, "column")) {
        let transform = new RepeatCellTransform(this.options);
        this.pipes.push(transform);
      }

      if (Object.hasOwn( this.options, "RepeatHeading.header") || Object.hasOwn( this.options, "header")) {
        let transform = new RepeatHeadingTransform(this.options);
        this.pipes.push(transform);
      }

      let rowAsObjects = new RowAsObjectTransform(this.options);
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
        throw new StorageError(err);
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
