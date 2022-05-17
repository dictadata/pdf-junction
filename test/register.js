/**
 * test/register
 */
"use strict";

const storage = require("@dictadata/storage-junctions");
const { logger } = require("@dictadata/storage-junctions/utils");

const PdfJunction = require("../storage/junctions/pdf-junction");

logger.info("--- adding PdfJunction to storage cortex");
storage.use("pdf", PdfJunction);
