import { Collection } from "../virtual/collection";
import { Page } from "../virtual/page";

import { PDFDocument } from 'pdf-lib'

export class UrlFileHandle {
    constructor(url) { 
      this.url = url
    }
   
    get path() {
      return this.url;
    }
  
    get pageDocs() {
      return fetch(this.url).then((pdf) =>
          pdf.arrayBuffer()
      ).then((arrBuf) =>
          collectPageDocuments(arrBuf)
      )
    }
  
  }

  export function collectPageDocuments (arrBuf) {
    return extractPageDocuments(arrBuf).then((d) => {
      const collection = new Collection()
      collection.extend(d)
      return collection
    })
  }
  
  export function extractPageDocuments (arrBuf) {
    return PDFDocument.load(arrBuf).then((src) => {
      const indices = src.getPageIndices()
      return indices.map((idx) =>
        extractPageDocument(src, idx)
      )
    })
  }
  
  export function extractPageDocument (src, idx) {
    return new Page(
      PDFDocument.create().then((dest) =>
        dest.copyPages(src, [idx]).then((page) => {
          dest.addPage(page[0])
          return dest
        })
      )
    )
  }