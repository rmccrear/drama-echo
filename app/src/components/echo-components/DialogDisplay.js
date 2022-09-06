import React from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import withParams from "../../withParams";

import "./Echo.scss";

class DialogDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.goToEcho = this.goToEcho.bind(this);
  }
  goToEcho() {
    this.props.navigate(`/echo/${this.props.dialog._id}`);
  }
  render() {
    const { dialog } = this.props;
    return (
      <Card className="dialog-display">
        <Card.Header>
          <h1> {dialog.title} </h1>
        </Card.Header>
        <Card.Body>
          <p onClick={this.goToEcho}>Character 1: {dialog.characters[0]}</p>
          <p onClick={this.goToEcho}>
            Character 2: {dialog.characters[1] || "_"}
          </p>
          <Button onClick={this.goToEcho}>Make an Echo</Button>
        </Card.Body>
      </Card>
    );
  }
}

export default withParams(DialogDisplay);
