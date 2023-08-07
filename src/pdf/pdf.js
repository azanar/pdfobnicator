import { PDFDocument } from 'pdf-lib'
import * as pdfLib from 'pdf-lib'
import { PageViewer} from './viewer'

export class PageDocument {
  constructor (docPromise) {
    this.docPromise = docPromise
  }

  get data () {
    return this.docPromise.then((doc) =>
      doc.saveAsBase64()
    ).then((data) =>
      atob(data)
    )
  }

  rotate (degrees) {
    return this.docPromise.then((doc) =>
      doc.getPage(0)
    ).then((page) => {
      const rot = page.getRotation().angle

      const newRot = (rot + degrees) % 360

      const normalizedRot = newRot >= 0 ? newRot : newRot + 360

      console.log(`rotating ${degrees}`)

      page.setRotation(pdfLib.degrees(normalizedRot))
    })
  }

  get viewer () {
    return new PageViewer(this)
  }

  join (dest) {
    this.docPromise.then((doc) =>
      dest.copyPages(doc, [0]).then((page) => {
        dest.addPage(page[0])
        return dest
      })
    )
  }
}

export class PageDocCollection {
  constructor () {
    this.pageDocs = []
  }

  map (fn) {
    return this.pageDocs.map(fn)
  }

  add (page) {
    this.pageDocs.push(page)
  }

  extend (pages) {
    this.pageDocs = this.pageDocs.concat(pages)
  }
}

export class LocalFileHandle {
  constructor() { 
    this.file = document.getElementById('file-selector').files[0]
  }
 
  get path() {
    return this.file.name;
  }

  get pageDocs() {
    return this.file.arrayBuffer().then((arrBuf) =>
      collectPageDocuments(arrBuf)
    )
  }
}

export class NewFileHandle {
  get path() {
    return "new.pdf";
  }

  get pageDocs() {
    return new PageDocCollection()
  }
}

export function loader()

export function collectPageDocuments (arrBuf) {
  return extractPageDocuments(arrBuf).then((d) => {
    const collection = new PageDocCollection()
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
  return new PageDocument(
    PDFDocument.create().then((dest) =>
      dest.copyPages(src, [idx]).then((page) => {
        dest.addPage(page[0])
        return dest
      })
    )
  )
}
