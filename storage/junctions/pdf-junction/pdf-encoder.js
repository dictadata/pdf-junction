/**
 * pdf/pdf-encoder
 *
 * Utility methods for fundamental type conversion and encoding/decoding.
 */
"use strict";

/**
 * Convert a pdf-junction fundamental data type to a dictadata storage type.
 * Returns an array with [storageType,size]
 */
var storageType = exports.storageType = function (pdfType) {
  let rstype = '';
  let rssize = '';

  // format is usually "name(size)" e.g. "int(11)"
  let found = false;
  for (let i = 0; i < pdfType.length; i++) {
    if (pdfType[ i ] === '(')
      found = true;
    else if (pdfType[ i ] === ')')
      break;
    else if (!found)
      rstype += pdfType[ i ];
    else
      rssize += pdfType[ i ];
  }

  let size = parseInt(rssize);

  // convert to storage type
  let fldType = 'undefined';
  switch (rstype.toUpperCase()) {
    case 'SMALLINT':
    case 'INT2':
    case 'INTEGER':
    case 'INT':
    case 'INT4':
      fldType = 'integer';
      break;

    case 'REAL':
    case 'FLOAT4':
    case 'DOUBLE PRECISION':
    case 'FLOAT':
    case 'FLOAT8':
      fldType = 'float';
      break;

    case 'BOOLEAN':
    case 'BOOL':
      fldType = 'boolean';
      break;

    case 'CHAR':
    case 'CHARACTER':
    case 'NCHAR':
    case 'BPCHAR':
    case 'VARCHAR':
    case 'CHARACTER VARYING':
    case 'NVARCHAR':
    case 'TEXT':
    case 'DECIMAL':  // odd balls
    case 'NUMERIC':
    case 'BIGINT':
    case 'INT8':
      fldType = 'text';
      break;

    case 'DATE':
    case 'TIMESTAMP':
    case 'TIMESTAMP WITHOUT TIME ZONE':
    case 'TIMESTAMPTZ':
    case 'TIMESTAMP WITH TIME ZONE':
      fldType = 'date';
      break;

  }

  return [ fldType, size ];
};

/**
 * Convert a dictadata field's storage type to a pdf-junction fundamental data type.
 * Returns a pdf-junction fundamental data type.
 */
exports.pdfType = function (field) {
  let pdfType = "VARCHAR(32)";

  if (field._pdf) {
    pdfType = field._pdf.Type;
  }
  else {
    switch (field.type) {
      case "boolean":
        pdfType = "BOOL";
        break;
      case "integer":
        pdfType = "INT";
        break;
      case "float":
        pdfType = "FLOAT";
        break;
      case "keyword":
        pdfType = "VARCHAR(" + (field.size || 64) + ")";
        break;
      case "text":
        pdfType = "VARCHAR(" + (field.size || 1024) + ")";
        break;
      case "date":
        pdfType = "DATE";
        break;
    }
  }

  return pdfType;
};

/**
 * Convert a pdf-junction field|column|attribute to a dictadata storage field definition.
 * Returns a new datastore field object.
 */
exports.storageField = function (column) {

  let [ fldType, size ] = storageType(column.TYPE_NAME);

  let field = {
    name: column.COLUMN_NAME,
    type: fldType,
    size: size || column.COLUMN_SIZE,
    default: column.COLUMN_DEF || null,
    isNullable: column.NULLABLE || false,
    isKey: false,

    // add additional PdfJunction fields as _pdf_ meta data
    _pdf: {
      TYPE_NAME: column.TYPE_NAME,
      REMARKS: column.REMARKS
    }
  };

  return field;
};
