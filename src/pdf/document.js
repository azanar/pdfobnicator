import { PDFDocument } from "pdf-lib";
import { makesrccopier } from "./copier";
import { Collection } from "./virtual/collection";
import { Document as VDoc } from "./virtual/document";

export class Document {
  constructor(docPromise) {
    if (!docPromise) {
      throw Error("WTF");
    }
    this.docPromise = docPromise;
  }

  static fromArrBuf(arrBuf) {
    return new Document(PDFDocument.load(arrBuf))
  }

  get data() {
    return this.docPromise
      .then((doc) => {
        return doc.saveAsBase64();
      })
      .then((data) => atob(data));
  }

  extract() {
    return this.docPromise.then(
      (doc) =>
        new Collection(
          doc.getPageIndices().map((idx) => {
            console.log(idx);
            const copier = makesrccopier(doc, idx, 0)
            return new VDoc.fromReal(copier);
          })
        )
    );
  }
}
