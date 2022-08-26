import React from "react";
import Card from "react-bootstrap/Card";

import DialogForm from "./DialogForm";
import withParams from "../withParams";
import withAuth from "../withAuth";
import { fetchDialog, updateDialog } from "../models/dialogs";

class DialogUpdate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  async componentDidMount() {
    await this.props.setupAccessToken();
    const dialogId = this.props.params.dialog_id;
    const dialog = await fetchDialog(dialogId);
    this.setState({ dialog });
  }
  async submitForm(form) {
    await this.props.setupAccessToken();
    const dialogId = this.props.params.dialog_id;
    await updateDialog(form);
  }
  render() {
    const dialog = this.state.dialog;
    return (
      <div className="container">
        <Card>{dialog ? <DialogForm dialog={dialog} /> : ""}</Card>
      </div>
    );
  }
}

export default withParams(withAuth(DialogUpdate));
