import { Component } from "inferno";

import { interleave0 } from "interleaver.js";

import { Collection } from "../pdf/page/collection";

import { PageWell } from "./page.jsx";
import { DropWell } from "./drop.jsx";

export class DocumentWell extends Component {
  constructor(props) {
    super(props);
    this.state = {
      wells: [<LoadingCard />],
    };
    props.collectionPromise.then((collection) => {
      const uiCollection = new Collection(collection);
      const pages = uiCollection.widgets.map((pageWidget) => <PageWell widget={pageWidget} />);
      const drops = interleave0(pages, DropWell.generator());
      const wells = [<DropWell />, ...Array.from(drops)];
      this.setState({
        wells: wells,
      });
    });
  }

  render() {
    return (
      <div class="collection-item pdf-document">
        <div class="collection">{this.state.wells}</div>
      </div>
    );
  }
}

class LoadingCard extends Component {
  render() {
    return <div class="well">Loading</div>;
  }
}

class ErrorCard extends Component {
  render() {
    return <div class="well">Error ${this.props.reason}</div>;
  }
}
