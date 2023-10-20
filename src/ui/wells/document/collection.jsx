import { Component } from "inferno";

import { interleave0 } from "interleaver.js";

import { Collapsible } from '../../collapsible'

import { Collection } from "../../pdf/page/collection";

import { PageWell } from "../page.jsx";
import { DropWell } from "../drop.jsx";

export class CollectionWell extends Component {
  constructor(props) {
    super(props);

    const uiCollection = new Collection(props.collection);
    const pages = uiCollection.widgets.map((pageWidget) => <PageWell widget={pageWidget} />);
    const drops = interleave0(pages, DropWell.generator());
    const wells = [<DropWell />, ...Array.from(drops)];
    
    this.state = {
      name: "test.pdf",
      wells: wells
    }
  }

  render() {
      const header = <div>
        <div>
          <span>Name</span>: {this.state.name}
        </div>
        <div>
          <span>Disposition</span>: Local
        </div>
      </div>
        
      const body = <div class="collection">{this.state.wells}</div>
      return <div class="collection-item pdf-document">
          <Collapsible
        header={header}
        body={body}
        />
      </div>
  }
}