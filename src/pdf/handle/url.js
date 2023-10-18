import { Document } from "../document"
import { Page } from "../page";

import { PDFDocument } from 'pdf-lib'

export class UrlFileHandle {
  constructor(url) { 
    this.url = url
  }
  
  get path() {
    return this.url;
  }

  get document() {
    return fetch(this.url).then((pdf) =>
        pdf.arrayBuffer()
    ).then((arrBuf) =>
        Document.fromArrBuf(arrBuf)
    )
  }
}