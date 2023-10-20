import { Component } from "inferno";

export class DocumentWell extends Component {
    props.collectionPromise.then((collection) => {
      const uiCollection = new Collection(collection);
      const pages = uiCollection.widgets.map((pageWidget) => <PageWell widget={pageWidget} />);
      const drops = interleave0(pages, DropWell.generator());
      const wells = [<DropWell />, ...Array.from(drops)];
}