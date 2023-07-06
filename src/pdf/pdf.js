import { PDFDocument } from 'pdf-lib'
import * as pdfLib from 'pdf-lib'


import PdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry'
import { getDocument as getPdfJsDocument, GlobalWorkerOptions } from 'pdfjs-dist'

GlobalWorkerOptions.workerSrc = PdfjsWorker

export class ScaledPageViewer {
  constructor (pageViewer, scale) {
    if (undefined === scale) {
      throw 'Scale must be defined'
    }
    this.pageViewer = pageViewer
    this.scale = scale
  }

  get dimensions () {
    return this.pageViewer.viewportAtScale(this.scale).then((vp) =>
      ({
        height: vp.height,
        width: vp.width
      })
    )
  }

  rotate (degrees) {
    this.pageViewer.rotate(degrees)
  }

  render (params) {
    this.pageViewer.render(
      {
        ...params,
        scale: this.scale
      }
    )
  }
}

export class ConstrainedPageViewer {
  constructor (pageViewer, maxDim) {
    this.pageViewer = pageViewer
    this.maxDim = maxDim
  }

  get scale () {
    return this.pageViewer.viewportAtScale(1).then((vp) => {
      return Math.max(1, Math.min(this.maxDim / vp.width, this.maxDim / vp.height))
    }
    )
  }

  get scaledPageViewer () {
    return this.scale.then((scale) =>
      new ScaledPageViewer(this.pageViewer, scale)
    )
  }

  rotate (degrees) {
    this.pageViewer.rotate(degrees)
  }

  get dimensions () {
    return this.scaledPageViewer.then((scaledViewer) =>
      scaledViewer.dimensions
    )
  }

  render (params) {
    this.scaledPageViewer.then((viewer) =>
      viewer.render(params)
    )
  }
}

class PageViewer {
  constructor (pageDoc) {
    this.pageDoc = pageDoc
  }

  viewportAtScale (scale) {
    return this.pageDoc.data.then((data) =>
      getPdfJsDocument({ data }).promise
    ).then((viewerdoc) =>
      viewerdoc.getPage(1)
    ).then((page) => {
      return page.getViewport({ scale })
    })
  }

  rotate (degrees) {
    this.pageDoc.rotate(degrees)
  }

  render (params) {
    if (params.scale) {
      if ((typeof params.scale) !== 'number') {
        throw 'scale must be a number'
      }
      if (!Number.isFinite(params.scale) || params.scale <= 0) {
        throw 'scale must be sane'
      }
    }

    this.pageDoc.data.then((data) =>
      getPdfJsDocument({ data }).promise
    ).then((viewerdoc) =>
      viewerdoc.getPage(1)
    ).then((page) => {
      const vp = page.getViewport({ scale: params.scale || 1.0 })

      var canvasContext = params.canvas.getContext('2d')

      var context = {
        canvasContext: canvasContext,
        viewport: vp
      }

      page.render(context)
    })
  }
}

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
    return collectPageDocuments(this.file.arrayBuffer()); 
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
