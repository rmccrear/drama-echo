import React from "react";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import withAuth from "../../withAuth";
import withParams from "../../withParams";
import { getDialogFeed } from "../../models/echoes";
import DialogDisplay from "./DialogDisplay";

class DialogFeed extends React.Component {
  constructor(props) {
    super(props);
    this.state = { dialogs: [] };
  }
  async componentDidMount() {
    await this.props.setupAccessToken();
    const dialogs = await getDialogFeed(this.props.excludedDialogs); // exclude dialogs that we have already started from the feed.
    this.setState({ ...this.state, dialogs });
  }
  render() {
    return (
      <Container>
        <h1>Dialog Feed</h1>
        <Row className="justify-content-center">
          {this.state.dialogs.map((dialog) => (
            <Col key={dialog._id}>
              <DialogDisplay dialog={dialog} />
            </Col>
          ))}
        </Row>
      </Container>
    );
  }
}

export default withParams(withAuth(DialogFeed));
