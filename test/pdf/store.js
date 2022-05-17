/**
 * test/pdf/store
 */
"use strict";

require("../register");
const { logger } = require("@dictadata/storage-junctions/utils");
const { store } = require("@dictadata/storage-junctions/test");

logger.info("=== Test: pdf");

async function tests() {

  logger.info("=== pdf store 20");
  if (await store({
    origin: {
      smt: "pdf|connection string|foo_schema|=Foo",
      options: {
      }
    },
    construct: {
      Foo: 'twenty',
      Bar: 'Jackson',
      Baz: 20
    }
  })) return 1;

  logger.info("=== pdf store 30");
  if (await store({
    origin: {
      smt: "pdf|connection string|foo_schema|=Foo",
      options: {
      }
    },
    construct: {
      Foo: 'twenty',
      Bar: 'Jackson',
      Baz: 30,
      enabled: false
    }
  })) return 1;

  logger.info("=== pdf store 10");
  if (await store({
    origin: {
      smt: "pdf|connection string|foo_schema|=Foo",
      options: {
      }
    },
    construct: {
      Foo: 'ten',
      Bar: 'Hamilton',
      Baz: 10,
      enabled: false
    }
  })) return 1;

}

(async () => {
  await tests();
})();
