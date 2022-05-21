/**
 * storage/junctions/pdf
 */
"use strict";

const { StorageJunction, Engram, StorageResponse, StorageError } = require('@dictadata/storage-junctions');
const { logger } = require('@dictadata/storage-junctions/utils');

const PdfReader = require("./pdf-reader");
const PdfWriter = require("./pdf-writer");
//const encoder = require("./pdf-encoder");


module.exports = class PdfJunction extends StorageJunction {

  /**
   *
   * @param {*} SMT 'pdf|connection string|schema name|key' or an Engram object
   * @param {*} options
   */
  constructor(SMT, options = null) {
    super(SMT, options);
    logger.debug("PdfJunction");

    this._readerClass = PdfReader;
    this._writerClass = PdfWriter;
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
   *  Get the encoding for the storage node.
   *  Possibly make a call to the source to acquire the encoding definitions.
   */
  async getEncoding() {
    logger.debug("pdf getEncoding");

    try {
      //* fetch encoding form storage source

      // add/update storage fields
      //* loop through source data definition
      {
        //* determine source field
        let srcField = {};

        // convert to dictadata storage field
        let field = srcField;  //encoder.storageField(srcField);

        // add/update engram
        this.engram.add(field);
      }

      return this.engram;
    }
    catch (err) {
      //* translate source errors as needed
      logger.error(err.message);
      throw err;
    }
  }

  /**
   * Sets the encoding for the storage node.
   * Possibly sending the encoding definitions to the source.
   * @param {*} encoding
   */
  async createSchema(encoding) {
    logger.debug("pdf createSchema");

    try {
      // check if entity already exists at source, if applicable

      // make a copy of the engram encoding
      let engram = new Engram(this.engram);
      engram.replace(encoding);

      //* update the source, if applicable

      // if successful, update the instance's internal engram
      this.engram.replace(encoding);

      // return the updated engram
      return this.engram;
    }
    catch (err) {
      //* translate source errors as needed
      logger.error(err.message);
      throw err;
    }
  }

  /**
   *
   * @param {*} construct the object to store
   * @param {*} pattern Should contain a meta key used to identify the construct
   *                     If null will insert a new construct into the source
   */
  async store(construct, pattern) {
    logger.debug("pdf store");

    if (this.engram.keyof === 'uid' || this.engram.keyof === 'key')
      throw new StorageError({ statusCode: 400 }, "unique keys not supported");
    if (typeof construct !== "object")
      throw new StorageError({ statusCode: 400 }, "Invalid parameter: construct is not an object");

    try {
      if (Object.keys(this.engram.fields).length == 0)
        await this.getEncoding();

      // update the source
      //
      let results = 0;

      // return status of source insertion
      return new StorageResponse((results > 0) ? "ok" : "not stored", null, null, results);
    }
    catch (err) {
      //* translate source errors as needed
      logger.error(err.message);
      throw err;
    }
  }

  /**
   * @param {*} pattern Should contain a meta key used to identify the construct.
   */
  async recall(pattern) {
    logger.debug("pdf recall");

    if (this.engram.keyof === 'uid' || this.engram.keyof === 'key')
      throw new StorageError({ statusCode: 400 }, "unique keys not supported");

    try {
      if (Object.keys(this.engram.fields).length == 0)
        await this.getEncoding();

      // create query
      // update source
      //
      let results = 0;

      return new StorageResponse((results > 0) ? "ok" : "not found", rows[ 0 ]);
    }
    catch (err) {
      //* translate source errors as needed
      logger.error(err.message);
      throw err;
    }
  }

  /**
   * @param {*} pattern can contain match, fields, .etc used to select constructs
   */
  async retrieve(pattern) {
    logger.debug("pdf retrieve");

    try {
      if (Object.keys(this.engram.fields).length == 0)
        await this.getEncoding();

      //* create query
      //*
      let results = 0;

      return new StorageResponse((results > 0) ? "retreived" : "not found", rows);
    }
    catch (err) {
      //* translate source errors as needed
      logger.error(err.message);
      throw err;
    }
  }

  /**
   * pattern can contain a meta key OR a match
   */
  async dull(pattern) {
    logger.debug("pdf dull");

    if (this.engram.keyof === 'uid' || this.engram.keyof === 'key')
      throw new StorageError({ statusCode: 400 }, "unique keys not supported");

    try {
      if (Object.keys(this.engram.fields).length == 0)
        await this.getEncoding();

      let results = null;
      if (this.engram.keyof === 'list' || this.engram.keyof === 'all') {
        // delete construct by ID
        //* create query
        //* update source
        results = 0;
      }
      else {
        // delete all constructs in the .schema
        //* create query
        //* update source
        results = 0;
      }

      return new StorageResponse((results.count > 0) ? "ok" : "not found", null, null, results);
    }
    catch (err) {
      //* translate source errors as needed
      logger.error(err.message);
      throw err;
    }
  }

};
