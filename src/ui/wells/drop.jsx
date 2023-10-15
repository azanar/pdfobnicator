import { Component } from 'inferno';

export class DropWell extends Component {
    static *generator() {
        for(;;) {
            yield <DropWell />
        }
    }

    constructor(props) {
        super(props)
    }

    render() {
        return (
            <li class="well drop-well" onDragOver={this.dragover} onDrop={this.drop} >
                <div>Drop Here!</div>
            </li>
        )
    }

    dragover(event) {
        console.log("dragged page " + this.page + " of pdf over drop well")
       event.preventDefault() 
    }

    drop(event) {
        console.log("dropped page " + this.page + " of pdf onto drop well")
        event.preventDefault();
    }
}