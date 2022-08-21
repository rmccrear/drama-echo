import React from "react";

import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";

import "./DialogListing.scss";

import { fetchDialogsForUser } from "../models/dialogs";

class DialogItem extends React.Component {
  render() {
    return <ListGroup.Item>{this.props.dialog.title}</ListGroup.Item>;
  }
}

class DialogListing extends React.Component {
  constructor(props) {
    super(props);
    this.state = { dialogs: [] };
  }
  async componentDidMount() {
    const dialogs = await fetchDialogsForUser(this.props.user._id);
    this.setState({ ...this.state, dialogs });
  }
  render() {
    return (
      <div className="DialogListing">
        <Card>
          <Card.Body>
            <Card.Title> Dialogs </Card.Title>
            <ListGroup variant="flush">
              {this.state.dialogs.map((dialog) => (
                <DialogItem key={dialog._id} dialog={dialog} />
              ))}
            </ListGroup>
          </Card.Body>
        </Card>
      </div>
    );
  }
}

export default DialogListing;
