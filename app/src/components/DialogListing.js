import React from "react";

import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";

import withAuth from "../withAuth";

import "./DialogListing.scss";

import { fetchDialogsForUser } from "../models/dialogs";

class DialogItem extends React.Component {
  render() {
    const dialog = this.props.dialog;
    return (
      <ListGroup.Item as={Link} to={`/dialogs/${dialog._id}`}>
        {this.props.dialog.title}
      </ListGroup.Item>
    );
  }
}

class DialogListing extends React.Component {
  constructor(props) {
    super(props);
    this.state = { dialogs: [] };
  }
  async componentDidMount() {
    await this.props.setupAccessToken();
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
              <ListGroup.Item>
                <Button as={Link} to="/dialogs/new">
                  New Dialog +
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card.Body>
        </Card>
      </div>
    );
  }
}

export default withAuth(DialogListing);
