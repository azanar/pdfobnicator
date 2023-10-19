import { PDFDocument } from "pdf-lib";
import { Document as RDoc } from "../document";
import { makecopier } from "../copier";

export class Collection {
  constructor(vdocs) {
    this.arr = vdocs;
  }

  add(page, idx) {
    this.arr.splice(idx, 0, page);
  }

  remove(page) {
    var idx = this.arr.indexOf(page);
    if (idx == -1) {
      throw new Error("Page not found!");
    }
    this.arr.splice(idx, 1);
  }

  extend(pages) {
    this.arr = this.arr.concat(pages);
  }

  collect() {
    const docPromise = PDFDocument.create().then((doc) => {
      const pageCopierPromises = this.arr.map((vdoc, idx) => {
        const copier = makecopier(doc, 1, idx);
        return vdoc.extract(copier)      
      });
      return Promise.all(pageCopierPromises).then(() => doc)
    }).then((doc) => doc);
    return new RDoc(docPromise);
  }
}
