/**
 * test/register
 */
"use strict";

const { Storage } = require("@dictadata/storage-junctions");
const { logger } = require("@dictadata/storage-junctions/utils");

const PdfJunction = require("../storage/junctions/pdf");

logger.info("--- adding PdfJunction to Storage classes");
Storage.Junctions.use("pdf", PdfJunction);
