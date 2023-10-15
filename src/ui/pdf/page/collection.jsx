
import { Page } from '../page';

export class Collection {
    constructor(props) {
        this.props.collection = props.collection

        this.pages = this.props.collection.map((p) => <Page page={p}/>)
    }

    map (fn) {
        return this.arr.map(fn)
    }

    *enumerate() {
        for (const [i, w] of this.arr.entries()) {
            yield {
                idx: i,
                widget: w
            }
        } 
    }

    remove(p) {
        this.props.collection.remove(p)
    }

    get pages() {
        return this.pages;
    }
}