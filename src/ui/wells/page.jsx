import { Component } from 'inferno';

export class PageWell extends Component {
    constructor(props) {
        super(props)
        if (!props.widget) throw Error("No Widget!")
    }
    
    render() {
        console.log("drawing page " + this.props.page)
        if (!this.props.widget) throw Error("No Widget!")
        return (
            <li class="well active" onDragStart={this.dragstart} onDragOver={this.dragover} onDrop={this.drop} >
                {this.props.widget}
            </li>
        )
    }
    dragover(event) {
        console.log("dragged over page " + this.page + " well")
       event.preventDefault() 
    }
    

    drop(event) {
        console.log("dropped onto page " + this.page + " well")
        event.preventDefault();
    }

    dragstart(event) {
        console.log("picked up page " + this.page + " of pdf")
    }

}
