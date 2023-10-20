import { Component, createRef } from "inferno";

import M from "materialize-css";

export class Collapsible extends Component {
  constructor(props) {
    super(props);
    this.props.open = <span onClick={(e) => this.open(e)}><i class="fa-regular fa-square-plus fa-lg" /></span>;
    this.props.close = <span onClick={(e) => this.close(e)}><i class="fa-regular fa-square-minus fa-lg" /></span>;
    this.props.ref = createRef(null)
    this.props.instance = null
  }

  render() {
    return (
      <div>
        <div>{this.props.open} {this.props.close}</div>
        <ul ref={this.props.ref} class="collapsible">
          <li>
            <div class="collapsible-header">{this.props.header}</div>
            <div class="collapsible-body">{this.props.body}</div>
          </li>
        </ul>
      </div>
    );
  }

  open(e) {
    this.props.instance.open();
    e.preventDefault();
  }

  close(e) {
    this.props.instance.close();
    e.preventDefault();
  }

  componentDidMount() {
    if (!this.props.ref.current) {
      throw "where the hell is my dom elt?"
    }
    this.props.instance = M.Collapsible.init(this.props.ref.current);
  }
}
