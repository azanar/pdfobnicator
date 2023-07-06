import { createRef, render , Component } from 'inferno';
import { Droppable } from '@shopify/draggable';
import { ConstrainedPageViewer, LocalFileHandle, EmptyFileHandle } from '../pdf/pdf';

export class Wells extends Component {
    constructor(props) {
        super(props)
        this.state = {
            wells: [<EmptyWell wells={this} />]
        }
    }

    render() {
        return <div><h2>Wells!</h2>{this.state.wells}</div>
    }

    add(well) {
        var wells = this.state.wells
        wells.push(well)
        this.setState(
            {wells: wells}
        )
    }

    remove(well) {
        var wells = this.state.wells
        var idx = wells.indexOf(well)
        if (idx === -1) {
            throw Error()
        }
        wells.splice(idx)
        this.setState(
            {wells: wells}
        )
    }
}


class EmptyWell extends Component {
    constructor(props) {
        super(props)
        this.props.wells = props.wells
    }

    render() {
        console.log("ping")
        return <div id="well">
            <span onClick={() => this.create()}><i class="fa-solid fa-file-circle-plus fa-2xl"></i></span>        
            <span onClick={() => this.open()}><i class="fa-solid fa-file-import fa-2xl"></i></span>        
        </div >
    }

    create() {
        var handle = new EmptyFileHandle;
        var well = <DocumentWell handle={handle} wells={this.props.wells}/>
        this.props.wells.add(well)
    }

    open() {
        const file = document.getElementById('file-selector').files[0]
        const handle = new LocalFileHandle;
        /* FIXME: can not create element until the file load is done*/
        var well = <DocumentWell handle={handle} wells={this.props.wells}/>
        this.props.wells.add(well)
    }
}

class DocumentWell extends Component {
    constructor(props) {
        super(props)
        this.props.wells = props.wells
        this.props.handle = props.handle
    }

    render() {
        return <div id="well">
           <PDFDocument handle={this.props.handle} />
        </div>
    }

}

class PDFDocument extends Component {
    constructor(props) {
        super(props)
        this.props.handle = props.handle
    }

    render() {
        return <div id="pdf-document">
            <div class="pdf-document-path">{this.props.handle.path}</div>
            <div class="pdf-document-basename">{this.props.handle.path}</div>
            <PDFPageCollectionComponent collection={this.props.handle.pageDocs} />
        </div>
    }

}

class PDFPageCollectionComponent extends Component {
    constructor(props) {
        super(props)
        this.props.collection = props.collection.map((p, idx) => 
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

    componentDidMount(_elt) {
        this.renderPDF(this.canvasRef.current)
    }

    componentDidUpdate(_lastProps, _lastState, _snapshot) {
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
        this.state = {}
        this.state.viewer = new ConstrainedPageViewer(props.pdf, props.maxDim)
    }

    render() {
        console.log("rendering!")
        return (
            <li class="collection-item" onDragOver={this.dragover} onDrop={this.drop} >
                <div>
                    <b>Page:</b>{this.props.page}
                </div>
                <div>
                    <span onClick={() => this.rotate(-90)}><i class="fa-solid fa-rotate-left"></i></span>
                    <span onClick={() => this.rotate(90)}><i class="fa-solid fa-rotate-right"></i></span>
                </div>
                <div>{<PDFCanvas pdf={this.state.viewer} class="pdf-preview"/>}</div>
            </li>
        )
    }

    dragover(event) {
       event.preventDefault() 
    }

    drop(event) {
        event.preventDefault();
    }

    rotate(degrees) {
        this.props.pdf.rotate(degrees)
        var viewer = new ConstrainedPageViewer(this.props.pdf, this.props.maxDim)
        this.setState({"viewer": viewer})
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

export function attach(root, wells) {
    render(wells,root)
}


const droppable = new Droppable(document.querySelectorAll('.pdf-list'), {
    draggable: '.pdf-preview',
    dropzone: '.dropzone'
  });
  
  droppable.on('droppable:dropped', () => console.log('droppable:dropped'));
