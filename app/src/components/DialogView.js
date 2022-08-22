import React from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { Switch, Route, Link } from "react-router-dom";
import { fetchDialog } from "../models/dialogs";

import withParams from "../withParams";

class DialogView extends React.Component {
  async componentDidMount() {
    const dialog_id = this.props.params.dialog_id;
    const dialog = await fetchDialog(dialog_id);
    this.setState({ dialog });
  }

  render() {
    return this.state ? (
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
      </div>
    ) : (
      <div className="container"></div>
    );
  }
}

export default withParams(DialogView);
