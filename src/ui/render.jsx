import { createRef, render , Component } from 'inferno';
import { Droppable } from '@shopify/draggable';
import { LocalFileHandle, NewFileHandle } from '../pdf/pdf';
import { ConstrainedPageViewer, PageViewer } from '../pdf/viewer';

export class Wells extends Component {
    constructor(props) {
        super(props)
        const initDocWells = props.handles.map((handle) => <DocumentWell handle={handle} />)
        this.state = {
            wells: initDocWells,
            emptyWell: <EmptyWell wells={this} /> 
        }
    }

    render() {
        return <div><h2>Wells!</h2>{this.state.wells}{this.state.emptyWell}</div>
    }

    add(well) {
        this.setState((prevState) => {
            return {
                wells: prevState.wells.concat(well)
            }
        })
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
    render() {
        return <div id="well">
            <span onClick={() => this.create()}><i class="fa-solid fa-file-circle-plus fa-2xl"></i></span>        
            <span onClick={() => this.open()}><i class="fa-solid fa-file-import fa-2xl"></i></span>        
        </div >
    }

    create() {
        var handle = new NewFileHandle;
        var well = <DocumentWell handle={handle} wells={this.props.wells}/>
        this.props.wells.add(well)
    }

    open() {
        const file = document.getElementById('file-selector').files[0]
        const handle = new LocalFileHandle(file);
        /* FIXME: can not create element until the file load is done*/
        var well = <DocumentWell handle={handle} wells={this.props.wells}/>
        this.props.wells.add(well)
    }
}

export class DocumentWell extends Component {
    constructor(props) {
        super(props)

        this.state = {
            content: <Loading />
        }

        this.props.handle.pageDocs.then((p) =>
            this.setState({
                content: <PDFDocument collection={p} />
            }),
        )
    }

    render() {
        return <div id="well">
            <div class="pdf-document-properties">
                <div class="pdf-document-path">{this.props.handle.path}</div>
                <div class="pdf-document-basename">{this.props.handle.path}</div>
            </div>
            <div class="pdf-document-content">
                {this.state.content}
            </div>
        </div>
    }

}

class Loading extends Component {

    render() {
        "Loading"
    }
}

class Error extends Component {
    render() {
        `Error ${this.props.reason}`;
    }
}

class PDFDocument extends Component {
    constructor(props) {
        super(props)
        this.props.collection = props.collection
    }

    render() {
        console.log("Document!")
        console.log(this.props.collection.pageDocs.length)
        return <div id="pdf-document">
            <PDFPageCollectionComponent collection={this.props.collection} />
        </div>
    }

}

class PDFPageCollectionComponent extends Component {
    constructor(props) {
        super(props)
        this.props.collection = props.collection

        const elements = this.props.collection.map((p, idx) => 
            <PDFPreview pdf={p} page={idx+1} maxDim={150} />
        )

        this.state = {
            elements: elements
        }
    }

    render() {
        console.log("Collection!")
        console.log(this.props.collection.pageDocs.length)
        return (
            <div id="pdf-collection">
                <ul class="pdf-list collection">
                    {this.state.elements}
                </ul>
            </div>
            )
    }
}


class PDFPreview extends Component {
    constructor(props) {
        super(props)

        const innerViewer = new PageViewer(props.pdf)

        this.state = {
            viewer: new ConstrainedPageViewer(innerViewer, props.maxDim)
        }
    }

    render() {
        return (
            <li class="collection-item" onDragOver={this.dragover} onDrop={this.drop} >
                <div>
                    <b>Page:</b>{this.props.page}
                </div>
                <div>
                    <span onClick={() => this.rotate(-90)}><i class="fa-solid fa-rotate-left"></i></span>
                    <span onClick={() => this.rotate(90)}><i class="fa-solid fa-rotate-right"></i></span>
                </div>
                <div><PDFCanvas pdf={this.state.viewer} class="pdf-preview"/></div> 
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
