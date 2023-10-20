import { PDFDocument } from "pdf-lib";
import { Document as RDoc } from "../document";
import { maketargetcopier } from "../copier";

export class Collection {
  constructor(vdocs) {
    this.name = "new.pdf"
    this.arr = vdocs;
  }

  get docs() {
    return this.arr;
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

  *enumerate() {
      for (const [i, d] of this.arr.entries()) {
          yield {
              idx: i,
              doc: d 
          }
      } 
  }

  collect() {
    const docPromise = PDFDocument.create().then((doc) => {
      const pageCopierPromises = this.arr.map((vdoc, idx) => {
        const copier = maketargetcopier(doc, 0, idx);
        return vdoc.extract(copier)      
      });
      return Promise.all(pageCopierPromises).then(() => doc)
    }).then((doc) => doc);
    return new RDoc(docPromise);
  }
}
