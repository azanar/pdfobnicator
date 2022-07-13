import {createRef, render , Component } from 'inferno';

class PDFPageCollectionComponent extends Component {
    constructor(props) {
        super(props)
        this.props.children = props.collection.map((p) => 
            <PDFPreview pdf={p.viewer()} maxDim={150} />
        )
    }

    render() {
        return (
            <div>
                <ul draggable="true" class="pdf-list">
                    {this.props.children}
                </ul>
            </div>
        )
    }
}

class PDFCanvas extends Component {
    constructor(props) {
        super(props)
        this.canvasRef = createRef();
        this.state = {
            pdf: props.pdf,
            scale: props.scale
        }
    }

    componentDidUpdate(lastProps, lastState, snapshot) {
        this.state.pdf.render(this.canvasRef.current)
    }

    renderPDF(canvas) {
        var scale = 1.5;
        // Support HiDPI-screens.
        var outputScale = window.devicePixelRatio || 1;

        var dims = this.state.pdf.scaledDims(scale)
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

    render() {
        return (<li><canvas draggable="true" class="pdf-preview" ref={this.canvasRef}></canvas></li>)
    }
}


class PDFPreview extends Component {
    constructor(props) {
        super(props)
        this.props.pdf = props.pdf
        this.props.maxDim = props.maxDim
        this.props.scale = this.props.pdf.scaleToMaxDim(this.props.maxDim)
    }

    render() {
        return (<PDFCanvas pdf={this.props.pdf} class="pdf-preview" scale={this.props.scale} />)
    }

}

class PDFFull extends Component {
    constructor(props) {
        super(props)
        this.props.pdf = props.pdf
        this.props.scale = 1
    }

    render() {
        return (<PDFCanvas pdf={this.props.pdf} class="pdf-full" scale={this.props.scale} />)
    }
}

export function attach(canvasesElt, pageDocs) {
    render(<PDFPageCollectionComponent collection={pageDocs} />, canvasesElt)
}



