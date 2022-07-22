import {createRef, render , Component } from 'inferno';
import { ConstrainedPageViewer } from '../pdf/pdf';

class PDFPageCollectionComponent extends Component {
    constructor(props) {
        super(props)
        this.props.children = props.collection.map((p) => 
            <PDFPreview pdf={p.viewer()} maxDim={150} />
            )
    }

    render() {
        return (
            <div id="pdf-collection">
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
            pdfViewer: props.pdf
        }
    }

    componentDidMount(elt) {
        this.renderPDF(this.canvasRef.current)
    }

    componentDidUpdate(lastProps, lastState, snapshot) {
        this.renderPDF(this.canvasRef.current)
    }

    renderPDF(canvas) {
            this.state.pdfViewer.dimensions().then((dims) => {
                canvas.width = Math.floor(dims.width);
                canvas.height = Math.floor(dims.height);
                canvas.style.width = Math.floor(dims.width) + "px";
                canvas.style.height =  Math.floor(dims.height) + "px";

                var renderContext = {
                    canvas: canvas,
                };

                this.state.pdfViewer.render(renderContext)
            })
    }

    render() {
        return (<li><canvas draggable="true" class="pdf-preview" ref={this.canvasRef}></canvas></li>)
    }
}


class PDFPreview extends Component {
    constructor(props) {
        super(props)
        this.props.pdf = new ConstrainedPageViewer(props.pdf, props.maxDim)
    }

    render() {
        return (<PDFCanvas pdf={this.props.pdf} class="pdf-preview" />)
    }

}

class PDFFull extends Component {
    constructor(props) {
        super(props)
        this.props.pdf = props.pdf
        this.props.scale = 1
    }

    render() {
        return (<PDFCanvas pdf={this.props.pdf} class="pdf-full" />)
    }
}

export function attach(canvasesElt, pageDocs) {
    render(null, canvasesElt)
    render(<PDFPageCollectionComponent collection={pageDocs} />, canvasesElt)
}



