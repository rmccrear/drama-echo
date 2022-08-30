import React from "react";

import Card from "react-bootstrap/Card";

import withAuth from "../../withAuth";
import withParams from "../../withParams";

import DialogFeed from "./DialogFeed";

class EchoHome extends React.Component {
  constructor(props) {
    super(props);
    this.state = { dialogs: [] };
  }
  render() {
    return (
      <>
        <Card>
          <Card.Body>Echo Home</Card.Body>
        </Card>
        <DialogFeed />
      </>
    );
  }
}

export default withParams(withAuth(EchoHome));
