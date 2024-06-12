/**
 * storage/junctions/pdf
 */
"use strict";

const { StorageJunction } = require('@dictadata/storage-junctions');
const { StorageResults } = require('@dictadata/storage-junctions/types');
const { logger } = require("@dictadata/lib");

const PdfReader = require("./pdf-reader");
//const PdfWriter = require("./pdf-writer");
//const encoder = require("./pdf-encoder");

const stream = require("stream/promises");


module.exports = class PdfJunction extends StorageJunction {

  // storage capabilities, sub-class must override
  capabilities = {
    filesystem: false, // storage source is filesystem
    sql: false,        // storage source is SQL
    keystore: false,   // supports key-value storage

    encoding: false,   // get encoding from source
    reader: true,      // stream reader
    writer: false,     // stream writer
    store: false,      // store/recall individual constructs
    query: false,      // select/filter data at source
    aggregate: false   // aggregate data at source
  }

  /**
   *
   * @param {string|object} SMT "pdf|url path|document filename|*", SMT or Engram object.
   * @param {object} options passed to pdf-data-parser.
   */
  constructor(SMT, options = null) {
    super(SMT, options);
    logger.debug("PdfJunction");

    this._readerClass = PdfReader;
    //this._writerClass = PdfWriter;
  }

  /**
   * override to initialize junction
   */
  async activate() {
    this.isActive = true;

    //* acquire any resources
  }

  /**
   * override to release resources
   */
  async relax() {
    logger.debug("pdf relax");

    //* release any resources

  }

  /**
   *
   * @param {*} pattern
   */
  async retrieve(pattern) {
    let response = new StorageResults("list");
    let rs = this.createReader(pattern);

    rs.on('data', (chunk) => {
      response.add(chunk);
    })
    rs.on('end', () => {
      console.log('There will be no more data.');
    });
    rs.on('error', (err) => {
      response = this.StorageError(err);
    });

    await stream.finished(rs);

    return response;
  }

};
