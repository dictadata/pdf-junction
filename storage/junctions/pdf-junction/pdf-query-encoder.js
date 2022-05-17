/**
 * pdf-junction/pdf-query-encoder
 *
 * Utility methods for creating requests and processing responses.
 */
"use strict";

const encoder = require('./pdf-encoder');


// examples of query generation

exports.createStatement = function (engram) {

  //* make create statement
  let stmt = "CREATE " + engram.smt.schema;

  // loop through field definitions
  for (let [ name, field ] of Object.entries(engram.fields)) {
    //*
  }

  return stmt;
};

exports.insertStatement = function (engram, construct) {

  let names = Object.keys(construct);
  let values = Object.values(construct);

  //* make insert statement
  let stmt = "INSERT " + engram.smt.schema;

  return stmt;
};

/**
 * pattern: {
 *   match: {fieldname: value, ...},
 *   cues: {}
 * }
 */
exports.searchStatment = function (engram, pattern) {

  //* make search statement
  let stmt = "SELECT " + engram.smt.schema;

  for (let name in pattern.match) {
    let value = pattern.match[ name ];

  }

  return stmt;
};
