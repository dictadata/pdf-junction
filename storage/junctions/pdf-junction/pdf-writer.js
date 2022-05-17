/**
 * pdf-junction/pdf-writer
 */
"use strict";

const { StorageWriter, StorageError } = require('@dictadata/storage-junctions');
const { logger } = require('@dictadata/storage-junctions/utils');

module.exports = class PdfWriter extends StorageWriter {

  /**
   *
   * @param {*} storageJunction
   * @param {*} options
   */
  constructor(storageJunction, options = null) {
    super(storageJunction, options);

  }

  async _write(construct, encoding, callback) {
    logger.debug("PdfWriter._write");
    logger.debug(JSON.stringify(construct));
    // check for empty construct
    if (construct.constructor !== Object || Object.keys(construct).length === 0) {
      callback();
      return;
    }

    try {
      // save construct to .schema
      await this.junction.store(construct);

      callback();
    }
    catch (err) {
      logger.error(err.message);
      callback(err);
    }

  }

  async _writev(chunks, callback) {
    logger.debug("PdfWriter._writev");

    try {
      for (var i = 0; i < chunks.length; i++) {
        let construct = chunks[ i ].chunk;
        let encoding = chunks[ i ].encoding;

        // save construct to .schema
        await this._write(construct, encoding, () => { });
      }
      callback();
    }
    catch (err) {
      logger.error(err);
      callback(new StorageError({ statusCode: 500, _error: err }, 'Error storing construct'));
    }
  }

  _final(callback) {
    logger.debug("PdfWriter._final");

    try {
      // close connection, cleanup resources, ...
    }
    catch (err) {
      logger.error(err.message);
      callback(new StorageError({ statusCode: 500, _error: err }, 'Error storing construct'));
    }
    callback();
  }

};
