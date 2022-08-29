import React from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import "./Dialog.scss";

function unpackDialog(dialog) {
  if (dialog)
    return {
      title: dialog.title,
      role1: dialog.characters[0],
      role2: dialog.characters[1],
    };
  else
    return {
      title: "",
      role1: "",
      role2: "",
    };
}

class DialogForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = unpackDialog(this.props.dialog);
  }
  handleChange(e) {
    const fieldName = e.target.name;
    const fieldVal = e.target.value;
    this.setState({ ...this.state, [fieldName]: fieldVal });
  }
  handleSubmit(e) {
    e.preventDefault();
    const { title, role1, role2 } = this.state;
    const dialogParams = {
      title,
      characters: [role1, role2],
    };
    this.props.handleSubmit(dialogParams);
  }
  render() {
    return (
      <Form onSubmit={this.handleSubmit} className="dialog-form">
        <div className="clearfix">
          <Form.Group className="m-3 clearfix">
            <Form.Label>
              <span> Dialog Title </span>
            </Form.Label>
            <Form.Control
              name="title"
              placeholder="Dialog Title"
              defaultValue={this.props.dialog.title}
              onChange={this.handleChange}
            />
            <Form.Text className="text-muted">
              Enter the title of your dialog.
            </Form.Text>
          </Form.Group>
          <Form.Group className="m-3 clearfix">
            <Form.Label>Character Role 1:</Form.Label>
            <Form.Control
              name="role1"
              placeholder="Role 1"
              defaultValue={this.props.dialog.characters[0]}
              onChange={this.handleChange}
            />
            <Form.Text className="text-muted">
              Enter the name of the first character in your dialog.
            </Form.Text>
          </Form.Group>
          <Form.Group className="m-3 clearfix">
            <Form.Label>Character Role 2:</Form.Label>
            <Form.Control
              name="role2"
              placeholder="Role 2"
              defaultValue={this.props.dialog.characters[1]}
              onChange={this.handleChange}
            />
            <Form.Text className="text-muted">
              Enter the name of the second character in your dialog.
            </Form.Text>
          </Form.Group>
        </div>
        <div className="clearfix m-2">
          <Button className="dialog-edit-submit-button" type="submit">
            Submit
          </Button>
          {this.props.cancelEdit && (
            <Button
              className="dialog-edit-cancel-button"
              variant="secondary"
              onClick={this.props.cancelEdit}
            >
              Cancel
            </Button>
          )}
          {this.props.deleteFn && (
            <Button
              className="dialog-edit-delete-button"
              variant="danger"
              onClick={this.props.deleteFn}
            >
              Delete
            </Button>
          )}
        </div>
      </Form>
    );
  }
}

export default DialogForm;
