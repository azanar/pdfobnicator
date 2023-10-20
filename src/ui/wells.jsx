import { Component } from "inferno";

import { EmptyWell as Empty } from "./wells/empty";
import { DocumentWell as Document } from "./wells/document";

export class DocumentWells extends Component {
  constructor(props) {
    super(props);
    console.log(props.collections);

    const initDocWells = props.collections.map((collectionPromise) =>
        <Document collectionPromise={collectionPromise} />
    );
    this.state = {
      wells: initDocWells,
      emptyWell: <Empty wells={this} />,
    };
  }

  render() {
    return (
      <div>
        <h2>Wells!</h2>
        <div class="collection">
          {this.state.wells}
          {this.state.emptyWell}
        </div>
      </div>
    );
  }

  add(well) {
    this.setState((prevState) => {
      return {
        wells: prevState.wells.concat(well),
      };
    });
  }

  remove(well) {
    var wellNodes = this.state.wells;
    const wells = wellNodes.map((w) => w.children);
    var idx = wells.indexOf(well);

    if (idx === -1) {
      throw new Error();
    }

    wellNodes = wellNodes.slice(0, idx).concat(wellNodes.slice(idx + 1));
    this.setState({ wells: wellNodes });
  }
}
