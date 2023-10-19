import fs from "fs";
import assert from "node:assert";

import { PDFDocument as pdflibDoc } from "pdf-lib";
import { Page } from "../../src/pdf/virtual/page.js";

describe("Virtual.Page", function () {
  context("there is a loaded document", function () {
    const data = fs.readFileSync("test/pdf/fixtures/two-page.pdf");
    const docPromise = pdflibDoc.load(data);
    const obj = new Page(docPromise);

    describe(".rotate()", function () {
      it("should rotate with a sane input", function (done) {
        obj.rotate(90).then(() => {
          return docPromise
            .then((doc) => {
              return doc.getPage(0);
            })
            .then((page) => {
              assert(page.getRotation().angle === 90);
              done();
            });
        }, done);
      });
    });
  });
});
