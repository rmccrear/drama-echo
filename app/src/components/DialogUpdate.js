import React from "react";
import Card from "react-bootstrap/Card";

import DialogForm from "./DialogForm";
import withParams from "../withParams";
import withAuth from "../withAuth";
import { fetchDialog, updateDialog, deleteDialog } from "../models/dialogs";

class DialogUpdate extends React.Component {
  constructor(props) {
    super(props);
    this.state = { loading: true };
    this.handleDeleteButton = this.handleDeleteButton.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  async componentDidMount() {
    await this.props.setupAccessToken();
    const dialogId = this.props.params.dialog_id;
    const resp = await fetchDialog(dialogId);
    if (resp.error) {
      this.setState({ error: resp.error, loading: false });
    } else {
      this.setState({ dialog: resp, loading: false });
    }
  }
  async handleSubmit(dialogParams) {
    await this.props.setupAccessToken();
    const dialogId = this.props.params.dialog_id;
    await updateDialog(dialogId, dialogParams);
    this.props.navigate(`/dialogs/${dialogId}`);
  }
  async handleDeleteButton() {
    await this.props.setupAccessToken();
    const dialogId = this.props.params.dialog_id;
    await deleteDialog(dialogId);
    this.props.navigate("/dialogs");
  }
  render() {
    const dialog = this.state.dialog;
    return (
      <div className="container">
        <Card>
          {dialog && !this.state.loading ? (
            <DialogForm
              dialog={dialog}
              deleteFn={this.handleDeleteButton}
              handleSubmit={this.handleSubmit}
            />
          ) : this.state.error ? (
            <div>Error loading document {this.state.error.statusText}</div>
          ) : (
            ""
          )}
        </Card>
      </div>
    );
  }
}

export default withParams(withAuth(DialogUpdate));
