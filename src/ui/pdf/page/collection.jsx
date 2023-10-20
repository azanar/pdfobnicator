import { Page } from "../page";

export class Collection {
  constructor(collection) {
    this.collection = collection;

    this.pageWidgets = this.collection.enumerate().map((e) => {
      const widget = <Page page={e.idx+1} doc={e.doc} />;
      return widget;
    });
  }

  get widgets() {
    return this.pageWidgets;
  }

  map(fn) {
    return this.pageWidgets.map(fn);
  }

  remove(p) {
    this.props.collection.remove(p);
  }
}
