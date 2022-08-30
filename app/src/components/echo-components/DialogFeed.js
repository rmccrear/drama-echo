import React from "react";

import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";

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
    console.log(dialogs);
    this.setState({ ...this.state, dialogs });
  }
  render() {
    console.log(this.state.dialogs);
    return (
      <div className="container">
        <h1>Dialog Feed</h1>
        <div class="row">
          {this.state.dialogs.map((dialog) => (
            <div class="col-sm-6 p-2">
              {" "}
              <DialogDisplay key={dialog._id} dialog={dialog} />
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default withParams(withAuth(DialogFeed));
