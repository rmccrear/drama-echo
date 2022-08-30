import React from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";

import "./Echo.scss";

class DialogDisplay extends React.Component {
  render() {
    const { dialog } = this.props;
    console.log(this.props);
    console.log(dialog);
    return (
      <Card className="dialog-display">
        <Card.Header>
          <h1> {dialog.title} </h1>
        </Card.Header>
        <Card.Body>
          <p>Character 1: {dialog.characters[0]}</p>
          <p>Character 2: {dialog.characters[1] || "_"}</p>
          <Button as={Link} to={`/echo/${dialog._id}`}>
            Make an Echo
          </Button>
        </Card.Body>
      </Card>
    );
  }
}

export default DialogDisplay;
