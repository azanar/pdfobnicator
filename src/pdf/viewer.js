
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

export class PageViewer {
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