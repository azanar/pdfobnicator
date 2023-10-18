import { Component } from 'inferno';

import { interleave0 } from 'interleaver.js';


import { PageWell } from './page.jsx'
import { DropWell } from './drop.jsx'

export class DocumentWell extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        const pages = this.props.collection.enumerate().map((p) => <PageWell num={p.idx} contents={p.widget} />  )
        const drops = interleave0(pages, DropWell.generator())
        const wells = [<DropWell />, ...Array.from(drops)]
        return <div class="pdf-document">
            {wells}
        </div>
    }

}

class Loading extends Component {
    render() {
        return <div class="well">Loading</div>
    }
}

class Error extends Component {
    render() {
        return <div class="well">Error ${this.props.reason}</div>;
    }
}