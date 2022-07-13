import { PDFDocument } from 'pdf-lib'
import { getDocument as getPdfJsDocument } from 'pdfjs-dist'

class PageViewer {
    constructor(dataPromise) {
        this.pdfJsPage = dataPromise.then((data) => 
            getPdfJsDocument({data: data}).promise
        )
            .then((viewerdoc) => 
                viewerdoc.getPage(1)
            ).then((page) => 
                page
            )
    }

    render(context) {
        pdfJsPage.render(context)
    }

    scaledDims(scale) {
        return this.pdfJsPage.then((p) => {
            p.getViewport({scale: scale})
            return {
                height: dims.height,
                width: dims.width
            }
        })
    }

    scaleToMaxDim(maxDim) {
        return this.pdfJsPage.then((p) => {
            p.getViewport({scale: 1})
            return Math.max(1, Math.min(maxDim/dims.width, maxDim/dim.height))
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

