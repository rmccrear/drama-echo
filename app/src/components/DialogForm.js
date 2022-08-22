import React from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

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
    this.state = unpackDialog(this.props.dialog);
  }
  handleChange(e) {
    const fieldName = e.target.name;
    const fieldVal = e.target.value;
    console.log(fieldName, fieldVal);
    this.setState = { ...this.state, [fieldName]: fieldVal };
  }
  render() {
    return (
      <Form>
        <Form.Group>
          <Form.Label>
            <span> Dialog Title </span>
          </Form.Label>
          <Form.Control
            name="title"
            placeholder="Dialog Title"
            defaultValue={this.props.dialog.title}
            onChange={this.handleChange}
          />
        </Form.Group>

        <Form.Control
          name="role1"
          placeholder="Role 1"
          defaultValue={this.props.dialog.characters[0]}
          onChange={this.handleChange}
        />
        <Form.Control
          name="role2"
          placeholder="Role 2"
          defaultValue={this.props.dialog.characters[1]}
          onChange={this.handleChange}
        />
        <Button type="submit">Submit</Button>
        <Button variant="danger">Delete</Button>
      </Form>
    );
  }
}

export default DialogForm;
