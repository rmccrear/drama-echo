import React from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import withParams from "../../withParams";

import "./Echo.scss";

class DialogDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.goToEcho = this.goToEcho.bind(this);
  }
  goToEcho() {
    this.props.navigate(`/echo/${this.props.dialog._id}`);
  }
  render() {
    const { dialog } = this.props;
    return (
      <Card className="dialog-display">
        <Card.Header>
          <h1> {dialog.title} </h1>
          <MediaDisplay demoMedia={dialog.demoMedia} />
        </Card.Header>
        <Card.Body>
          <p onClick={this.goToEcho}>Character 1: {dialog.characters[0]}</p>
          <p onClick={this.goToEcho}>
            Character 2: {dialog.characters[1] || "_"}
          </p>
          <Button onClick={this.goToEcho}>Make an Echo</Button>
        </Card.Body>
      </Card>
    );
  }
}

const MediaDisplay = (props) => {
  const { demoMedia } = props;
  if (demoMedia && demoMedia.mediaType === "video" && demoMedia.url) {
    return (
      <video controls={true} className="media-demo-video">
        <source src={demoMedia.url} />
      </video>
    );
  } else if (demoMedia && demoMedia.mediaType === "audio" && demoMedia.url) {
    return (
      <audio controls={true} className="media-demo-audio">
        <source src={demoMedia.url} />
      </audio>
    );
  } else {
    return "";
  }
};

export default withParams(DialogDisplay);
