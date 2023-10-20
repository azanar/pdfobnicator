import { Component } from "inferno";

import { CollectionWell } from "./document/collection";

export class DocumentWell extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: <LoadingCard />,
    };
    props.collectionPromise.then((collection) => {
      this.setState({
        content: <CollectionWell collection={collection}/>
      });
    });
  }

  render() {
    return this.state.content
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
