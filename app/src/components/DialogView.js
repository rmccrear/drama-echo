import React from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import { fetchDialog, updateDialog } from "../models/dialogs";

import LineListing from "./LineListing";

import withParams from "../withParams";
import withAuth from "../withAuth";

class DialogView extends React.Component {
  constructor(props) {
    super(props);
    this.handlePublish = this.handlePublish.bind(this);
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
  async handlePublish() {
    await this.props.setupAccessToken();
    const dialog_id = this.state.dialog._id;
    const dialogParams = { status: "published" };
    const updatedDialog = await updateDialog(dialog_id, dialogParams);
    console.log(updatedDialog);
    this.setState({ ...this.state, dialog: updatedDialog });
  }

  render() {
    return !this.state.error && !this.state.loading ? (
      <div className="container">
        <Card>
          <Card.Body>
            <h1> {this.state.dialog.title} </h1>
            {this.state.dialog.characters.map((character, i) => (
              <p key={i}>
                Character {i + 1}: {character}
              </p>
            ))}
            <Button
              className="dialog-cancel-button"
              variant="secondary"
              as={Link}
              to="/dialogs"
              role="button"
              style={{ float: "left" }}
            >
              OK
            </Button>
            {this.state.dialog.status !== "published" ? (
              <>
                <Button
                  className="dialog-edit-button"
                  as={Link}
                  to={`/dialogs/${this.state.dialog._id}/edit`}
                  role="button"
                  style={{ float: "right" }}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  className="dialog-publish-button"
                  onClick={this.handlePublish}
                  role="button"
                  style={{ float: "right" }}
                >
                  Publish
                </Button>
              </>
            ) : (
              <Button disabled={true} style={{ float: "right" }}>
                Published
              </Button>
            )}
          </Card.Body>
        </Card>
        <Card>
          <Card.Title>Lines of Dialog: </Card.Title>
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
