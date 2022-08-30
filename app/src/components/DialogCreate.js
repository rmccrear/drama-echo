import React from "react";
import Card from "react-bootstrap/Card";

import withAuth from "../withAuth";
import withParams from "../withParams";
import DialogForm from "./DialogForm";

import { blankDialog, createDialog } from "../models/dialogs";

class DialogCreate extends React.Component {
  constructor(props) {
    super(props);
    this.state = { dialog: blankDialog() };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.cancelEdit = this.cancelEdit.bind(this);
  }
  async handleSubmit(dialog) {
    await this.props.setupAccessToken();
    const dialogNew = await createDialog(dialog);
    const dialogId = dialogNew._id;
    this.props.navigate(`/dialogs/${dialogId}`);
  }
  cancelEdit() {
    this.props.navigate(`/dialogs`);
  }
  render() {
    return (
      <div className="container">
        <Card>
          <DialogForm
            dialog={this.state.dialog}
            handleSubmit={this.handleSubmit}
            cancelEdit={this.cancelEdit}
          />
        </Card>
      </div>
    );
  }
}

export default withParams(withAuth(DialogCreate));
