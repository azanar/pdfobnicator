import { createRef, Component } from 'inferno';

export class Canvas extends Component {
    constructor(props) {
        super(props)
        this.canvasRef = createRef();

        this.state = {
            pdfViewer: props.pdf
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    componentDidMount(_elt) {
        this.renderPDF(this.canvasRef.current)
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    componentDidUpdate(_lastProps, _lastState, _snapshot) {
        //this.renderPDF(this.canvasRef.current)
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
        return (<div><canvas ref={this.canvasRef}></canvas></div>)
    }
}