import { Component } from 'inferno';

import M from "materialize-css";

export class Collapsible extends Component {
    constructor(props) {
        super(props)
        this.props.open = <span>OPEN!</span>
        this.props.close = <span>CLOSE!</span>
        this.props.collapsible = <ul class="collapsible">{this.props.inner}</ul>
    }

    render() {
        return (
            this.props.collapsible
        )
    }

    componentDidMount() {
        M.Collapsible.init(this.props.collapsible.dom)
    }
}