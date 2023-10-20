import fs from "fs";
import assert from "node:assert";

import * as pdfjsLib from "pdfjs-dist";

import { PDFDocument as pdflibDoc } from "pdf-lib";
import { Document } from "../../../src/pdf/virtual/document";
import { Collection } from "../../../src/pdf/virtual/collection";

describe("PDF.Virtual.Collection", function () {
  context("there is a loaded document", function () {
    const data = fs.readFileSync("test/pdf/fixtures/single-page.pdf");
    const collection = new Collection(
      [1, 2].map(() => {
        const docPromise = pdflibDoc.load(data);
        return new Document(docPromise);
      })
    );

    describe(".collect()", function () {
      it("should collect virtual documents into a real document", function (done) {
        collection
          .collect()
          .data.then((data) => {
            fs.writeFileSync("out.collect.pdf", data, "binary");
            return data;
          })
          .then((data) => pdfjsLib.getDocument({ data: data }).promise)
          .then((doc) => {
            assert.equal(doc.numPages, 2);
            const verifiers = [1, 2].map((label) =>
              doc
                .getPage(label)
                .then((page) => page.getTextContent())
                .then((texts) => {
                  assert.equal(texts.items.length, 1);
                  assert.equal(texts.items[0].str, `Page ${label}`);
                })
            );
            return Promise.all(verifiers);
          })
          .then(done, (e) => {
            console.log(e);
            done(e);
          });
      });
    });
  });
});
