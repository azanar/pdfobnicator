const { PDFDocument } = self.PDFLib

class PageDocument {
    constructor(docPromise) {
        this.docPromise = docPromise;
    }

    render(renderer) {
        this.docPromise.then((doc) => 
            doc.saveAsBase64()
        ).then((data) => 
            pdfjsLib.getDocument({data: atob(data)}).promise
        ).then((pdfjsDoc) => 
            pdfjsDoc.getPage(1)
        ).then((pdfjsPage) => 
            renderer.render(pdfjsPage)
        )
    }
}

class PDFPreviewCanvas {
    constructor(canvas) {
        this.canvas = canvas
    }

    render(pdfPage) {
        var scale = 1
        var viewport = pdfPage.getViewport({ scale: scale });

        const maxDim = 50;

        var outputScale;
        if (viewport.width > viewport.height) {
            outputScale = maxDim / viewport.width
        } else {
            outputScale = maxDim / viewport.height 
        }

        var canvas = this.canvas.get(0)

        var context = canvas.getContext('2d');

        canvas.width = Math.floor(viewport.width * outputScale);
        canvas.height = Math.floor(viewport.height * outputScale);
        canvas.style.width = Math.floor(viewport.width) + "px";
        canvas.style.height =  Math.floor(viewport.height) + "px";

        var transform = outputScale !== 1
            ? [outputScale, 0, 0, outputScale, 0, 0]
            : null;

        self.renderContext = {
            canvasContext: context,
            transform: transform,
            viewport: viewport
        };

        pdfPage.render(self.renderContext)
    }

    remove() {
        this.canvas.remove();
    }

}

class PDFCanvas {
    constructor(canvas) {
        this.canvas = canvas
    }

    render(pdfPage) {
        var scale = 1.5;
        // Support HiDPI-screens.
        var outputScale = window.devicePixelRatio || 1;

        var viewport = pdfPage.getViewport({ scale: scale, });

        var canvas = this.canvas.get(0)

        var context = canvas.getContext('2d');

        canvas.width = Math.floor(viewport.width * outputScale);
        canvas.height = Math.floor(viewport.height * outputScale);
        canvas.style.width = Math.floor(viewport.width) + "px";
        canvas.style.height =  Math.floor(viewport.height) + "px";

        var transform = outputScale !== 1
            ? [outputScale, 0, 0, outputScale, 0, 0]
            : null;

        self.renderContext = {
            canvasContext: context,
            transform: transform,
            viewport: viewport
        };

        pdfPage.render(self.renderContext)
    }
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

export function render(arrayBuffer, canvases) {
    extractPageDocuments(arrayBuffer).then((docs) => {
        docs.forEach((doc) => {
            var canvas = Zepto('<canvas draggable="true" class="pdf-preview"></canvas>')
            canvases.append(canvas.get(0))
            var renderer = new PDFPreviewCanvas(canvas);

            doc.render(renderer)
        })
    })
}


