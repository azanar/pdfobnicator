import { Component } from 'inferno';
import { Preview } from './page/preview';

export class Page extends Component {
    constructor(props) {
        super(props)

        this.state = {
            container: <Preview pdf={props.doc} maxDim="150"/>
        }
    }

    render() {
        console.log("drawing page " + this.props.page)
        return (
            <div class="page-container">
                <div class="collapsible-header">
                    <div>
                        <i class="fa-solid fa-bars"></i>
                        <b>Page:</b>{this.props.page}
                    </div>
                    <div>
                        <span onClick={() => this.rotate(-90)}><i class="fa-solid fa-rotate-left"></i></span>
                        <span onClick={() => this.rotate(90)}><i class="fa-solid fa-rotate-right"></i></span>
                    </div>
                </div>
                <div class="collapsible-body">
                    {this.state.container}
                </div> 
            </div>
        )
    }

    move(dest, page) {
        this.props.collection.remove(this.props.container)
        dest.add(this.props.container, page);
    }

    rotate(degrees) {
        this.state.container.rotate(degrees)
    }
}