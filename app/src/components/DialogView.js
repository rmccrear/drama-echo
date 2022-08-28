import React from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { Switch, Route, Link } from "react-router-dom";
import { fetchDialog } from "../models/dialogs";

import LineListing from "./LineListing";

import withParams from "../withParams";
import withAuth from "../withAuth";

class DialogView extends React.Component {
  constructor(props) {
    super(props);
    this.state = { loading: true };
  }
  async componentDidMount() {
    await this.props.setupAccessToken();
    const dialog_id = this.props.params.dialog_id;
    const resp = await fetchDialog(dialog_id);
    if (resp.error) {
      this.setState({ error: resp.error, loading: false });
    } else {
      this.setState({ dialog: resp, loading: false });
    }
  }

  render() {
    return !this.state.error && !this.state.loading ? (
      <div className="container">
        <Card>
          <h1> {this.state.dialog.title} </h1>
          {this.state.dialog.characters.map((character, i) => (
            <p key={i}>
              Character {i + 1}: {character}
            </p>
          ))}
          <Button as={Link} to="/dialogs">
            OK
          </Button>
          <Button as={Link} to={`/dialogs/${this.state.dialog._id}/edit`}>
            Edit
          </Button>
        </Card>
        <Card>
          <LineListing
            dialog={this.state.dialog}
            lines={this.state.dialog.lines}
          />
        </Card>
      </div>
    ) : this.state.error ? (
      <div className="container">
        {" "}
        Document not found {this.state.error.status}{" "}
      </div>
    ) : (
      ""
    );
  }
}

export default withParams(withAuth(DialogView));
