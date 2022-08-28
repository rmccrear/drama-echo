import React from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Line as LineObj } from "../models/dialogs";
import Uploader, { publicNameGen } from "./CloudinaryUploader";

function characterNamefromIdx(idx, characters) {
  return characters[idx];
}

class Line extends React.Component {
  constructor(props) {
    super(props);
    this.handleUpdateLine = this.handleUpdateLine.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }
  state = { editing: false };
  async handleUpdateLine(line) {
    this.setState({ ...this.state, editing: false, pending: true });
    await this.props.updateLine(line);
    this.setState({ ...this.state, pending: false });
  }
  handleCancel(e) {
    e.preventDefault();
    this.setState({ ...this.state, editing: false });
  }
  render() {
    const { editing } = this.state;
    const { content } = this.props.line;
    const characterName = characterNamefromIdx(
      this.props.line.characterIdx,
      this.props.characters
    );
    console.log(this.props);
    if (!editing) {
      return (
        <Card>
          <p>{characterName}: </p>
          <div>{content}</div>
          <Button
            disabled={this.state.pending}
            onClick={(e) => this.setState({ editing: !editing })}
          >
            Edit
          </Button>
        </Card>
      );
    } else {
      console.log(this.props);
      return (
        <LineForm
          handleUpdateLine={this.handleUpdateLine}
          handleDeleteLine={this.props.deleteLine}
          line={this.props.line}
          characters={this.props.characters}
          handleCancel={this.handleCancel}
          audioPublicId={this.props.audioPublicId}
        ></LineForm>
      );
    }
  }
}

class LineForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.state = { line: this.props.line };
  }
  handleChange(e) {
    const fieldName = e.target.name;
    const fieldVal = e.target.value;
    const newLine = { ...this.state.line, [fieldName]: fieldVal };
    this.setState({ ...this.state, line: newLine });
  }
  handleSelect(e) {
    const value = e.target.value;
    const newLine = { ...this.state.line, characterIdx: parseInt(value, 10) };
    this.setState({ ...this.state, line: newLine });
    console.log(newLine);
  }
  handleSubmit(e) {
    e.preventDefault();
    console.log({ ...this.state.line });
    const line = new LineObj(this.state.line);
    console.log(line);
    this.props.handleUpdateLine(line);
  }
  handleDelete(e) {
    this.props.handleDeleteLine(this.props.line);
  }
  render() {
    return (
      <Form onSubmit={this.handleSubmit}>
        <Form.Group>
          <CharacterSelect
            line={this.state.line}
            characters={this.props.characters}
            handleSelect={this.handleSelect}
          />
          <Form.Label>
            <span> Write the line of dialog here. </span>
          </Form.Label>
          <Form.Control
            name="content"
            placeholder="To be, or not to be..."
            defaultValue={this.props.line.content}
            onChange={this.handleChange}
          />
          <Uploader publicId={this.props.audioPublicId} />
          <Button type="submit">Submit</Button>
          <Button variant="secondary" onClick={this.props.handleCancel}>
            Cancel
          </Button>
          <Button variant="danger" onClick={this.handleDelete}>
            Delete
          </Button>
        </Form.Group>
      </Form>
    );
  }
}

class CharacterSelect extends React.Component {
  render() {
    const characterIdx = this.props.line.characterIdx;
    const characters = this.props.characters;
    const handleSelect = this.props.handleSelect;
    return (
      <Form.Group>
        <Form.Label>
          <span> Choose the character who speaks this dialog. </span>
          <Form.Select
            aria-label="Select character for this line of dialog."
            onChange={handleSelect}
          >
            <option>Choose Character</option>
            {this.props.characters.map((c, idx) => {
              return (
                <option key={idx} value={idx} selected={characterIdx === idx}>
                  {characterNamefromIdx(idx, characters)}
                </option>
              );
            })}
          </Form.Select>
        </Form.Label>
      </Form.Group>
    );
  }
}

export default Line;
