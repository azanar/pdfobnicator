import { createRef, render , Component } from 'inferno';
import { Droppable } from '@shopify/draggable';
import { ConstrainedPageViewer } from '../pdf/pdf';

class PDFPageCollectionComponent extends Component {
    constructor(props) {
        super(props)
        this.props.children = props.collection.map((p, idx) => 
            <PDFPreview pdf={p.viewer} page={idx+1} maxDim={150} />
            )
    }

    render() {
        return (
            <div id="pdf-collection">
                <ul draggable="true" class="pdf-list collection">
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
            this.state.pdfViewer.dimensions.then((dims) => {
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
        return (<div><canvas draggable="true" ref={this.canvasRef}></canvas></div>)
    }
}


class PDFPreview extends Component {
    constructor(props) {
        super(props)
        this.props.pdf = new ConstrainedPageViewer(props.pdf, props.maxDim)
        this.props.canvas = <PDFCanvas pdf={this.props.pdf} class="pdf-preview" />
    }

    render() {
        return (
            <li class="collection-item">
                <div>
                    <b>Page:</b>{this.props.page}
                </div>
                <div>
                    <i class="fa-solid fa-rotate-left" onClick={this.rotate(-90)}></i>
                    <i class="fa-solid fa-rotate-right" onClick={this.rotate(90)}></i>
                </div>
                <div>{this.props.canvas}</div>
            </li>
        )
    }

    rotate(degrees) {
        this.props.pdf.rotate(degrees)
        this.props.canvas = <PDFCanvas pdf={this.props.pdf} class="pdf-preview" />
    }

}

/*
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
*/

export function attach(canvasesElt, pageDocs) {
    render(null, canvasesElt)
    render(<PDFPageCollectionComponent collection={pageDocs} />, canvasesElt)
}


const droppable = new Droppable(document.querySelectorAll('.pdf-list'), {
    draggable: '.pdf-preview',
    dropzone: '.dropzone'
  });
  
  droppable.on('droppable:dropped', () => console.log('droppable:dropped'));
