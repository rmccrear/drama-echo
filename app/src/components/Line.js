import React from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Line as LineObj } from "../models/dialogs";
import Uploader from "./CloudinaryUploader";
import { CSSTransition, SwitchTransition } from "react-transition-group";

import "./Line.scss";

const remoteCloudinaryFolder =
  process.env.REACT_APP_CLOUDINARY_REMOTE_LINES_OF_DIALOG_FOLDER;

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
    return (
      <SwitchTransition>
        <CSSTransition
          key={editing ? false : true}
          addEndListener={(node, done) =>
            node.addEventListener("transitionend", done, false)
          }
          classNames="fade"
        >
          {!editing ? (
            <Card className="mb-3">
              <Card.Body>
                <Card.Header>
                  <p className="line-text">
                    <span className="line-character-name">{characterName}</span>
                    <span className="line-content">{content}</span>
                  </p>
                </Card.Header>
                <div>
                  {this.props.line.audioUrl ? (
                    <audio controls>
                      <source src={this.props.line.audioUrl} />
                    </audio>
                  ) : (
                    ""
                  )}
                </div>
                {this.props.status === "published" ? (
                  ""
                ) : (
                  <Button
                    className="line-edit-button"
                    disabled={this.state.pending}
                    onClick={(e) => this.setState({ editing: !editing })}
                  >
                    Edit
                  </Button>
                )}
              </Card.Body>
            </Card>
          ) : (
            <LineForm
              handleUpdateLine={this.handleUpdateLine}
              handleDeleteLine={this.props.deleteLine}
              line={this.props.line}
              characters={this.props.characters}
              handleCancel={this.handleCancel}
              audioPublicId={this.props.audioPublicId}
            ></LineForm>
          )}
        </CSSTransition>
      </SwitchTransition>
    );
  }
}

class LineForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleUploadedFile = this.handleUploadedFile.bind(this);
    this.handleUploadStart = this.handleUploadStart.bind(this);
    this.state = { line: this.props.line };
    this.state.loadingDelete = false;
    this.state.loadingSubmit = false;
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
  }
  async handleSubmit(e) {
    e.preventDefault();
    const line = new LineObj(this.state.line);
    this.setState({ ...this.state, loadingSubmit: true });
    await this.props.handleUpdateLine(line);
    this.setState({ ...this.state, loadingSubmit: false });
  }
  async handleDelete(e) {
    this.setState({ ...this.state, loadingDelete: true });
    await this.props.handleDeleteLine(this.props.line);
    this.setState({ ...this.state, loadingDelete: true });
  }
  handleUploadedFile(file) {
    const newLine = { ...this.state.line, audioUrl: file.secure_url };
    this.props.handleUpdateLine(newLine);
    this.setState({ ...this.state, line: newLine });
  }
  // TODO: use loadingSubmit to disable the submit button, etc...
  handleUploadStart() {
    this.setState({ ...this.state, loadingSubmit: true });
  }
  render() {
    return (
      <Card className="line-form-container mb-3">
        <Form onSubmit={this.handleSubmit}>
          <Form.Group>
            <CharacterSelect
              label="1. Choose the character who speaks this dialog."
              line={this.state.line}
              characters={this.props.characters}
              handleSelect={this.handleSelect}
            />
            <Form.Label>
              <span> 2. Write the line of dialog here. </span>
            </Form.Label>
            <Form.Control
              name="content"
              placeholder="To be, or not to be..."
              defaultValue={this.props.line.content}
              onChange={this.handleChange}
            />
            <div className="line-form-audio-uploader">
              <Uploader
                folder={remoteCloudinaryFolder}
                label={
                  <div>
                    <span>3. Select Audio. </span>
                    {this.props.line.audioUrl && (
                      <audio controls>
                        <source src={this.props.line.audioUrl} />
                      </audio>
                    )}
                  </div>
                }
                publicId={this.props.audioPublicId}
                handleUploadedFile={this.handleUploadedFile}
                handleUploadStart={this.handleUploadStart}
              />
            </div>
            <Button
              type="submit"
              className="line-submit-button"
              disabled={this.state.loadingDelete && this.state.loadingSubmit}
            >
              {this.state.loadingSubmit ? "Uploading..." : "Submit"}
            </Button>
            <Button
              className="line-cancel-button"
              variant="secondary"
              onClick={this.props.handleCancel}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              className="line-delete-button"
              onClick={this.handleDelete}
              disabled={this.state.loadingDelete && this.state.loadingSubmit}
            >
              {this.state.loadingDelete ? "Deleting" : "Delete"}
            </Button>
          </Form.Group>
        </Form>
      </Card>
    );
  }
}

class CharacterSelect extends React.Component {
  render() {
    const characterIdx = this.props.line.characterIdx;
    const { characters, handleSelect } = this.props;
    return (
      <Form.Group>
        <Form.Label>
          <span> {this.props.label} </span>
          <Form.Select
            aria-label="Select character for this line of dialog."
            onChange={handleSelect}
            defaultValue={characterIdx}
          >
            <option>Choose Character</option>
            {this.props.characters.map((c, idx) => {
              return (
                <option key={idx} value={idx}>
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
