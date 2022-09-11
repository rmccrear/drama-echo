import React, { useState } from "react";
import PropTypes from "prop-types";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
// import { Link } from "react-router-dom";
import { BsFillRecord2Fill, BsStopCircle } from "react-icons/bs";

import {
  getPracticeFromDialogId,
  setCharacterIdxForPratice,
  updateEcho,
} from "../../models/echoes";
import withAuth from "../../withAuth";
import withParams from "../../withParams";
import withMediaRecorder from "../../withMediaRecorder";
import MediaDisplay from "../MediaDisplay";
import "./Echo.scss";
import "./EchoDialog.scss";
import Loading from "../Loading";
import {
  publicIdForPracticeEcho,
  getUploadSig,
  uploadFile,
} from "../CloudinaryUploader";

async function uploadPracticeEcho(practice, echo, blob) {
  const folder = "echodialog_echoes";
  const publicId = publicIdForPracticeEcho(practice, echo);
  const signData = await getUploadSig(publicId, folder);
  const resp = await uploadFile(blob, signData, publicId, folder);
  return resp;
}

class EchoDialog extends React.Component {
  constructor(props) {
    super(props);
    this.handleCharacterSelect = this.handleCharacterSelect.bind(this);
    this.handleRecording = this.handleRecording.bind(this);
    this.state = {
      practice: {},
      loading: true,
      stage: null,
      lineEchoes: [],
    };
  }
  async fetchAndInitializePractice(dialog_id) {
    const practice = await getPracticeFromDialogId(dialog_id);
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
      while (!this.state.practice.dialog && tries < maxTries) {
        await this.fetchAndInitializePractice(dialog_id);
        tries = tries + 1;
      }
    }
  }
  async handleCharacterSelect(characterIdx) {
    this.setState({ ...this.state, loading: true });
    await setCharacterIdxForPratice(characterIdx, this.state.practice._id);
    //this.state.practice.characterIdx = characterIdx;
    const practice = { ...this.state.practice, characterIdx };
    this.setState({
      ...this.state,
      loading: false,
      practice,
    });
  }
  async handleRecording(echo, blob) {
    const resp = await uploadPracticeEcho(this.state.practice, echo, blob);
    // TODO: upload url
    // echo.echoAudioUrl = resp.secure_url;
    const resp2 = await updateEcho(this.state.practice._id, {
      _id: echo._id,
      echoAudioUrl: resp.secure_url,
    });
    console.log(resp);
    console.log(resp2);
  }
  myEchoes(echoes, lines) {
    return echoes.map((echo, idx) => ({ echo: echo, line: lines[idx] }));
  }
  render() {
    return this.state.loading ? (
      <Loading />
    ) : this.state.practice.characterIdx === -1 ? (
      <>
        <ChooseCharacter
          title={this.state.practice.dialog.title}
          characters={this.state.practice.dialog.characters}
          handleCharacterSelect={this.handleCharacterSelect}
          demoMedia={this.state.practice.dialog.demoMedia}
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
          onRecordingDone={this.handleRecording}
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
EchoDialog.propTypes = {
  params: PropTypes.object,
};

class LineEchoListingDisplay extends React.Component {
  render() {
    const lineEchoes = this.props.lineEchoes;
    return (
      <>
        {lineEchoes.map((lineEcho) => (
          <LineEcho
            key={lineEcho.echo._id}
            className="m-3"
            lineEcho={lineEcho}
            myCharIdx={this.props.characterIdx}
            characters={this.props.characters}
            onRecordingDone={this.props.onRecordingDone}
          />
        ))}
      </>
    );
  }
}
LineEchoListingDisplay.propTypes = {
  lineEchoes: PropTypes.array,
  characterIdx: PropTypes.number,
  characters: PropTypes.array,
};

const LineEcho = (props) => {
  if (props.myCharIdx === props.lineEcho.line.characterIdx) {
    return <LineMine {...props} />;
  } else {
    return <LineYours {...props} />;
  }
};

const LineYours = ({ characters, lineEcho }) => {
  return (
    <div
      className="speech-bubble-outer float-end clearfix"
      style={{ width: "60%" }}
    >
      <div className="speech-bubble-yours  ">
        <strong>{charFromIdx(characters, lineEcho.line.characterIdx)}</strong>
        <p>{lineEcho.line.content}</p>
        <AudioMedia audioUrl={lineEcho.line.audioUrl} controls={true} />
      </div>
    </div>
  );
};

const charFromIdx = (characters, idx) => characters[idx];
// LineMine needs withMediaRecorder because we want to call initUserMedia just after the
// record button appears, but before the use clicks on the record button. This is
// to avoid the permission popup interfering with the actual recording.
const LineMine = withMediaRecorder(
  ({ initUserMedia, characters, lineEcho, onRecordingDone }) => {
    console.log(lineEcho);
    const myEchoAudioUrl = lineEcho?.echo?.echoAudioUrl;
    const [donePlaying, setDonePlaying] = useState(false);
    const [audioUrl, setAudioUrl] = useState(myEchoAudioUrl);
    const [audioMime, setAudioMime] = useState(null);
    const [echoMediaKey, setEchoMediaKey] = useState(lineEcho.echo._id);
    const handleOnPause = (e) => {
      setDonePlaying(true);
      initUserMedia();
    };
    const handleBlob = async (blobAndType) => {
      const [blob, type] = blobAndType;
      const url = window.URL.createObjectURL(blob);
      setAudioUrl(url);
      setAudioMime(type);
      setEchoMediaKey(url); // rerender audio tag, since audio tags dont update on src changes.
      console.log(lineEcho, blob);
      onRecordingDone(lineEcho.echo, blob);
    };
    return (
      <div
        className="speech-bubble-outer float-start clearfix"
        style={{ width: "60%" }}
      >
        <div className="speech-bubble-mine ">
          <p>
            <strong>
              {charFromIdx(characters, lineEcho.line.characterIdx)} (You)
            </strong>
          </p>
          <p>
            {donePlaying && <strong>Say: </strong>}
            {lineEcho.line.content}
          </p>
          {!donePlaying ? (
            <AudioMedia
              audioUrl={lineEcho.line.audioUrl}
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
              key={echoMediaKey}
            />
          ) : (
            ""
          )}
        </div>
      </div>
    );
  }
);

const AudioMedia = ({
  controls,
  loop,
  handleOnPlay,
  handleOnPause,
  audioUrl,
  mimetype,
  key,
}) => {
  return (
    <audio
      controls={controls}
      loop={loop}
      onPlay={handleOnPlay}
      onPause={handleOnPause}
      key={key}
    >
      <source src={audioUrl} type={mimetype} />
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
  const { title, characters, handleCharacterSelect, demoMedia } = props;
  console.log(demoMedia);
  return (
    <Card style={{ width: "18rem" }} className="mx-auto">
      <h1>{title}</h1>
      <MediaDisplay demoMedia={demoMedia} />
      <h2> Choose your role. </h2>
      <Card.Body>
        <Button
          style={{ float: "left", margin: "3px" }}
          className="clearfix"
          onClick={() => props.handleCharacterSelect(0)}
        >
          Choose {characters[0]}
        </Button>
        {characters.length > 1 && (
          <Button
            style={{ float: "right", margin: "3px" }}
            className="clearfix"
            onClick={() => handleCharacterSelect(1)}
          >
            Choose {characters[1]}
          </Button>
        )}
      </Card.Body>
    </Card>
  );
};

export default withParams(withAuth(EchoDialog));
