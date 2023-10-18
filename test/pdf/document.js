import fs from "fs";
import assert from "node:assert";

import * as pdfjsLib from "pdfjs-dist";

import { PDFDocument as pdflibDoc } from "pdf-lib";
import { Document } from "../../src/pdf/document.js";

describe("PDF.Document", function () {
  context("there is a loaded document", function () {
    const data = fs.readFileSync("test/pdf/fixtures/two-page.pdf");
    const docPromise = pdflibDoc.load(data);
    const doc = new Document(docPromise);

    describe(".extract()", function () {
      it("should extract two virtual documents into a collection", function (done) {
        doc
          .extract()
          .then((res) => {
            const verifiers = res.arr.map((r, idx) => {
              const page = idx + 1
              return r.data
                .then((data) => pdfjsLib.getDocument({ data: data }).promise)
                .then((doc) => {
                  assert(doc.numPages == 1);
                  return doc.getPage(1);
                })
                .then((page) => page.getTextContent())
                .then((texts) => {
                  assert.equal(texts.items.length, 1);
                  assert.equal(texts.items[0].str, `Page ${page}`);
                });
            });

            return Promise.all(verifiers);
          })
          .then(() => done(), done);
      });
    });
  });
});
