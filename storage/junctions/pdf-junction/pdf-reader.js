/**
 * pdf-junction/pdf-reader
 */
"use strict";

const { StorageReader } = require('@dictadata/storage-junctions');
const { logger } = require('@dictadata/storage-junctions/utils');
const pdfDataParser = require('./pdf-data-parser');

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
    }

    this.started = false;
    let parser = this.parser = new pdfDataParser(pdfOptions);
    var reader = this;

    // eslint-disable-next-line arrow-parens
    parser.on('data', (data) => {
      if (data.value) {
        let construct = encoder.cast(data.value);
        construct = encoder.filter(construct);
        construct = encoder.select(construct);
        //logger.debug(JSON.stringify(construct));

        if (construct && !reader.push(construct)) {
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
        this.parser.parsePDF();
      }
    }
    catch (err) {
      logger.error(err.message);
      this.push(null);
    }

  }

};
