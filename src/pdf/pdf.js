import { PDFDocument } from 'pdf-lib'
import PdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";
import { getDocument as getPdfJsDocument, GlobalWorkerOptions } from 'pdfjs-dist'

GlobalWorkerOptions.workerSrc = PdfjsWorker;

export class ScaledPageViewer {
    constructor(pageViewer, scale) {
        if (undefined === scale) {
            throw "Scale must be defined"
        }
        this.pageViewer = pageViewer
        this.scale = scale
    }

    dimensions() {
        return this.pageViewer.viewportAtScale(this.scale).then((vp) =>
        ({
            height: vp.height,
            width: vp.width
        })
        )
    }

    render(params) {
        this.pageViewer.render(
            { 
                ...params,
                scale: this.scale
            }
        )
    }
}

export class ConstrainedPageViewer {
    constructor(pageViewer, maxDim) {
        this.pageViewer = pageViewer
        this.maxDim = maxDim
    }

    scaledPageViewer() {
        return this.scale().then((scale) =>
            new ScaledPageViewer(this.pageViewer, scale)
        )
    }

    scale() {
        return this.pageViewer.viewportAtScale(1).then((vp) => {
            return Math.max(1, Math.min(this.maxDim / vp.width, this.maxDim / vp.height))
        }
            )
    }

    dimensions() {
        return this.scaledPageViewer().then((scaledViewer) =>
            scaledViewer.dimensions()
        )
    }

    render(params) {
        this.scaledPageViewer().then((viewer) =>
            viewer.render(params)
        )
    }
}

class PageViewer {
    constructor(dataPromise) {
        this.pdfJsPage = dataPromise.then((data) =>
            getPdfJsDocument({ data: data }).promise
        )
            .then((viewerdoc) =>
                viewerdoc.getPage(1)
            ).then((page) =>
                page
            )
    }

    viewportAtScale(scale) {
        return this.pdfJsPage.then((page) => {
            return page.getViewport({ scale: scale })
        })
    }


    render(params) {
        if (params.scale) {
            if (! typeof params.scale == "number") {
                throw "scale must be a number"
            }
            if (!Number.isFinite(params.scale) || params.scale <= 0) {
                throw "scale must be sane"
            }
        }
        this.pdfJsPage.then((page) => {
            var vp = page.getViewport({ scale: params.scale || 1.0 })

            var context = params.canvas.getContext('2d');

            var context = {
                canvasContext: context,
                viewport: vp
            }

            page.render(context)
        })

    }
}


class PageDocument {
    constructor(docPromise) {
        this.docPromise = docPromise;
    }

    data() {
        return this.docPromise.then((doc) =>
            doc.saveAsBase64()
        ).then((data) =>
            atob(data)
        )
    }

    viewer() {
        return new PageViewer(this.data());
    }

    join(dest) {
        this.docPromise.then((doc) =>
            dest.copyPages(doc, [0]).then((page) => {
                dest.addPage(page[0])
                return dest
            })
        )
    }
}

class PageDocCollection {
    constructor() {
        this.pageDocs = []
    }

    map(fn) {
        return this.pageDocs.map(fn)
    }

    add(page) {
        this.pageDocs.push(page)
    }

    extend(pages) {
        this.pageDocs = this.pageDocs.concat(pages)
    }

    createDocument() {
        PDFDocument.create().then((dest) =>
            pages.forEach((page) =>
                page.join(dest)
            )
        )
    }
}

export function collectPageDocuments(arrBuf) {
    return extractPageDocuments(arrBuf).then((d) => {

        var collection = new PageDocCollection()
        collection.extend(d)
        return collection
    })
}


export function extractPageDocuments(arrBuf) {
    return PDFDocument.load(arrBuf).then((src) => {
        const indices = src.getPageIndices()

        return indices.map((idx) =>
            extractPageDocument(src, idx)
        )
    })
}

export function extractPageDocument(src, idx) {
    return new PageDocument(
        PDFDocument.create().then((dest) =>
            dest.copyPages(src, [idx]).then((page) => {
                dest.addPage(page[0])
                return dest
            })
        )
    )
}

