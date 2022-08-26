import React from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

import DialogForm from "./DialogForm";

import { blankDialog, createDialog } from "../models/dialogs";

class DialogCreate extends React.Component {
  constructor(props) {
    super(props);
    this.state = { dialog: blankDialog() };
  }
  async handleSubmit(dialog) {
    await this.props.setupAccessToken();
    await createDialog(dialog);
  }
  render() {
    return (
      <div className="container">
        <Card>
          <DialogForm dialog={this.state.dialog} />
        </Card>
      </div>
    );
  }
}

export default DialogCreate;
