import { Component } from "inferno";

import { ConstrainedPageViewer, PageViewer } from "../../../pdf/viewer";
import { Canvas } from "../canvas";

export class Preview extends Component {
  constructor(props) {
    super(props);

    const innerViewer = new PageViewer(props.pdf);

    this.state = {
      viewer: new ConstrainedPageViewer(innerViewer, props.maxDim),
    };
  }

  render() {
    return <Canvas pdf={this.state.viewer} class="pdf-preview" />;
  }

  rotate(degrees) {
    this.props.pdf.rotate(degrees);
    var viewer = new ConstrainedPageViewer(this.props.pdf, this.props.maxDim);
    this.setState({ viewer: viewer });
  }
}
