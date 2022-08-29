import React from "react";
import Button from "react-bootstrap/Button";
import Line from "./Line";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import {
  createLineOfDialog,
  updateLineOfDialog,
  deleteLineOfDialog,
  blankLine,
} from "../models/dialogs";
import { publicNameGen } from "./CloudinaryUploader";

import "./Line.scss";

class LineListing extends React.Component {
  constructor(props) {
    super(props);
    this.handleCreateLine = this.handleCreateLine.bind(this);
    this.updateLine = this.updateLine.bind(this);
    this.deleteLine = this.deleteLine.bind(this);
    this.state = { lines: this.props.lines };
  }
  componentDidMount() {
    this.setState({ lines: this.state.lines });
  }
  async handleCreateLine() {
    const line = await createLineOfDialog(this.props.dialog, blankLine());
    this.state.lines.push(line);
    this.setState({ ...this.state });
  }
  async updateLine(line) {
    const result = await updateLineOfDialog(this.props.dialog, line);
    if (!result.error) {
      const line = result;
      const line_id = line._id;
      console.log(result);
      const idx = this.state.lines.findIndex((l) => l._id === line._id);
      this.state.lines[idx] = line;
      this.state.lines = Array.from(this.state.lines);
      console.log({ ...this.state.lines });
      this.setState({ ...this.state });
    } else {
      console.log(result.error);
    }
  }
  async deleteLine(line) {
    console.log(this.props.dialog, line);
    console.log(this.state);
    const result = await deleteLineOfDialog(this.props.dialog, line);
    if (!result.error) {
      console.log(result);
      this.setState({ ...this.state, lines: result.lines });
      console.log(this.state);
    }
    return result;
  }
  render() {
    const { lines } = this.state;
    return (
      <div className="container">
        <TransitionGroup className="line-list">
          {lines.map((line) => (
            <CSSTransition key={line._id} timeout={500} classNames="line-item">
              <Line
                key={line._id}
                updateLine={this.updateLine}
                deleteLine={this.deleteLine}
                line={line}
                audioPublicId={publicNameGen(this.props.dialog, line)}
                characters={this.props.dialog.characters}
              />
            </CSSTransition>
          ))}
        </TransitionGroup>
        <div>
          <Button onClick={this.handleCreateLine}>Add Line + </Button>
        </div>
      </div>
    );
  }
}

export default LineListing;
