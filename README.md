# pdf-junction 0.9.x

Storage Junction plugin for reading tabular data in PDF documents.  Pdf-junction is a storage plugin for use with [_@dictadata/storage-junctions_](https://github.com/dictadata/storage-junctions) and related projects [_@dictadata/storage-etl_](https://github.com/dictadata/storage-etl) Command Line Interface (CLI) and [_@dictadata/storage-node_](https://github.com/dictadata/storage-node) API Server.

The plugin uses the [pdf-data-parser](https://gitlab.com/drewlab/pdf-data-parser) module to parse the PDF documents.

## Installation

```bash
npm install @dictadata/storage-junctions @dictadata/pdf-junction
```

## Plugin Initialization

Import the _Storage Junctions_ library and the _PDF Junction_ plugin.  Then register _PDF Junction_ with the _Storage Junctions_' `Cortex`. This will register _PDF Junction_ for use with storage model `"pdf"`.

```javascript
const storage = require("@dictadata/storage-junctions");
const PdfJunction = require("@dictadata/pdf-junction");

storage.use("pdf", PdfJunction);
```

## Creating an instance of PDFJunction

Create an instance of `PDFJunction` class.

```javascript
let junction = storage.Activate(smt, options);
```

### SMT

`PdfJunction` constructor takes an SMT, Storage Memory Trace, with the address of the data source. SMT can be a string or object. The string format is `"model|locus|schema|key"` which for PDFJunction is `"pdf|url or local path|document filename|*"`.

```javascript
// SMT string
let smt = "pdf|./path/|mydoc.pdf|*"

// SMT object
let SMT = {
  model: "pdf",
  locus: "http://server.org/path/",
  schema: "mydoc.pdf",
  key: "*" // all rows
}
```

### PdfJunction Options

`PdfJunction` constructor takes an options object with the following fields.

`{string|regexp} heading` - Section heading in the document after which the parser will look for tabular data; optional, default: none. The parser does a string comparison or match looking for first occurrence of `heading` value in the first cell of rows, row[0]. If not specified then data output starts with first row of the document.

`{integer} cells` - Minimum number of cells in tabular data; optional, default: 1. After `heading` string is found parser will look for the first row that contains at least `cells` count of cells. The parser will output rows until it encounters a row with less than `cells` count of cells.

`{boolean} newlines` - Preserve new lines in cell data; optional, default: false. When false newlines will be replaced by spaces. Preserving newlines characters will keep the formatting of multiline text such as descriptions. Though, newlines are problematic for cells containing multiword identifiers and keywords that might be wrapped in the PDF text.

`{Boolean} artifacts` - Parse artifacts content, default: false. Artifacts content specifies objects on the page such as table/grid lines and headers/footers. Grid lines do not have text content, but headers and footers might. If page headers and footers show up in output try the pageHeader and pageFooter options.

`{Integer} pageHeader` - Height of page header area in points, default: 0. Content within this area of the page will not be included in output. Use about 16 points per line including blank lines.

`{Integer} pageFooter` - Height of page footer area in points, default: 0. Content within this area of the page will not be included in output. Use about 16 points per line including blank lines.

`{Boolean} repeatingHeaders` - Indicates if table headers are repeated on each page, default: false. The table headers will be compare to the first row on each subsequent page.  If found they will be removed from the output.

`{Integer} lineHeight` - Approximate line height ratio based on font size; default 1.67. The parser extracts font size from the pdf content. The line height ratio maybe used when comparing the position of content items on the page.

## Streaming Usage

The following example creates an instance of `PdfReader` and collects streamed data into an array. In this case the storage construct is an object representing a row of cells from the PDF document. `PdfReader` is derived from Node.js stream Readable. So the reader can be the source of any Node.js pipeline.

```javascript
  async retrieveData() {
    let response = [];

    let junction = storage.Activate(smt, options);
    let reader = junction.createReader();

    reader.on('data', (construct) => {
      response.push(construct);
    })
    rs.on('end', () => {
      console.log('End of data.');
    });
    rs.on('error', (err) => {
      console.error(err);
    });

    await stream.finished(reader);

    return response;
  }
```

## Using PdfJunction plugin with Storage-ETL (CLI)

`PdfJunction` can be used from the command line, batch file or task schedular via the Storage-ETL (etl) command line interface.

### Install Storage-ETL

Install Storage-ETL in NPM's global workspace. This will allow you to run from any folder using the command "storage-etl" or just "etl".

```bash
npm i -g @dictadata/storage-etl
```

### Storage_ETL CLI

The ETL app takes two parameters as shown below. See the [Storage-ETL](https://github.com/dictadata/storage-etl) documentation for full details.

```bash
etl [-t tractsFile] [tractName]
```

### ETL Tracts File

An ETL Tracts file is a JSON object describing the storage source and storage destination. Each top level property is a tract. For PDF files you will need to also specify the plugin.

```json
{
  "transfer": {
    "action": "transfer",
    "origin": {
      "smt": "pdf|./data/input/|foofile.pdf|*",
      "options": {
        "heading": "pdf section heading",
        "cells": 7,
        "repeatingHeaders": true
      }
    },
    "terminal": {
      "smt": "json|./data/output/|foofile.json|*"
    }
  },
  "plugins": {
    "junctions": {
      "dictadata/pdf-junction": [ "pdf" ]
    }
  }
}
```

## Examples

### Hello World

[HelloWorld.pdf](./data/input/pdf/helloworld.pdf) is a single page PDF document with the string "Hello, world!" positioned on the page. The parser output is one row with one cell.

Create an ETL tract file named mytracts.json with one tract name hello_world.

```json
{
  "hello_world": {
    "action": "transfer",
    "origin": {
      "smt": "pdf|./data/input/pdf/|helloworld.pdf|*",
    },
    "terminal": {
      "smt": "json|./data/output/pdf/|helloworld.json|*"
    }
  },
  "plugins": {
    "junctions": {
      "dictadata/pdf-junction": [ "pdf" ]
    }
  }
}
```

Run the ETL command.

```bash
etl -t mytracts.json hello_world
```

The output is save in file helloworld.json which contains the data rows from the pdf document.

```json
[
  { "Greeting": "Hello, world!" }
]
```

See the [pdf-data-parser](https://gitlab.com/drewlab/pdf-data-parser) project for more complex examples.
