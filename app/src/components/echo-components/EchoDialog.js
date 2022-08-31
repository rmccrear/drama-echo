import React, { useState } from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
// import { Link } from "react-router-dom";
import { BsFillRecord2Fill, BsStopCircle } from "react-icons/bs";

import {
  getPracticeFromDialogId,
  setCharacterIdxForPratice,
} from "../../models/echoes";
import withAuth from "../../withAuth";
import withParams from "../../withParams";
import withMediaRecorder from "../../withMediaRecorder";
import "./Echo.scss";
import "./EchoDialog.scss";

class EchoDialog extends React.Component {
  constructor(props) {
    super(props);
    this.handleCharacterSelect = this.handleCharacterSelect.bind(this);
    this.handleCharacterSelect = this.handleCharacterSelect.bind(this);
    this.state = {
      practice: {},
      loading: true,
      stage: null,
      lineEchoes: [],
    };
  }
  async fetchAndInitializePractice(dialog_id) {
    console.log("starting componentDidMount", this.props);
    const practice = await getPracticeFromDialogId(dialog_id);
    console.log("finish getPracticeFromDialogId", practice);
    this.setState({
      ...this.state,
      practice,
      lineEchoes: this.myEchoes(practice.echoes, practice.dialog.lines),
      loading: false,
    });
    return practice;
  }
  async componentDidMount() {
    await this.props.setupAccessToken();
    const dialog_id = this.props.params.dialog_id;
    try {
      await this.fetchAndInitializePractice(dialog_id);
    } catch (e) {
      console.log(e);
      // compoementDidMount my be called twice when loading,
      // which can cause a server error because of a unique constraint
      // when accessing the firt time.
      // Try again in case of slow network or server error
      let tries = 0;
      const maxTries = 3;
      while (!this.state.practice.dialogs && tries < maxTries)
        await this.fetchAndInitializePractice(dialog_id);
    }
  }
  async handleCharacterSelect(characterIdx) {
    this.setState({ ...this.state, loading: true });
    await setCharacterIdxForPratice(characterIdx, this.state.practice._id);
    this.state.practice.characterIdx = characterIdx;
    this.setState({
      ...this.state,
      loading: false,
      lineEchoes: this.myEchoes(),
    });
    console.log(this.myEchoes());
  }
  myEchoes(echoes, lines) {
    console.log(echoes, lines);
    return echoes.map((echo, idx) => ({ echo: echo, line: lines[idx] }));
  }
  render() {
    console.log(this.props);
    console.log(this.state);
    return this.state.loading ? (
      "loading..."
    ) : this.state.practice.characterIdx === -1 ? (
      <>
        <ChooseCharacter
          title={this.state.practice.dialog.title}
          characters={this.state.practice.dialog.characters}
          handleCharacterSelect={this.handleCharacterSelect}
        />
      </>
    ) : (
      <div className="container">
        <div className="row">
          <Card>
            <Card.Body>
              <Card.Header>
                <h1>{this.state.practice.dialog.title}</h1>
              </Card.Header>
              <Card.Text>
                Are you ready to start? Listen to the dialog below. After you
                listen, record yourself speaking your role. When you are done,
                click the "Done" button.
              </Card.Text>
            </Card.Body>
          </Card>
        </div>
        <LineEchoListingDisplay
          className="clearfix"
          lineEchoes={this.state.lineEchoes}
          characterIdx={this.state.practice.characterIdx}
          characters={this.state.practice.dialog.characters}
        />
        <div className="done-button-container clearfix">
          <Card>
            <Button
              onClick={() => {
                alert("Ok! Thanks for playing!");
              }}
            >
              Done
            </Button>
          </Card>
        </div>
      </div>
    );
  }
}

class LineEchoListingDisplay extends React.Component {
  constructor(props) {
    super(props);
    console.log(props.lineEchoes);
  }
  render() {
    const lineEchoes = this.props.lineEchoes;
    console.log(lineEchoes.length);
    return (
      <>
        {lineEchoes.map((lineEcho) => (
          <>
            <LineEcho
              key={lineEcho.echo._id}
              className="m-3"
              lineEcho={lineEcho}
              myCharIdx={this.props.characterIdx}
              characters={this.props.characters}
            />
          </>
        ))}
      </>
    );
  }
}

const LineEcho = (props) => {
  console.log(props.lineEcho);
  if (props.myCharIdx === props.lineEcho.line.characterIdx) {
    return <LineMine {...props} />;
  } else {
    return <LineYours {...props} />;
  }
};

const LineYours = (props) => {
  return (
    <div
      className="speech-bubble-outer float-end clearfix"
      style={{ width: "60%" }}
    >
      <div className="speech-bubble-yours  ">
        <strong>
          {charFromIdx(props.characters, props.lineEcho.line.characterIdx)}
        </strong>
        <p>{props.lineEcho.line.content}</p>
        <AudioMedia audioUrl={props.lineEcho.line.audioUrl} controls={true} />
      </div>
    </div>
  );
};

const charFromIdx = (characters, idx) => characters[idx];
const LineMine = (props) => {
  const [donePlaying, setDonePlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [audioMime, setAudioMime] = useState(null);
  const handleOnPause = (e) => {
    setDonePlaying(true);
  };
  const handleBlob = (blobAndType) => {
    const [blob, type] = blobAndType;
    const url = window.URL.createObjectURL(blob);
    setAudioUrl(url);
    setAudioMime(type);
  };
  return (
    <div
      className="speech-bubble-outer float-start clearfix"
      style={{ width: "60%" }}
    >
      <div className="speech-bubble-mine ">
        <p>
          <strong>
            {charFromIdx(props.characters, props.lineEcho.line.characterIdx)}{" "}
            (You)
          </strong>
        </p>
        <p>
          {donePlaying && <strong>Say: </strong>}
          {props.lineEcho.line.content}
        </p>
        {!donePlaying ? (
          <AudioMedia
            audioUrl={props.lineEcho.line.audioUrl}
            handleOnPause={handleOnPause}
            loop={true}
            controls={true}
          />
        ) : (
          <AudioRecorder handleBlob={handleBlob} />
        )}
        {audioUrl ? (
          <AudioMedia
            audioUrl={audioUrl}
            controls={true}
            mimetype={audioMime}
          />
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

const AudioMedia = (props) => {
  return (
    <audio
      controls={props.controls}
      loop={props.loop}
      onPlay={props.handleOnPlay}
      onPause={props.handleOnPause}
    >
      <source src={props.audioUrl} type={props.mimetype} />
    </audio>
  );
};
class AudioRecorderBase extends React.Component {
  constructor(props) {
    super(props);
    this.handleFinish = this.handleFinish.bind(this);
  }
  async handleFinish() {
    const [blob, type] = await this.props.stopRecording();
    this.props.handleBlob([blob, type]);
  }
  render() {
    console.log(this.props.mediaRecorderState);
    return (
      <div>
        {this.props.mediaRecorderState !== "recording" ? (
          <>
            <div>
              <BsFillRecord2Fill
                style={{ color: "red" }}
                size="5rem"
                onClick={this.props.startRecording}
              />
            </div>
            <div onClick={this.props.startRecording}>
              <small>[ Tap to record your voice ]</small>
            </div>
          </>
        ) : (
          <>
            <div>
              <BsStopCircle
                style={{ color: "red" }}
                size="5rem"
                onClick={this.handleFinish}
              />
            </div>
            <div onClick={this.handleFinish}>
              <small>[ Tap to stop ]</small>
            </div>
          </>
        )}
      </div>
    );
  }
}
const AudioRecorder = withMediaRecorder(AudioRecorderBase);

const ChooseCharacter = (props) => {
  return (
    <Card style={{ width: "18rem" }} className="mx-auto">
      <h1>{props.title}</h1>
      <h2> Choose your role. </h2>
      <Card.Body>
        <Button
          style={{ float: "left" }}
          className="clearfix"
          onClick={() => props.handleCharacterSelect(0)}
        >
          Choose {props.characters[0]}
        </Button>
        {props.characters.length > 1 && (
          <Button
            style={{ float: "right" }}
            className="clearfix"
            onClick={() => props.handleCharacterSelect(1)}
          >
            Choose {props.characters[1]}
          </Button>
        )}
      </Card.Body>
    </Card>
  );
};

export default withParams(withAuth(EchoDialog));
