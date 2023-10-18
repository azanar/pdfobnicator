import { PDFDocument } from "pdf-lib";
import { Page } from "../page";

export class Document {
  constructor(copier) {
    this.docPromise = PDFDocument.create().then((doc) =>
      copier(doc)
        .then((page) => doc.addPage(page))
        .then(() => doc)
    );
  }

  get data() {
    return this.docPromise
      .then((doc) => doc.saveAsBase64())
      .then((data) => atob(data));
  }

  get page() {
    return new Page(this.docPromise);
  }
}
