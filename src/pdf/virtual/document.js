import { PDFDocument } from "pdf-lib";
import { Page } from "./page";

export class Document {
  constructor(docPromise) {
    if (!docPromise) {
      throw Error("WTF");
    }
    this.docPromise = docPromise;
  }

  static empty() {
    const docPromise = PDFDocument.create()
    return new Document(docPromise)

  }
  static fromReal(copier) {
    const docPromise = PDFDocument.create().then((doc) => {
        copier(doc)
        return doc
      });
    return new Document(docPromise);
  }

  get data() {
    return this.docPromise
      .then((doc) => {
        return doc.saveAsBase64();
      })
      .then((data) => atob(data));
  }

  get page() {
    return new Page(this.docPromise);
  }

  extract(copier) {
    return this.page.copy(copier);
  }
}
